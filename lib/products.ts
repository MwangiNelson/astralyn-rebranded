/**
 * The Astralyn product suite.
 *
 * Five products on one platform. The suite is deliberately narrow: every
 * product serves an operator who runs physical things — vehicles, buildings,
 * money, crews — and every one of them needs the same six services
 * underneath. That shared spine is the actual company asset; the products are
 * what it is pointed at.
 *
 * `status` is load-bearing. A concept is labelled a concept.
 */

export type ProductStatus = "Live" | "In Build" | "Concept";

export type Product = {
  index: string;
  /** The product's own name. */
  name: string;
  /** What it is, in five words or fewer. */
  category: string;
  status: ProductStatus;
  /** Two lines of display type. */
  headline: [string, string];
  problem: string;
  solution: string;
  /** Who signs the cheque. */
  audience: string;
  /** Capabilities, not features — four is the limit. */
  pillars: string[];
  stack: string;
  /** Which Core services it consumes. Proves the platform is real. */
  core: string[];
  /** Landing-page one-liner. */
  line: string;
};

export const PRODUCTS: Product[] = [
  {
    index: "01",
    name: "Relay",
    category: "Fleet & Transport Operations",
    status: "Live",
    headline: ["Every shilling a vehicle earns.", "Every document that keeps it moving."],
    problem:
      "A fleet owner learns what a vehicle made when the day is already over, from a notebook, a phone call, or nothing at all. Insurance lapses, inspections expire, and the first anyone knows is a roadblock and an impounded vehicle.",
    solution:
      "Relay records the day as it happens — driver, vehicle, route, collection, expense — and closes each vehicle's books nightly. Every compliance date the vehicle carries is tracked to the day it expires, and warns long before it does. The owner opens one screen and knows.",
    audience: "SACCOs, owner-operators and logistics fleets",
    pillars: [
      "Daily collections & deficits",
      "Driver & vehicle registry",
      "Compliance expiry calendar",
      "Owner reporting",
    ],
    stack: "FastAPI · Postgres · Redis · React · Alembic",
    core: ["Aegis", "Rail", "Signal", "Trace"],
    line: "The day's takings, the vehicle's papers, and the driver behind both — closed nightly.",
  },
  {
    index: "02",
    name: "Tenure",
    category: "Rental & Property Operations",
    status: "In Build",
    headline: ["Rent is a schedule.", "Chasing it should not be a job."],
    problem:
      "A landlord with thirty units runs them on a spreadsheet, a phone and memory. Rent arrives across four channels and reconciles against none of them. Arrears are discovered late, deposits are disputed from recollection, and maintenance lives in a WhatsApp thread nobody owns.",
    solution:
      "Tenure holds the lease as the source of truth. Invoices raise themselves on schedule, payments match themselves against the tenant who sent them, arrears escalate on their own, and every deposit, notice and repair is filed against the unit it belongs to. The statement is always current.",
    audience: "Landlords, managing agents and property firms",
    pillars: [
      "Leases, units & tenants",
      "Automated invoicing & arrears",
      "Payment reconciliation",
      "Maintenance & deposits",
    ],
    stack: "Next.js · Postgres · Row-level tenancy · Event sourcing",
    core: ["Aegis", "Rail", "Signal", "Vault", "Meter"],
    line: "Leases, invoices, arrears and repairs — one ledger per building, always current.",
  },
  {
    index: "03",
    name: "Ledger",
    category: "Collections & Reconciliation",
    status: "Concept",
    headline: ["Money arrives.", "Knowing whose it is should be free."],
    problem:
      "Mobile money moves instantly and reconciles never. A business takes payment across a paybill, a till, a bank and cash, then spends the first week of every month working out who paid what. The books are always a fortnight behind the bank.",
    solution:
      "Ledger sits between the rails and the business. Every inbound payment is matched to a customer, an invoice and an account on arrival; anything unmatched surfaces as an exception rather than disappearing into a suspense line. Payouts, float and settlement run from the same ledger.",
    audience: "SMEs, schools, clinics and collection-heavy businesses",
    pillars: [
      "Multi-rail collection",
      "Automatic matching",
      "Exception queues",
      "Settlement & payouts",
    ],
    stack: "Go · Postgres · Double-entry ledger · Idempotent webhooks",
    core: ["Aegis", "Rail", "Signal", "Trace"],
    line: "Every payment matched to a customer and an invoice the moment it lands.",
  },
  {
    index: "04",
    name: "Concierge",
    category: "Conversational Service Agent",
    status: "Concept",
    headline: ["Your customers already", "opened WhatsApp."],
    problem:
      "Customers ask the same eleven questions — balance, booking, hours, status, receipt — and a person answers each one by hand, badly, between other work. Nobody installs an app to ask a question they could have sent as a message.",
    solution:
      "Concierge answers on the channel the customer already uses. It is wired into the business's own data through Core, so it answers with facts rather than pleasantries, completes the transaction where it can, and hands to a human the moment it should — with the whole thread attached.",
    audience: "Any business whose customers message rather than call",
    pillars: [
      "WhatsApp-first",
      "Grounded in business data",
      "Transactional, not chatty",
      "Clean human handoff",
    ],
    stack: "Python · LLM orchestration · Retrieval over tenant data · WhatsApp Cloud API",
    core: ["Aegis", "Signal", "Rail", "Trace"],
    line: "An agent that answers with your data, on the channel your customers already use.",
  },
  {
    index: "05",
    name: "Roster",
    category: "Field Workforce Operations",
    status: "Concept",
    headline: ["The crew is the", "operation."],
    problem:
      "Shifts are planned on paper, attendance is taken on trust, and the argument at the end of the month is about hours nobody recorded. Supervisors spend their day on the phone finding out where people are.",
    solution:
      "Roster plans the shift, verifies the clock-in against the place it was meant to happen, dispatches the day's tasks to the phone in the worker's hand, and produces the timesheet that payroll actually needs — without anyone retyping it.",
    audience: "Operators running crews across sites",
    pillars: [
      "Shift planning",
      "Geofenced attendance",
      "Task dispatch",
      "Payroll-ready timesheets",
    ],
    stack: "Next.js · Postgres · PostGIS · Offline-first mobile",
    core: ["Aegis", "Signal", "Meter", "Trace"],
    line: "Plan the shift, verify the clock-in, and hand payroll a timesheet it can trust.",
  },
];

/** The shared spine. Built once, consumed by every product above. */
export const CORE_SERVICES: {
  name: string;
  role: string;
  detail: string;
}[] = [
  {
    name: "Aegis",
    role: "Identity & Access",
    detail:
      "One OIDC provider for every product. A customer signs in once and carries that session across the suite; we never write authentication again.",
  },
  {
    name: "Rail",
    role: "Payments",
    detail:
      "M-Pesa, cards and bank rails behind one interface, with idempotent webhooks and a normalised transaction shape every product already understands.",
  },
  {
    name: "Signal",
    role: "Messaging",
    detail:
      "SMS, WhatsApp, email and push through one send. Templates, throttling, delivery receipts and quiet hours belong here, not in five codebases.",
  },
  {
    name: "Meter",
    role: "Billing & Entitlements",
    detail:
      "Plans, seats, usage and limits. A product asks whether a tenant may do a thing; it does not implement subscriptions.",
  },
  {
    name: "Vault",
    role: "Documents",
    detail:
      "Storage, generation and signature for leases, logbooks, statements and notices — with the retention rules attached to the document, not the app.",
  },
  {
    name: "Trace",
    role: "Audit & Events",
    detail:
      "An append-only record of who did what, and the event bus the products talk to each other over. Compliance and integration from the same log.",
  },
];
