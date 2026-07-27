# Astralyn Product Strategy

Version 1.0 · July 2026

---

## The thesis

Astralyn already sells engineering time. Time does not compound: it stops
earning the moment the team stops working, and it caps the company at the
number of hours four founders can supervise.

Products compound. The strategy is to convert what the studio already knows —
how operators in this market actually run — into a small suite of software
that earns while nobody is working on it, and to do it without becoming five
separate companies.

That last constraint is the whole design problem. Five products built five
times is five auth systems, five billing systems, five M‑Pesa integrations and
five on-call rotations, which at our size is not a portfolio, it is a slow
collapse. **So the platform comes first and the products sit on it.** That
decision is the strategy; everything below is consequence.

---

## Who we build for

One customer archetype, stated narrowly on purpose:

> **An operator who runs physical things and currently runs them on a
> notebook, a spreadsheet and WhatsApp.**

Vehicles, buildings, money, crews. This operator has real revenue, real
compliance exposure and no software budget for enterprise pricing. They are
underserved because global SaaS ignores their payment rails, their regulator
and their price point, and local software ignores their design expectations.

We know this customer because we have already built for them — a truck
importer, a national sustainability platform, an IT consultancy, a maternal
health service. The matatu management system in our own repos is this
customer written down as a schema.

### What we are not doing

- Not building horizontal tools (CRM, project management, chat). Fully served.
- Not building consumer apps. Wrong economics for a four-founder team.
- Not building for enterprise procurement. Wrong sales motion, wrong cycle.

---

## The suite

Five products. Each one owns a different noun in the same operator's business.

| # | Product | Owns | Status |
|---|---------|------|--------|
| 01 | **Relay** | Vehicles | **Live** — derived from the existing fleet system |
| 02 | **Tenure** | Buildings | **In build** |
| 03 | **Ledger** | Money | Concept |
| 04 | **Concierge** | Customers | Concept |
| 05 | **Roster** | Crews | Concept |

Naming is hybrid — *"Relay, by Astralyn"*. The product name is ownable and can
be marketed alone; the house name carries the credibility on first contact and
makes the suite legible as one company's work.

### Why these five, in this order

**Relay is first because it already exists.** `mat-app-backend` has vehicles,
drivers, trips, daily collections, deficits, locations and reporting in
production shape. The work is not invention, it is multi-tenancy, hardening
and commercialisation — the shortest path from asset to revenue we have.

**Tenure is second because it is the same shape.** Rental management is fleet
management with a different physical asset: a recurring obligation against a
unit, money arriving on unpredictable rails, compliance dates, and a person
responsible. Roughly 60% of Relay's platform work is reusable, so the second
product is materially cheaper than the first.

**Ledger is third because both of the above need it.** Payment collection and
reconciliation is the hardest shared component and the one with the clearest
standalone market. We build it as Core infrastructure for Relay and Tenure,
then sell the same engine on its own.

**Concierge and Roster are adjacent expansions** into the same accounts —
sold to customers we already have, which is the cheapest revenue available.

### Sequencing principle

Never start product N+1 until product N has paying customers who renew. The
suite is a five-year map, not a five-quarter roadmap. Publishing it does not
commit us to building all of it — status labels on the site are honest for
exactly this reason.

---

## The platform: Astralyn Core

Six services, built once, consumed by every product.

| Service | Responsibility |
|---------|----------------|
| **Aegis** | Identity, SSO, tenancy, RBAC |
| **Rail** | Payments — M‑Pesa, cards, bank, payouts |
| **Signal** | Messaging — SMS, WhatsApp, email, push |
| **Meter** | Billing, plans, entitlements, usage |
| **Vault** | Documents, generation, signature, retention |
| **Trace** | Audit log and inter-service event bus |

Full design in [PLATFORM_CORE_ARCHITECTURE.md](./PLATFORM_CORE_ARCHITECTURE.md).

### What Core buys us

