# PRD — Relay, by Astralyn

**Fleet & Transport Operations** · Status: **Live** (commercialisation in progress)
Version 1.0 · July 2026

---

## 1. Summary

Relay is the operating system for a small-to-mid fleet: it records what each
vehicle earned today, what it cost, who was driving, and which of its
compliance documents is about to expire.

It is not a greenfield product. `mat-app-backend` (FastAPI + Postgres) and
`mat-app-UI` (React) are in production shape today with vehicles, drivers,
trips, daily summaries, deficits, locations, routes, dashboard and reports.
**This PRD covers turning a working single-tenant system into a sellable
multi-tenant SaaS.**

---

## 2. The problem

A fleet owner with 4–40 vehicles has three problems, in this order:

1. **They do not know today's number.** Collections are reported verbally or
   in a notebook, reconciled weekly if at all. Theft and leakage are invisible
   because there is no baseline to compare against.
2. **Compliance ambushes them.** Insurance, TLB licence, inspection and speed
   governor certificates all expire on different dates. The first sign of a
   lapse is a roadblock, an impounded vehicle, and a day of revenue lost —
   for a document that cost a fraction of the fine.
3. **Driver accountability is a memory contest.** Who had which vehicle, what
   they brought in, what they claimed for repairs — argued from recollection
   at the end of the month.

Existing options are enterprise telematics priced for logistics multinationals,
or a spreadsheet.

---

## 3. Target user

**Primary — the Owner.** 4–40 vehicles. Checks the business on a phone in the
evening. Wants one number per vehicle per day and no surprises.

**Secondary — the Clerk / Manager.** Records collections, often at a stage or
depot, sometimes on poor connectivity. Their data entry is the product's
lifeblood, so their flow must be faster than the notebook it replaces.

**Tertiary — the Driver.** Interacts minimally: sees their record, disputes an
entry. Not the buyer, but their trust in the numbers determines adoption.

### Segments
- Matatu SACCOs and owner-operators (Kenya, primary)
- Boda/tuk-tuk fleets
- Small logistics and delivery fleets
- Institutional fleets (schools, NGOs, county services)

---

## 4. Jobs to be done

| As a… | I want to… | So that… |
|-------|-----------|----------|
| Owner | see each vehicle's takings for today | I know if a vehicle is underperforming before the week ends |
| Owner | be warned 30/14/7 days before any document expires | I never lose a day to a roadblock |
| Owner | compare drivers on the same route | I know who to keep |
| Clerk | record a collection in under 15 seconds | recording is faster than not recording |
| Clerk | record while offline | a dead network does not cost me the day's data |
| Owner | see deficits owed by each driver | arrears are a number, not an argument |
| Owner | export a monthly statement | I can hand something to my accountant |

---

## 5. Scope

### V1 — commercialisation (from the existing system)

**Already built, needs hardening**
- Vehicle registry: reg no, model, owner, capacity, status
- Compliance dates: insurance, TLB, inspection, speed governor
- Driver registry: licence, phone, status, rating, photo
- Trips: driver, vehicle, route, collection amount, repair expense, notes
- Daily summaries per vehicle/driver
- Deficits
- Location capture
- Dashboard and reports

