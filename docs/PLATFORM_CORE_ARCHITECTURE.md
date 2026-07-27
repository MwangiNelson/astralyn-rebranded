# Astralyn Core — Platform Architecture

Version 1.0 · July 2026

The shared spine beneath every Astralyn product. This document is the contract
between Core and the products that consume it.

---

## 1. Design rules

Six rules. Everything else follows.

1. **Core owns identity, money, messages, entitlements, documents and audit.
   Products own their domain and nothing else.** If two products would write
   the same code, it belongs in Core.
2. **Core services are network services, not a shared library.** A library
   version-skews across five products and drags every product's language
   choice with it. HTTP + a thin generated SDK per language.
3. **Products never talk to each other directly.** They emit events to Trace
   and react to them. Direct product-to-product calls create a dependency
   graph nobody can deploy.
4. **The tenant is the unit of isolation, and it is enforced in the database.**
   Application-layer tenancy is one forgotten `WHERE` clause from a breach.
5. **Every Core call is idempotent.** Mobile money webhooks retry, networks
   fail mid-write, and operators double-tap. Idempotency keys are mandatory,
   not optional.
6. **Core degrades gracefully.** If Signal is down, a product queues messages;
   it does not fail the operator's transaction. Only Aegis is allowed to be a
   hard dependency.

---

## 2. Topology

```
                    ┌──────────────────────────────────────┐
                    │            PRODUCTS                  │
                    │                                      │
                    │  Relay   Tenure   Ledger             │
                    │  Concierge   Roster                  │
                    └───────────────┬──────────────────────┘
                                    │  OIDC · REST · webhooks
                    ┌───────────────▼──────────────────────┐
                    │           ASTRALYN CORE              │
                    │                                      │
                    │  Aegis    identity · tenancy · RBAC  │
                    │  Rail     payments · payouts         │
                    │  Signal   sms · whatsapp · email     │
                    │  Meter    plans · entitlements       │
                    │  Vault    documents · signature      │
                    │  Trace    audit log · event bus      │
                    └───────────────┬──────────────────────┘
                                    │
                    ┌───────────────▼──────────────────────┐
                    │  Postgres · Redis · S3 · Daraja ·    │
                    │  WhatsApp Cloud API · SMTP/SMS       │
                    └──────────────────────────────────────┘
```

---

## 3. Aegis — identity and access

The first thing to build, because nothing else can be multi-tenant until it
exists.

### 3.1 Standard, not bespoke

Aegis is an **OAuth 2.1 authorisation server with OpenID Connect**. We
implement the spec rather than inventing a token format, because the spec has
already survived the attacks we have not thought of.

**Build on an existing engine, do not write a crypto stack.** Recommendation:
[Ory Hydra](https://www.ory.sh/hydra/) (certified OIDC, headless, we own the
login UI and the user store) or Keycloak if we prefer batteries-included.
Aegis is then *our* login experience, tenancy model and admin API wrapped
around a certified core. Writing an IdP from scratch is the single most
expensive mistake available to a four-person team.

### 3.2 The tenancy model

Three levels, and the distinction matters:

```
Account          a human being.        One per real person, ever.
   │             Identified by phone (primary) or email.
   │
   ├── Membership        an Account's role inside one Organisation
   │
Organisation     the customer.         "Kimani Transport Sacco"
   │             Billing lives here. Data isolation lives here.
   │
   └── Workspace         an optional subdivision
                         Relay: a depot.  Tenure: a building.
```

**One Account, many Organisations.** This is the cross-sell mechanism made
concrete: the landlord who also runs three matatus is one Account with a
Membership in a Tenure Organisation and a Membership in a Relay Organisation.
They sign in once.

> **Phone number is the primary identifier, not email.** This customer has a
> phone; they may not check email. It forces us to handle number reassignment
> (carriers recycle numbers) — Accounts are keyed on an immutable UUID and the
> phone is a verified, revocable credential, never the primary key.

### 3.3 Token design

Short-lived JWT access tokens, opaque refresh tokens, rotation on every use.

```jsonc
{
  "iss": "https://id.astralyn.com",
  "sub": "acc_01HQ...",           // Account — stable forever
  "aud": ["relay"],               // which product this token is for
  "org": "org_01HQ...",           // active Organisation
  "wsp": "wsp_01HQ...",           // active Workspace, optional
  "rol": ["fleet_manager"],       // roles in THIS org
  "scp": "vehicles:write trips:write reports:read",
  "ent": ["relay.pro"],           // entitlement, cached from Meter
  "sid": "ses_01HQ...",           // session, for global sign-out
  "exp": 1753000000,              // 15 minutes
  "jti": "..."
}
```

Design notes worth defending:

- **`org` is in the token.** A token is scoped to one Organisation. Switching
  org means a token exchange, not a query parameter — so a product physically
  cannot read across tenants with the token it holds.
