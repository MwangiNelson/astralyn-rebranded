# PRD — Tenure, by Astralyn

**Rental & Property Operations** · Status: **In Build**
Version 1.0 · July 2026

---

## 1. Summary

Tenure holds the lease as the source of truth for a rental business. Invoices
raise themselves on schedule, payments match themselves to the tenant who sent
them, arrears escalate without anyone remembering to chase, and every deposit,
notice and repair is filed against the unit it belongs to.

It is the second product because it is structurally the same as Relay — a
recurring obligation against a physical asset, money arriving on unreliable
rails, compliance dates, and a person responsible — which means roughly 60% of
the platform work is already paid for.

---

## 2. The problem

A landlord with 10–200 units runs them on a spreadsheet, a phone and memory.

1. **Rent arrives across four channels and reconciles against none of them.**
   M‑Pesa to a personal number, M‑Pesa to a paybill, bank transfer, cash to a
   caretaker. Working out who has actually paid consumes the first week of
   every month.
2. **Arrears are discovered late.** By the time a tenant is three months
   behind, the money is usually gone. There is no system that notices at
   week two.
3. **Deposits are disputed from recollection.** No condition record, no
   itemised deductions, and an argument at the end of every tenancy.
4. **Maintenance lives in a WhatsApp thread nobody owns.** Requests are lost,
   repeated, or fixed twice.
5. **The statement an owner wants is a week of manual work**, so agents produce
   it late and owners distrust it.

---

## 3. Target user

**Primary — the Landlord.** 10–200 units, one to five properties. Owns the
asset, wants the money and no drama.

**Primary — the Managing Agent.** Manages units for several owners, is judged
on collection rate, and must produce per-owner statements. Higher willingness
to pay than a landlord, because the software directly reduces their labour.

**Secondary — the Caretaker.** On site. Logs maintenance, confirms occupancy,
sometimes receives cash. Low literacy with software assumed; WhatsApp-first.

**Secondary — the Tenant.** Receives invoices and receipts, reports faults,
checks their own balance. Never charged; their adoption improves collection.

---

## 4. Jobs to be done

| As a… | I want to… | So that… |
|-------|-----------|----------|
| Landlord | see who has paid this month without adding anything up | I know my position in ten seconds |
| Landlord | be told at day 7, not day 90, that a tenant is behind | arrears are recoverable |
| Agent | produce each owner's statement automatically | I stop losing a week a month |
| Agent | match an M‑Pesa payment to a tenant automatically | reconciliation is not a job |
| Landlord | have an itemised, evidenced deposit record | move-out is not an argument |
| Caretaker | log a fault from WhatsApp with a photo | it gets fixed once and recorded |
| Tenant | see my balance and get a receipt | I trust the landlord's numbers |

---

## 5. Scope

### V1

**Property & tenancy**
- Properties, units, unit types, rent amounts
- Tenants with Aegis accounts (phone-primary)
- Leases: term, rent, deposit, escalation, billing day, status
- Occupancy: vacant, occupied, notice given, under renovation

**Money**
- Automatic invoice generation on each lease's billing day
- Multi-rail collection through Rail: M‑Pesa STK, paybill, bank, cash entry
- **Automatic payment matching** — the core value of the product
- Exception queue for unmatched payments
- Arrears ageing (30/60/90) with automated escalation via Signal
- Receipts issued automatically on payment

**Operations**
- Maintenance tickets: raise, assign, cost, close, with photos
- Deposit register with itemised deductions at move-out
- Notices: rent review, breach, vacate — generated from templates via Vault

**Reporting**
- Per-owner monthly statement (PDF + CSV)
- Collection rate, arrears ageing, occupancy, income vs expense

### V1.1
- Utility metering (water, electricity) with per-unit billing
- Tenant self-service portal
- Lease renewal workflow with escalation applied automatically
- Prospective tenant applications and screening

### Later
- Service charge apportionment for multi-owner blocks
- Commercial leases (different billing rules, VAT)
- Integration with Ledger for owner payouts
- Concierge for tenant queries over WhatsApp

### Out of scope
- Property sales and brokerage
- Accounting general ledger — we export to it
- Facilities management for large commercial estates

---

## 6. Data model

