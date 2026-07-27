# PRD — Ledger, by Astralyn

**Collections & Reconciliation** · Status: **Concept**
Version 1.0 · July 2026

---

## 1. Summary

Ledger sits between the payment rails and the business. Every inbound payment
is matched to a customer, an invoice and an account on arrival; anything
unmatched surfaces as an exception rather than disappearing into a suspense
line.

It is the standalone product form of Core's Rail service. Relay and Tenure
need reconciliation internally; Ledger sells that same engine to businesses
that have no other software from us at all — which makes it the widest market
in the suite and the cheapest to reach, because the engine is already built.

---

## 2. The problem

Mobile money moves instantly and reconciles never.

A school, clinic or distributor takes payment across a paybill, a till, a bank
account and cash. The bank statement says money arrived. It does not say whose
it was, which invoice it settles, or whether the customer is now current.

So somebody spends the first week of every month with two screens and a
spreadsheet, matching transactions by hand. The books are permanently a
fortnight behind the bank, credit decisions are made on stale information, and
customers get chased for invoices they already paid.

Accounting software assumes reconciliation is a solved input. In this market
it is the hardest part of the job.

---

## 3. Target user

**Primary — the Finance Person.** One person in a 10–200 employee business who
owns receivables. Currently reconciling manually. Their time is the cost being
removed.

**Secondary — the Owner/Director.** Wants to know real cash position and real
debtor ageing without waiting for month-end.

### Segments
- Schools and colleges (fees, per-student, highly repetitive)
- Clinics and pharmacies
- Distributors and wholesalers with credit customers
- SACCOs and microfinance
- Any business already using Relay or Tenure — the warmest possible market

---

## 4. Jobs to be done

| As a… | I want to… | So that… |
|-------|-----------|----------|
| Finance | know who paid, automatically | I stop matching by hand |
| Finance | see only the payments that need a human | my day is exceptions, not everything |
| Finance | issue a receipt the moment money lands | customers stop calling to ask |
| Owner | see true debtor ageing today | I can act while the debt is collectable |
| Finance | export a clean journal to my accounting package | month-end is an export, not a rebuild |
| Finance | chase overdue accounts automatically | chasing is not a person's job |

---

## 5. Scope

### V1

**Collection**
- M‑Pesa paybill, till, STK push via Rail
- Bank feed import (statement upload; API where available)
- Card via Rail
- Manual cash entry with receipt

**The engine**
- Customer and invoice registry (or sync from an external source)
- **Automatic matching** by reference, payer identity, amount and history
- Exception queue as a primary, fast workflow
- Allocation rules: oldest-first, specific-invoice, on-account
- Part-payment and over-payment handling
- **Double-entry ledger** underneath everything

**Output**
- Automatic receipts via Signal
- Debtor ageing (30/60/90/120)
- Automated dunning sequences
- Journal export: CSV, QuickBooks, Xero, Sage
- Daily cash position

### V1.1
- Payouts and supplier payments via Rail B2C
- Multi-currency
- Recurring billing / subscriptions
- Customer statement portal

### Later
- Credit scoring from payment history — genuinely valuable and defensible,
  because we hold repayment behaviour nobody else has
- Invoice financing partnerships
- Full general ledger (probably never; we integrate instead)

### Out of scope
- Being an accounting package. We reconcile and export.
- Being a payment service provider. Rail is an aggregator, not a PSP.
- Lending. Adjacent, differently regulated, not this product.

---

## 6. Data model

```
Organisation (Core/Aegis)
  └── Customer
        id, org_id, name, phone, email, external_ref,
        known_msisdns[], credit_terms, credit_limit

  └── Invoice
        id, org_id, customer_id, number, issued_on, due_on,
        lines[], total, allocated, balance, status

  └── Receipt
        id, org_id, customer_id, payment_id, number, issued_at

  └── Payment
        id, org_id, rail_transaction_id, customer_id?,
        amount, received_at, method, raw_reference,
        match_status: auto|suggested|manual|unmatched,
        match_confidence, matched_by, matched_at

  └── Allocation
        id, org_id, payment_id, invoice_id, amount
        // many-to-many: one payment may settle several invoices

  └── JournalEntry            // double-entry, append-only
        id, org_id, at, description, source_kind, source_id,
        lines[]: { account, debit, credit }
        // sum(debit) == sum(credit), enforced

  └── DunningRule
        id, org_id, trigger_days, channel, template, escalation_to
```