- **Access tokens live 15 minutes.** Long enough to be cheap, short enough
  that revocation via refresh-rotation is meaningful.
- **Entitlements are cached in the token, with a 15-minute worst-case
  staleness.** A downgrade takes effect within one token cycle. Upgrades call
  Meter directly for instant effect, because making a paying customer wait is
  the wrong failure mode.
- **RS256, keys rotated quarterly**, published at
  `/.well-known/jwks.json`. Products verify locally — no network call on the
  hot path.

### 3.4 Flows

| Client | Flow |
|--------|------|
| Web apps (all products) | Authorization Code + PKCE |
| Mobile (Roster, driver apps) | Authorization Code + PKCE, refresh rotation |
| Service-to-service | Client Credentials, per-service client |
| WhatsApp entry (Concierge) | Device-style code exchange — see below |

**The WhatsApp flow** already exists in prototype in `tenda-chapchap` and
should be promoted into Aegis as a first-class grant: a reusable opaque link
key identifies the returning user, a single-use code is exchanged for tokens,
and an expired code silently re-issues when the reusable key is present. It is
the right pattern for a customer who lives in WhatsApp and will not tolerate a
password.

### 3.5 Authorisation

Roles are defined per product, granted per Organisation, and resolved to
scopes by Aegis at token issue.

```
relay.owner          full access to the Organisation's fleet
relay.manager        operations, no financial settings
relay.clerk          record trips and collections only
tenure.owner / tenure.agent / tenure.caretaker
core.org_admin       manage members and billing (cross-product)
```

Products enforce scopes on every endpoint. Aegis is the only thing that
decides what a role means.

### 3.6 Migrating the existing fleet system

`mat-app-backend` currently has `users.password_hash`, its own JWT signing and
a `password_reset_tokens` table. Cutover, without a flag day:

1. Stand up Aegis. Import each existing `users` row as an Account, with the
   Organisation derived from the deployment it belonged to.
2. Add Aegis token verification to the API **alongside** the legacy verifier.
   Accept either. No user notices.
3. Move the login screen to the Aegis hosted flow. Existing password hashes
   (bcrypt) import directly — nobody resets anything.
4. Once no legacy tokens have been seen for a full refresh period, delete the
   legacy verifier, `password_hash` and `password_reset_tokens`.

Step 2 is what makes this safe: there is never a moment where a working
session breaks.

---

## 4. Rail — payments

One interface over M‑Pesa (Daraja), cards and bank transfer.

**What Rail owns**

- Collection: STK push, C2B paybill/till, card, bank reference
- Payouts: B2C, bank transfer
- A normalised `Transaction` shape every product already understands
- Webhook receipt, verification, **de-duplication** and retry
- A double-entry ledger of every movement

**Why the ledger lives in Rail rather than in each product**