```
Organisation (Core/Aegis)
  └── Property
        id, org_id, name, address, geo, owner_account_id, type

  └── Unit
        id, org_id, property_id, label, unit_type, bedrooms,
        market_rent (minor units), status

  └── Tenant
        id, org_id, account_id, name, phone, id_number,
        emergency_contact, kyc_documents[] (Vault refs)

  └── Lease
        id, org_id, unit_id, tenant_id,
        start_on, end_on, rent (minor units), billing_day,
        deposit (minor units), escalation_pct, escalation_on,
        status: draft|active|notice|ended
        document_id (Vault)

  └── Invoice
        id, org_id, lease_id, period_start, period_end,
        due_on, lines[], total, paid, balance,
        status: draft|issued|part_paid|paid|overdue|written_off

  └── Payment
        id, org_id, rail_transaction_id, lease_id?, invoice_id?,
        amount, received_at, method,
        match_status: auto|manual|unmatched,
        match_confidence

  └── DepositLedger
        id, org_id, lease_id, held, deductions[], refunded, closed_at

  └── MaintenanceTicket
        id, org_id, unit_id, raised_by, category, description,
        photos[] (Vault), assigned_to, cost, status, closed_at

  └── Notice
        id, org_id, lease_id, kind, served_on, document_id (Vault)
```

---

## 7. The flow that matters: payment matching

This is the product. Everything else is data entry around it.

```
Rail receives an M-Pesa C2B payment
  → Tenure receives a normalised Transaction webhook
  → match, in order of confidence:
      1. account reference == unit code        → auto, high
      2. payer MSISDN == tenant phone          → auto, high
      3. amount == exactly one lease's balance
         AND payer unknown                     → auto, medium
      4. fuzzy: partial reference, near amount → suggest, needs approval
      5. no match                              → exception queue
  → on match: allocate to oldest unpaid invoice first
  → issue receipt via Signal
  → emit tenure.payment.matched to Trace
```

**Target: >90% auto-matched by month three.** Below that the agent is still
doing the job manually and the product has not earned its price. The exception
queue is a first-class screen, not an error log — it is where the remaining
10% gets resolved in seconds rather than hours.

---

## 8. Core dependencies

| Service | Used for |
|---------|----------|
| **Aegis** | Landlords, agents, caretakers, tenants; roles per org |
| **Rail** | All collection rails; the normalised transaction feed |
| **Signal** | Invoices, receipts, arrears escalation, ticket updates |
| **Meter** | Per-unit billing, feature gating |
| **Vault** | Leases, notices, statements, KYC, ticket photos, e-signature |
| **Trace** | Audit on every money movement and lease change |

Tenure is the heaviest Core consumer — it touches all six. That is by design:
it is the product that proves the platform thesis.

---

## 9. Pricing

| Tier | Units | Price / unit / month |
|------|-------|---------------------|
| Landlord | 1–20 | KES 120 |
| Portfolio | 21–100 | KES 90 |
| Agency | 101+ | KES 65 + per-owner statement bundle |

Billed on **occupied** units. A vacant unit costs the landlord money already;
charging for it is the fastest way to be resented.

Transaction fees on collection are Rail's, passed through transparently.

---

## 10. Success metrics

- **Auto-match rate.** Target >90% by month 3. The single most important
  number in the product.
- **Collection rate improvement** vs the customer's stated baseline at
  onboarding. This is what renews the contract.
- **Days to first invoice issued** after signup. Target under 3.
- **Arrears caught before day 30** as a share of all arrears.
- **Exception queue clearance time.** If it grows, matching is failing.

---

## 11. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Payment matching accuracy below expectations | **Critical** | Exception queue designed as a fast primary workflow, not an error state; manual matches train the rules |
| Landlords collect to personal M‑Pesa, outside any rail | **High** | Statement-import fallback; make paybill onboarding part of setup |
| Data entry burden of migrating existing tenancies | High | Bulk CSV import + assisted onboarding for the first cohort |
| Tenant adoption low, so receipts unseen | Medium | WhatsApp-first via Signal; no app install required |
| Legal variation in notices across jurisdictions | Medium | Templates per jurisdiction in Vault; legal review before launch |
| Cash payments invisible to the system | Medium | Caretaker cash-entry flow with receipt issuance |

---

## 12. Open questions

1. **Do landlords or agents buy first?** Agents have more pain and more
   budget; landlords are more numerous. The answer changes onboarding, pricing
   and the entire sales motion.
2. Is utility metering a V1 blocker in practice? For many Kenyan landlords
   water billing is inseparable from rent.
3. How much of the existing `tendaworld` work is reusable here, if any?
   **Needs a code review before we scope the build.**
4. Do we need e-signature at launch, or are wet-signed leases uploaded to
   Vault sufficient for V1?

---

Powered by Astralyn.