> **The double-entry ledger is not optional.** A single-entry "payments" table
> cannot answer "does this balance?", and the first time a customer disputes a
> figure, an unbalanced ledger costs more than it ever saved.

---

## 7. Matching — the whole product

```
Payment arrives via Rail
  → normalise: amount, payer MSISDN, raw reference, timestamp
  → candidate generation:
      exact invoice number in reference        confidence 0.99
      customer account code in reference       confidence 0.95
      payer MSISDN in customer.known_msisdns   confidence 0.90
      amount == exactly one open invoice       confidence 0.75
      fuzzy reference (edit distance ≤2)       confidence 0.60
      partial amount of one open invoice       confidence 0.50
  → ≥0.90            auto-allocate, receipt, done
  → 0.50–0.90        suggest, one-tap approve in exception queue
  → <0.50            exception queue, unmatched
  → every manual match adds the MSISDN to the customer's known list,
    so the same payer never needs matching twice
```

That last line is the compounding mechanism: the system gets measurably better
at each customer's specific payers every week it runs.

---

## 8. Core dependencies

| Service | Used for |
|---------|----------|
| **Aegis** | Org, finance roles, approval permissions |
| **Rail** | Every rail; the normalised transaction feed |
| **Signal** | Receipts, dunning, daily cash summary |
| **Meter** | Transaction-volume billing |
| **Vault** | Invoice and statement PDFs |
| **Trace** | Audit — mandatory for anything touching money |

---

## 9. Pricing

Transaction-based, because value scales with money moved:

| Tier | Volume / month | Price |
|------|---------------|-------|
| Starter | ≤500 transactions | KES 3,500/mo |
| Growth | ≤5,000 | KES 12,000/mo |
| Scale | 5,000+ | KES 0.80 / transaction |

Rail's rail fees are passed through at cost, shown separately. Bundle discount
for customers already on Relay or Tenure.

---

## 10. Success metrics

- **Auto-match rate.** Target >92% by month 3. This *is* the product.
- **Hours saved per month**, self-reported at onboarding and at month 3. The
  renewal argument.
- **Days from payment to receipt issued.** Target: same day, automatically.
- **Debtor days** reduction against the customer's baseline.
- **Exception queue age.** A growing queue means matching is failing.

---

## 11. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Match rate too low to be worth paying for | **Critical** | Pilot against real historical statements before building the UI; measure achievable rate first |
| Bank feeds unavailable via API in this market | High | Statement upload as the primary path, API as an upgrade |
| Accounting integrations are a long tail of pain | High | CSV export first; QuickBooks/Xero only after demand is proven |
| Customers distrust automated allocation | Medium | Every allocation reversible, fully audited, visible reasoning shown |
| Regulatory exposure from touching money | **High** | Rail aggregates through licensed providers; we never hold funds. Legal review before launch |
| Cannibalises Rail's internal simplicity | Medium | Ledger is a consumer of Rail, never a fork of it |

---

## 12. Open questions

1. **What auto-match rate is actually achievable** on real Kenyan M‑Pesa
   reference data? Everything depends on this. Run the algorithm against three
   real customers' historical statements before writing any product code.
2. Do we hold customer/invoice data, or sync it from the customer's existing
   system? Holding it is a better product and a much harder sale.
3. Is "never hold funds" sustainable, or does settlement timing eventually
   force us into a regulated position?
4. Should Ledger simply be a module of Tenure and Relay rather than a separate
   product? Cheaper, smaller market. **Decide before building anything.**

---

Powered by Astralyn.