**New for V1 — the actual work**
- **Multi-tenancy.** `org_id` on every table, Postgres RLS, tested isolation
- **Aegis integration.** Replace local `password_hash` + bespoke JWT (see
  [migration plan](../PLATFORM_CORE_ARCHITECTURE.md#36-migrating-the-existing-fleet-system))
- **Expiry engine.** Scheduled scan → Signal notifications at 30/14/7/1 days
- **Meter integration.** Per-active-vehicle billing
- **Self-service onboarding.** Sign up, add vehicles, invite a clerk, with no
  human involved. This is the gate on whether product three ever exists.
- **Offline-tolerant collection entry.** Queue locally, sync on reconnect,
  idempotent on the server
- **Monthly statement export** (PDF via Vault, CSV)

### V1.1
- Driver mobile view — own record, dispute an entry
- Route profitability
- Fuel logging
- Maintenance schedule by mileage or date

### Later
- Live GPS tracking (hardware partnership — do not build the device)
- SACCO multi-owner accounting (each owner sees only their vehicles)
- Ledger integration for direct driver remittance via M‑Pesa
- Insurance renewal marketplace

### Explicitly out of scope
- Telematics hardware. Partner, never manufacture.
- Passenger-facing ticketing. Different product, different buyer.
- Payroll. That is Roster.

---

## 6. Data model

Extending the existing schema. New and changed fields marked.

```
Organisation (Core/Aegis)
  └── Vehicle
        id, org_id*, reg_no, model, owner, status, passenger_capacity
        insurance_expiry, tlb_expiry, inspection_expiry,
        speed_governor_expiry
        acquired_on*, disposed_on*          ← for accurate billing counts

  └── Driver
        id, org_id*, account_id*            ← links to an Aegis Account
        name, license_no, license_expiry*, phone, status, rating, photo_url

  └── Route
        id, org_id*, name, origin, destination, distance,
        estimated_duration, fare_amount, status

  └── Trip
        id, org_id*, driver_id, vehicle_id, route,
        collected_amount (integer minor units*), repair_expense,
        collection_time, status, notes, created_by,
        client_ref*                         ← idempotency for offline sync

  └── DailySummary
        id, org_id*, vehicle_id, driver_id, date,
        total_collected, total_expenses, net, deficit

  └── Deficit
        id, org_id*, driver_id, amount, reason, status, settled_at

  └── ComplianceAlert*
        id, org_id*, vehicle_id, kind, due_on, notified_at[], acknowledged_by
```

> **Two corrections carried over from the current schema.** `collected_amount`
> becomes integer minor units everywhere (it is currently a mix of Integer and
> Numeric, which will eventually produce a reconciliation dispute). And
> `Driver.license_expiry` is missing today — a lapsed driver's licence is the
> same class of risk as a lapsed vehicle document and belongs in the same
> engine.

---

## 7. Key flows

### 7.1 Recording a collection — the flow that must be fastest

```
Clerk opens app  →  vehicle already selected (last used, remembered)
                 →  driver pre-filled from today's assignment
                 →  types amount on a numeric keypad
                 →  Save
                 →  optimistic local write + queued sync
```

Target: **under 15 seconds, three taps, works offline.** If it is slower than
the notebook, the notebook wins and the product dies.

### 7.2 Compliance expiry

```
Nightly scan of all vehicles/drivers in every org
  → any date within 30/14/7/1 days → Signal
  → WhatsApp (preferred) with SMS fallback
  → Owner acknowledges in one tap; suppressed until the next threshold
  → Renewed date entered → alerts cleared, Trace records who changed it
```

### 7.3 Nightly close

```
23:59 org-local time
  → aggregate trips into DailySummary per vehicle and per driver
  → compute deficit against the route's expected fare where configured
  → emit relay.day.closed to Trace
  → morning digest to the Owner
```

---

## 8. Core dependencies

| Service | Used for |
|---------|----------|
| **Aegis** | Sign-in, orgs, roles (`relay.owner/manager/clerk`) |
| **Rail** | Driver remittance by M‑Pesa (V1.1); subscription collection |
| **Signal** | Expiry alerts, morning digest, deficit notices |
| **Meter** | Per-active-vehicle billing; feature gating |
| **Trace** | Audit of every financial edit — non-negotiable |
| **Vault** | Statement PDFs, logbook and certificate storage |

---

## 9. Pricing

| Tier | Vehicles | Price / vehicle / month | Includes |
|------|----------|------------------------|----------|
| Starter | 1–5 | KES 300 | Core records, expiry alerts |
| Fleet | 6–25 | KES 250 | + reports, multi-user, statements |
| Sacco | 26+ | KES 180 | + multi-owner, API, priority support |

Billed on **active** vehicles only — a vehicle off the road does not bill. That
is a deliberate trust-building choice and a support-load reduction, since the
alternative is a monthly argument about the invoice.

Free tier: 1 vehicle, forever. It is the cheapest sales channel we have.

---

## 10. Success metrics

**Activation** — % of signups recording a collection within 24h. Target 60%.
This is the single number that predicts everything else.

**Retention** — % of orgs recording on ≥20 days/month at month 3. Target 70%.

**Depth** — collections recorded per vehicle per month. Below ~20 the customer
is not really using it and will churn.

**Value proof** — compliance alerts acknowledged, then renewed before expiry.
This is the number that justifies the price in a renewal conversation.

**Commercial** — paying orgs; net revenue retention; CAC against 12-month LTV.

---

## 11. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Clerk data entry does not happen | **Critical** | Obsess over the 15-second flow; offline-first; nothing else matters if this fails |
| Price sensitivity in the matatu market | **High** | Validate willingness to pay before hardening; free single-vehicle tier |
| Owner distrusts numbers entered by staff | High | Trace audit visible to owner; driver can dispute; immutable edit history |
| Connectivity at stages and depots | High | Offline queue with idempotent sync — already in V1 scope |
| Multi-tenancy bugs leak data between fleets | **Critical** | RLS at the database, not the app; isolation tests in CI |
| SACCO politics — who owns the data | Medium | Multi-owner model in V1.1; org owns data, owner sees own vehicles |

---

## 12. Open questions

1. Do SACCOs buy centrally, or does each owner buy individually? Changes the
   pricing unit and the entire sales motion. **Needs five customer
   conversations before we harden anything.**
2. Is GPS a requirement to close deals, or a nice-to-have? Determines whether
   we need a hardware partner in year one.
3. Should driver remittance run through Rail in V1 rather than V1.1? It is the
   strongest retention hook in the product and may be worth pulling forward.
4. What is the real churn driver — price, or the clerk stopping data entry?
   Instrument for this from day one.

---

## 13. Provenance

Built from `MwangiNelson/mat-app-backend` (FastAPI, SQLAlchemy, Alembic,
Postgres, Redis) and `MwangiNelson/mat-app-UI` (React 19, Vite, Redux Toolkit,
Ant Design, Chart.js).

---

Powered by Astralyn.