1. **A new product starts at its first real feature.** Not at a login screen.
   Roughly 4–6 weeks of undifferentiated work removed per product.
2. **One account across the suite.** A landlord who also runs three matatus
   signs in once. That is a genuine reason to buy the second product from us
   rather than from anyone else, and it is unavailable to competitors selling
   a single app.
3. **Cross-sell is a feature flag.** Not an integration project.
4. **Compliance is solved once.** Audit, retention and data handling live in
   Trace and Vault, not scattered across five codebases.
5. **One integration surface.** When Safaricom changes the Daraja API, we
   change Rail. Once.

### What Core costs us

Honest accounting: Core is roughly 3–4 months of work before a single
customer-visible feature ships, and it is a permanent maintenance obligation
carried by the same four people. If the suite stops at two products, Core is
over-engineering — two products could have shared a library.

We accept that cost because the alternative caps us at two products forever,
and because Aegis and Rail are independently valuable even if the suite
stalls.

---

## Positioning

> **We build the operating system for businesses that run physical things.**

Not "a software company" — the brand explicitly rejects that. The studio and
the suite reinforce each other:

- **The studio proves the standard.** Live client work is evidence.
- **The suite proves the thesis.** Owning products proves we can architect a
  business, not just deliver a brief.
- **Core proves the engineering.** A shared identity and payments platform is
  a claim that a portfolio site cannot make on its own.

---

## Business model

| Product | Model | Rationale |
|---------|-------|-----------|
| Relay | Per vehicle / month, tiered | Scales with the customer's asset base |
| Tenure | Per unit / month, tiered | Same |
| Ledger | Per transaction + platform fee | Aligns with value moved |
| Concierge | Per conversation bundle | Usage-driven cost, usage-driven price |
| Roster | Per active worker / month | Scales with the crew |

Pricing is per-asset, never per-seat. Per-seat pricing punishes the customer
for giving their supervisors access, which is exactly the behaviour the
product needs in order to become indispensable.

**Local pricing, local rails.** M‑Pesa first, card second. A product this
customer cannot pay for is not a product.

---

## What has to be true for this to work

Stated plainly, so they can be tested rather than assumed:

1. **Relay converts.** At least a handful of paying fleets within two quarters
   of commercial launch. If a product we have already built cannot be sold,
   the concepts will not sell either.
2. **Core actually gets reused.** If Tenure ends up forking Core rather than
   consuming it, the platform thesis has failed and we should stop at two
   products.
3. **Support does not eat the team.** Every product added multiplies support
   load against a fixed founder count. Self-service onboarding is not a
   nice-to-have, it is the constraint that decides whether product three
   exists.
4. **The studio keeps paying.** Product revenue is slower than everyone
   expects. Services income funds the runway, and protecting it is a strategic
   act, not a distraction from the real work.

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Building five products at four founders | **High** | Strict sequencing; no product N+1 before N renews |
| Core over-built before validation | **High** | Build Core services only as Relay/Tenure actually need them |
| M‑Pesa API dependency | Medium | Rail isolates it; contract-test against Daraja sandbox |
| Fleet market too price-sensitive | Medium | Validate willingness to pay before hardening Relay |
| Losing studio revenue to product work | Medium | Ring-fence delivery capacity; products get the surplus |
| Suite reads as vapourware | Low | Status labels on the site are honest and stay honest |

---

## Related documents

- [Platform architecture](./PLATFORM_CORE_ARCHITECTURE.md)
- [PRD — Aegis](./prd/PRD-AEGIS.md) · identity, the first thing to build
- [PRD — Relay](./prd/PRD-RELAY.md) · fleet, the first thing to sell
- [PRD — Tenure](./prd/PRD-TENURE.md)
- [PRD — Ledger](./prd/PRD-LEDGER.md)
- [PRD — Concierge](./prd/PRD-CONCIERGE.md)
- [PRD — Roster](./prd/PRD-ROSTER.md)

---

Powered by Astralyn.