Mobile money arrives without reliably telling you who sent it. Matching a
payment to a customer is the same problem in Relay (a driver's daily
remittance), Tenure (a tenant's rent) and Ledger (an invoice). Solving it once
is the point.

```
POST /rail/v1/collections
Idempotency-Key: <uuid>          ← mandatory, 24h replay window
{
  "org": "org_01HQ...",
  "method": "mpesa_stk",
  "amount": { "currency": "KES", "value": 250000 },   // minor units, integer
  "payer": { "msisdn": "+2547..." },
  "reference": { "kind": "invoice", "id": "inv_01HQ..." },
  "callback": "https://tenure.astralyn.com/hooks/rail"
}
```

> **Money is integer minor units, always.** No floats anywhere in the system.
> A rounding error in a rent ledger is a support ticket that costs more than
> the transaction.

**Webhook discipline.** Daraja retries and occasionally duplicates. Every
inbound callback is written to an append-only `rail_events` table keyed on the
provider's transaction ID with a unique constraint; duplicates fail the insert
and are acknowledged without reprocessing. This one constraint prevents the
most expensive class of bug in the system.

---

## 5. Signal — messaging

SMS, WhatsApp, email and push behind one send.

```
POST /signal/v1/send
{
  "org": "org_01HQ...",
  "to": { "account": "acc_01HQ..." },     // Signal resolves the channel
  "template": "relay.insurance_expiring",
  "data": { "reg_no": "KDA 123A", "days": 14 },
  "channels": ["whatsapp", "sms"],        // ordered fallback
  "urgency": "normal"
}
```

Signal owns templates, localisation, per-org throttling, delivery receipts,
**quiet hours** and opt-out. Quiet hours matter more than they sound: a
compliance reminder at 03:00 loses the customer.

Channel fallback is ordered, not parallel — WhatsApp first because it is
cheap and rich, SMS only if WhatsApp fails or is unavailable.

---

## 6. Meter — billing and entitlements

Plans, subscriptions, usage and limits.

The product-facing surface is deliberately tiny:

```
GET /meter/v1/entitlement?org=...&feature=relay.gps_tracking
→ { "allowed": true, "limit": 25, "used": 18 }
```

A product asks whether a tenant may do a thing. It never implements
subscriptions, proration or dunning. Usage is reported as events to Trace and
aggregated by Meter, so metering is never on a product's write path.

**Per-asset pricing is a Meter concept.** `relay.vehicles_active` is the
billable quantity; Relay reports the count, Meter prices it.

---

## 7. Vault — documents

Storage, generation, signature and retention for leases, logbooks, statements
and notices.

- Generation from templates (statements, invoices, notices)
- E-signature — the [`gopaperless-ke`](https://github.com/MwangiNelson/gopaperless-ke)
  work is the seed here
- **Retention policy attached to the document class, not to the app.** A lease
  has a legally-mandated retention period; that rule belongs with the document.
- Signed, expiring URLs. Documents are never public.

---

## 8. Trace — audit and events

Two jobs from one log.

**Audit** — append-only, tamper-evident, who did what to which record, in
which org, from which IP. This is what makes us credible to a customer whose
regulator asks questions, and it is why it cannot be a per-product afterthought.

**Event bus** — the same events, published for products to react to.

```jsonc
{
  "id": "evt_01HQ...",
  "type": "relay.trip.recorded",
  "org": "org_01HQ...",
  "actor": { "account": "acc_01HQ...", "ip": "..." },
  "subject": { "kind": "trip", "id": "trp_01HQ..." },
  "at": "2026-07-26T09:14:22Z",
  "data": { "collected": 450000, "vehicle": "veh_01HQ..." }
}
```

Start with Postgres `LISTEN/NOTIFY` plus an outbox table. It is sufficient to
well past our first thousand customers and it does not add an operational
component we would have to staff. Move to a broker when a measurement — not an
instinct — says to.

---

## 9. Data isolation

Every tenant-scoped table carries `org_id`, and **Postgres Row-Level Security
enforces it**:

```sql
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_isolation ON trips
  USING (org_id = current_setting('app.current_org')::uuid);
```

The application sets `app.current_org` from the verified token at the start of
every request, inside the transaction. A forgotten `WHERE org_id = ...` then
returns zero rows instead of another customer's data.

**Shared database, shared schema, RLS** — chosen over schema-per-tenant
(migration pain at scale) and database-per-tenant (cost, connection limits).
A single customer large enough to want physical isolation is a good problem;
we solve it then, for them, and charge for it.

---

## 10. Build order

Core is built only as far as the next product actually needs it. Speculative
platform work is the failure mode this section exists to prevent.

| Phase | Build | Unblocks |
|-------|-------|----------|
| **0** | Aegis: OIDC, Accounts, Orgs, RBAC, hosted login | Everything |
| **0** | Trace: audit log + outbox | Compliance from day one |
| **1** | Rail: M‑Pesa collect + reconcile | Relay commercial launch |
| **1** | Signal: SMS + WhatsApp send | Relay expiry reminders |
| **2** | Meter: plans + entitlements | Charging anyone |
| **2** | Vault: storage + generation | Tenure leases and statements |
| **3** | Rail payouts, Vault signature, Signal push | Tenure, Roster |

Phases 0 and 1 are the real commitment — roughly a quarter. Phase 2 onward is
paid for by revenue from Relay.

---

## 11. Operational posture

- **One Postgres cluster** with per-service schemas until measurement forces a
  split. Five databases at four founders is a hobby, not an architecture.
- **Managed everything** — database, object storage, queues. We are not being
  paid to run infrastructure.
- **Every Core service ships with a status endpoint and a synthetic check.**
  A product must be able to tell "Signal is down" from "my code is broken".
- **Aegis is the only hard dependency.** If Aegis is down, nobody signs in;
  that is acceptable and is why it gets the strictest availability target.
  Everything else degrades to a queue.

---

## 12. Open questions

Genuine unknowns, recorded rather than guessed:

1. **Hydra or Keycloak?** Hydra is leaner and headless; Keycloak is
   batteries-included but heavier to operate. Needs a two-day spike.
2. **Does Meter need to be a service in year one,** or is a plans table inside
   Aegis enough until product three?
3. **Where does the Concierge LLM boundary sit** — does it call product APIs
   with the user's own token (clean, auditable, slower) or hold a service
   token with delegated scope (faster, riskier)? Leaning toward the former.
4. **Data residency.** Is there a regulatory requirement to keep Kenyan
   customer data in-country? This changes the hosting decision and needs a
   legal answer before phase 1, not after.
5. **Do we ever sell Core itself** as an identity/payments platform to other
   Kenyan software teams? Plausible sixth product. Not now.

---

Powered by Astralyn.
