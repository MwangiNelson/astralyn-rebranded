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
  /** Plain description for lists: what it is and who it is for. The headline
   *  does the persuading; a list of five taglines reads as five slogans. */
  line: string;
  /** The product's own site, once it has one. Present means this page stops
   *  doing the selling and hands off to it. */
  site?: string;
  /** A screenshot of that site. Present means the plate shows it instead of a Field. */
  image?: string;
};

export const PRODUCTS: Product[] = [
  {
    index: "01",
    name: "Nyumbisha",
    category: "WhatsApp & M-Pesa Rent Collection",
    status: "In Build",
    headline: ["Rent and receipts,", "handled on WhatsApp."],
    problem:
      "Tenants already message their landlord on WhatsApp and already pay by M-Pesa. Neither one keeps the books. Rent arrives in bits, from phone numbers that do not say which unit they pay for. Reminders go out by hand, and finding out who still owes means checking M-Pesa messages against a notebook.",
    solution:
      "Nyumbisha runs rent in the chat tenants already use. Bills and reminders go out on WhatsApp, with SMS as backup. The tenant pays from an M-Pesa prompt on their own phone, and the money lands in the landlord's M-Pesa or bank without passing through us. Every payment is matched to its tenant and unit, part payments included, and the receipt goes back on WhatsApp. Tenants install nothing.",
    audience: "Landlords, managing agents and property firms",
    pillars: [
      "WhatsApp bills & receipts",
      "M-Pesa straight to the landlord",
      "Automatic payment matching",
      "Tenant move-in on WhatsApp",
    ],
    line: "Rent collection for landlords and managing agents, over WhatsApp and M-Pesa.",
    site: "https://nyumbisha.astralyngroup.com",
    image: "/products/nyumbisha.webp",
  },
  {
    index: "02",
    name: "Relay",
    category: "Fleet & Transport Operations",
    status: "Live",
    headline: ["Every shilling a vehicle earns.", "Every document that keeps it moving."],
    problem:
      "A fleet owner learns what a vehicle made when the day is already over, from a notebook, a phone call, or nothing at all. Insurance lapses, inspections expire, and the first anyone knows is a roadblock and an impounded vehicle.",
    solution:
      "Relay records the day as it happens (driver, vehicle, route, collection, expense) and closes each vehicle's books nightly. Every compliance date the vehicle carries is tracked to the day it expires, and warns long before it does. The owner opens one screen and knows.",
    audience: "SACCOs, owner-operators and logistics fleets",
    pillars: [
      "Daily collections & deficits",
      "Driver & vehicle registry",
      "Compliance expiry calendar",
      "Owner reporting",
    ],
    line: "Fleet management for SACCOs and logistics operators: daily collections, expenses and vehicle documents.",
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
    line: "Payment reconciliation for schools, clinics and other businesses that collect from many customers.",
  },
  {
    index: "04",
    name: "Concierge",
    category: "Conversational Service Agent",
    status: "Concept",
    headline: ["Your customers already", "opened WhatsApp."],
    problem:
      "Customers ask the same eleven questions (balance, booking, hours, status, receipt), and a person answers each one by hand, badly, between other work. Nobody installs an app to ask a question they could have sent as a message.",
    solution:
      "Concierge answers on the channel the customer already uses. It is wired into the business's own data through Core, so it answers with facts rather than pleasantries, completes the transaction where it can, and hands to a human the moment it should, with the whole thread attached.",
    audience: "Any business whose customers message rather than call",
    pillars: [
      "WhatsApp-first",
      "Grounded in business data",
      "Transactional, not chatty",
      "Clean human handoff",
    ],
    line: "A WhatsApp customer service agent that answers from the business's own records.",
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
      "Roster plans the shift, verifies the clock-in against the place it was meant to happen, dispatches the day's tasks to the phone in the worker's hand, and produces the timesheet that payroll actually needs, without anyone retyping it.",
    audience: "Operators running crews across sites",
    pillars: [
      "Shift planning",
      "Geofenced attendance",
      "Task dispatch",
      "Payroll-ready timesheets",
    ],
    line: "Shift planning, attendance and timesheets for teams working across several sites.",
  },
];

/** The shared spine. Built once, consumed by every product above. */
export const CORE_SERVICES: {
  name: string;
  role: string;
  detail: string;
  /** What the service does, in the words of the business that relies on it.
   *  `detail` is for technical readers on /products; this is for everyone else. */
  plain: string;
}[] = [
  {
    name: "Aegis",
    role: "Identity & Access",
    detail:
      "One OIDC provider for every product. A customer signs in once and carries that session across the suite; we never write authentication again.",
    plain: "Who can sign in, and what each person is allowed to see and do.",
  },
  {
    name: "Rail",
    role: "Payments",
    detail:
      "M-Pesa, cards and bank rails behind one interface, with idempotent webhooks and a normalised transaction shape every product already understands.",
    plain: "Taking M-Pesa, card and bank payments, and matching each one to the right customer and invoice.",
  },
  {
    name: "Signal",
    role: "Messaging",
    detail:
      "SMS, WhatsApp, email and push through one send. Templates, throttling, delivery receipts and quiet hours belong here, not in five codebases.",
    plain: "Reaching customers on WhatsApp, SMS and email, with every delivery tracked.",
  },
  {
    name: "Meter",
    role: "Billing & Entitlements",
    detail:
      "Plans, seats, usage and limits. A product asks whether a tenant may do a thing; it does not implement subscriptions.",
    plain: "Plans, subscriptions and usage limits for each customer account.",
  },
  {
    name: "Vault",
    role: "Documents",
    detail:
      "Storage, generation and signature for leases, logbooks, statements and notices. The retention rules travel with the document, not the app.",
    plain: "Generating and storing statements, receipts, notices and contracts.",
  },
  {
    name: "Trace",
    role: "Audit & Events",
    detail:
      "An append-only record of who did what, and the event bus the products talk to each other over. Compliance and integration from the same log.",
    plain: "A permanent record of who did what and when, for audits, disputes and compliance.",
  },
];
