# PRD — Aegis, by Astralyn

**Identity & Access** · Status: **Foundation — build first**
Version 1.0 · July 2026

---

## 1. Summary

Aegis is Astralyn's identity provider: one OIDC authorisation server that every
product in the suite delegates authentication and authorisation to.

It is infrastructure, not a product we sell on day one. It exists so that we
never write a login screen, a password reset flow, a session store, an
invitation email or a role system again. Its second job is strategic: because
identity is shared, a customer who buys two Astralyn products gets one account
across both — a switching cost and a cross-sell path competitors selling
single apps cannot replicate.

Architecture detail lives in
[PLATFORM_CORE_ARCHITECTURE.md §3](../PLATFORM_CORE_ARCHITECTURE.md#3-aegis--identity-and-access).
This document covers what it must do and why.

---

## 2. The problem

Every product we ship needs the same nine things: sign-up, sign-in, password
reset, session management, organisations, invitations, roles, permission
checks, and sign-out everywhere.

Built per product, that is roughly 4–6 weeks each, five times over, in
inconsistent quality, with five different places for a vulnerability to live.
It is also the least differentiated code in the company — no customer has ever
chosen a fleet system because of its password reset.

Worse, without shared identity the suite is not a suite. It is five unrelated
apps that happen to have the same logo, and the cross-sell argument
disappears.

---

## 3. Users

**Products** are the primary consumer. Aegis's user experience is its SDK and
its token contract.

**End users** — fleet owners, landlords, clerks, tenants — meet Aegis as the
sign-in screen. It must feel like part of the product they are entering, not
like a redirect to a third party.

**Org admins** manage members, roles and invitations through Aegis's
account UI, shared across products.

**Us** — support needs to impersonate (safely, audibly) to diagnose a customer
problem without asking for a password.

---

## 4. Requirements

### Must have — V1

- **OIDC / OAuth 2.1 authorisation server**, standards-compliant, built on a
  certified engine (Ory Hydra or Keycloak — see open questions). We do not
  write token crypto.
- **Phone-primary accounts.** Phone number with OTP verification is the
  primary credential; email optional. This customer has a phone and may not
  check email.
- **Password + OTP sign-in.** Passwordless OTP as the default path, password
  as an option for desktop-heavy users.
- **Account / Organisation / Workspace model** with one Account able to hold
  memberships in many Organisations.
- **Roles and scopes**, defined per product, granted per organisation,
  resolved to scopes at token issue.
- **Hosted, themeable login** matching Astralyn's design language.
- **Invitations** — invite by phone or email, accept into a role.
- **Refresh token rotation** with reuse detection.
- **Global sign-out** by session ID.
- **JWKS endpoint** with quarterly key rotation.
- **Service-to-service auth** via client credentials.
- **Audit to Trace** on every authentication event.

### Must have — before any product bills a customer

- **Support impersonation**, time-boxed, consent-gated, loudly audited, and
  visibly flagged in the product UI while active.
- **Account recovery** that survives a lost phone. This is the hardest
  requirement in the document and the one most likely to generate support
  load.

### Later

- MFA (TOTP) for org admins
- Social sign-in (Google) for desktop users
- SAML for institutional customers
- Delegated access — an accountant granted scoped, expiring access to an org
- Selling Aegis as a standalone product to other local software teams

### Explicitly out of scope

- Writing our own cryptography or token format
- Being a general-purpose IdP for arbitrary third parties (V1)
- Biometrics

---

## 5. Key flows

### 5.1 First sign-up

```
Phone number → OTP → verify → create Account
  → create Organisation (name, type)
  → Account becomes core.org_admin + product owner role
  → redirect to product with tokens
```

No email required. No password required. The fastest possible path from
intent to inside the product.

### 5.2 Invitation

```
Org admin enters phone + role
  → Signal sends a WhatsApp/SMS invite with a single-use link
  → invitee: OTP → Account created or matched to an existing one
  → Membership created in that Organisation with that role
```

Matching to an existing Account is what makes one-person-many-orgs work.

### 5.3 Switching organisation

```
Product calls POST /aegis/v1/token/exchange with target org
  → Aegis verifies the Account has a Membership there
  → issues a new access token scoped to the new org
```

The old token is never valid for the new org. Tenant isolation is enforced by
the token itself, not by a query parameter the product must remember to check.

### 5.4 Lost phone

```
Recovery email if set → OTP to email → re-bind new phone
  else → support-verified recovery, dual-approved, fully audited
```

The support path is deliberately slow and manual. An account takeover here
compromises a customer's entire financial record.

---

## 6. Token contract

The contract products depend on. Changing it is a breaking change to every
product simultaneously, so it is versioned and additive-only.

```jsonc
{
  "iss": "https://id.astralyn.com",
  "sub": "acc_...",       // Account, stable forever
  "aud": ["relay"],       // product this token is for
  "org": "org_...",       // active Organisation — isolation boundary
  "wsp": "wsp_...",       // optional Workspace
  "rol": ["fleet_manager"],
  "scp": "vehicles:write trips:write reports:read",
  "ent": ["relay.pro"],   // entitlement cache, ≤15 min stale
  "sid": "ses_...",
  "exp": 1753000000,      // 15 minutes
  "jti": "..."
}
```

RS256. Products verify locally against JWKS — no network call on the request
path.

---

## 7. Dependencies

| Service | Used for |
|---------|----------|
| **Signal** | OTP delivery, invitations, security notifications |
| **Trace** | Audit of every auth event |
| **Meter** | Entitlement values embedded in `ent` at token issue |

Aegis depends on Signal for OTP, which makes Signal a launch blocker for
Aegis. Worth stating explicitly: **build a minimal SMS-only Signal before
Aegis is usable**, then enrich it.

---

## 8. Success metrics

- **Time to integrate a new product**: target under one day.
- **Sign-up completion rate**: >85% of started sign-ups reach a product.
- **OTP delivery success**: >98% within 30 seconds.
- **Auth availability**: 99.9%. Aegis down means the whole suite is down.
- **Support tickets about access**: trending to near zero. Rising numbers mean
  the recovery flow is wrong.

---

## 9. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Aegis is a single point of failure for the suite | **Critical** | Highest availability target; stateless verification so products survive brief outages; aggressive JWKS caching |
| Building an IdP from scratch | **Critical** | We do not. Certified engine underneath, our UX and tenancy on top |
| Phone number reassignment by carriers | High | Accounts keyed on UUID; phone is a revocable credential; re-verify on suspicious change |
| Account recovery abused for takeover | High | Slow, dual-approved, fully audited manual path |
| OTP costs at scale | Medium | WhatsApp-first delivery via Signal; SMS as fallback only |
| Token contract churn breaks products | Medium | Versioned, additive-only; contract tests in every product's CI |

---

## 10. Open questions

1. **Ory Hydra or Keycloak?** Hydra is leaner and headless — we own the user
   store and login UI, which fits our design standards. Keycloak is
   batteries-included but heavier to operate and harder to theme convincingly.
   **Two-day spike before committing.**
2. Do we need SAML at all, or is that a fantasy about enterprise customers we
   are not selling to?
3. Should Workspace exist in V1, or is Organisation enough until a customer
   asks for depots/buildings?
4. Where do end-user profile settings live — Aegis (consistent, one place) or
   each product (contextual)? Leaning Aegis, with product-specific preferences
   staying in the product.

---

Powered by Astralyn.
