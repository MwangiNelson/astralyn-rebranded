# PRD — Concierge, by Astralyn

**Conversational Service Agent** · Status: **Concept**
Version 1.0 · July 2026

---

## 1. Summary

Concierge answers a business's customers on WhatsApp, using that business's own
data, and completes the transaction where it can.

It is not a chatbot in the 2018 sense. It is wired into Core, so when a tenant
asks "what's my balance", it reads Tenure; when they say "I'll pay now", it
raises an STK push through Rail. When it cannot help, it hands to a human with
the whole thread attached.

---

## 2. The problem

Customers ask the same eleven questions — balance, booking, hours, status,
receipt, directions — and a person answers each one by hand, badly, between
other work. Response times are measured in hours. After 6pm, nothing.

Two failed alternatives:

- **Build an app.** Nobody installs an app to ask a question they could have
  sent as a message.
- **Buy a chatbot.** Generic bots answer from a FAQ document, cannot see the
  customer's actual account, and are transparently useless within two
  messages. They damage the brand more than silence would.

The gap is an agent that knows the business's *live data* and can *act*.

---

## 3. Target user

**Primary — the Business Owner.** Drowning in repetitive customer messages,
losing enquiries after hours. Buys to reclaim time and stop losing leads.

**Secondary — the Customer.** Wants a fast, correct answer on WhatsApp without
installing, registering or waiting. Never pays.

**Secondary — the Support Agent.** Receives escalations. Needs full context,
not a cold handoff.

### Where it lands first
Existing Relay and Tenure customers — their tenants and drivers already
message them constantly, and we already hold the data that makes the answers
correct.

---

## 4. Jobs to be done

| As a… | I want to… | So that… |
|-------|-----------|----------|
| Owner | stop answering "what's my balance" by hand | I get my evenings back |
| Owner | capture enquiries after hours | I stop losing customers to silence |
| Customer | ask a question and get a real answer in seconds | I don't have to call |
| Customer | pay from the same conversation | I don't have to remember a paybill |
| Agent | receive an escalation with full history | I don't ask the customer to repeat themselves |
| Owner | see what customers actually ask about | I can fix the underlying problem |

---

## 5. Scope

### V1

**Channel**
- WhatsApp Business (Cloud API) via Signal
- Session handling, typing indicators, media receipt
- Reuse the WhatsApp identity flow already prototyped in `tenda-chapchap`,
  promoted into Aegis as a first-class grant

**Intelligence**
- Retrieval over the org's own data via product APIs, scoped by Aegis
- Business knowledge base (hours, policies, locations, FAQs)
- Intent recognition against a defined, closed action set
- **Refusal to guess.** Escalates rather than inventing an answer.

**Actions (V1, deliberately narrow)**
- Look up balance / statement (Tenure, Ledger)
- Look up vehicle or trip record (Relay)
- Raise a payment request via Rail
- Log a maintenance ticket (Tenure)
- Book or reschedule an appointment
- Escalate to a human

**Human handoff**
- Escalation rules: low confidence, explicit request, sentiment, payment
  dispute, anything financial above a threshold
- Full transcript to the agent
- Agent replies in the same WhatsApp thread

**Console**
- Live conversations, intervention, analytics on intents and deflection

### V1.1
- Swahili and Sheng
- Voice notes in, text out
- Proactive outbound (reminders, confirmations)
- SMS fallback

### Later
- Multi-channel (web widget, Instagram, Messenger)
- Outbound sales sequences
- Agent-to-agent handoff between Astralyn products

### Out of scope
- Open-domain conversation. Every action is on a defined list.
- Autonomous financial commitments above a configured limit.
- Replacing the support team. This deflects volume; it does not fire anyone.

---

## 6. Architecture

```
Customer (WhatsApp)
      │
   Signal  ── inbound webhook, normalised
      │
  Concierge orchestrator
      ├── conversation state (Redis, TTL)
      ├── identity resolution → Aegis (MSISDN → Account → Org)
      ├── intent classification
      ├── retrieval:
      │     • org knowledge base (vector)
      │     • live product APIs, scoped by the user's own token
      ├── action execution (allow-listed tools only)
      ├── confidence gate → answer or escalate
      └── Trace: every message, every action, every tool call
```

**The identity question, answered deliberately.** Concierge calls product APIs
**with the end user's own Aegis token**, not with a privileged service token.
It is slower and more work, but it means the agent physically cannot read data
the customer is not entitled to — and every access is attributable to a real
person in the audit log. A prompt-injection attack against a service token
with delegated scope is a data breach; against a user token it is a
nuisance.

**Grounding rule.** The agent may only state facts returned by a tool call or
present in the knowledge base. Anything else is an escalation. This is
enforced by the response validator, not by prompt instruction alone.

---

## 7. Core dependencies

| Service | Used for |
|---------|----------|
| **Aegis** | MSISDN→Account resolution; scoped tokens for tool calls |
| **Signal** | WhatsApp send/receive, templates, session windows |
| **Rail** | Payment requests raised in conversation |
| **Meter** | Per-conversation billing, usage limits |
| **Trace** | Full audit of messages, tool calls and actions |

Plus the product APIs it reads: Relay, Tenure, Ledger.

---

## 8. Pricing

| Tier | Conversations / month | Price |
|------|----------------------|-------|
| Starter | 500 | KES 6,000 |
| Growth | 3,000 | KES 25,000 |
| Scale | 10,000+ | Custom |

A "conversation" is a 24-hour WhatsApp session, matching Meta's own billing
unit so our cost and our price move together. WhatsApp platform fees passed
through at cost.

---

## 9. Success metrics

- **Deflection rate** — conversations resolved without a human. Target >65%.
- **Accuracy** — sampled human review of answers. Target >95% correct.
  **Below 90% the product should not ship**; a confidently wrong answer about
  someone's rent balance is worse than no product.
- **Time to first response.** Target under 5 seconds.
- **Escalation quality** — agent-rated context sufficiency.
- **Customer satisfaction** post-conversation.
- **Containment cost** — LLM spend per resolved conversation vs price.

---

## 10. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Confidently wrong answers about money | **Critical** | Grounding enforced by validator; refuse-and-escalate default; no financial statement without a tool call |
| Prompt injection via customer message | **Critical** | User-scoped tokens only; allow-listed tools; treat all message content as untrusted data |
| Data leakage across tenants | **Critical** | Aegis token scoping; no service tokens; isolation tests |
| WhatsApp policy change or ban | High | Signal abstracts the channel; SMS fallback in V1.1 |
| LLM cost exceeds price at volume | High | Cache aggressively; route simple intents to rules, not the model; measure per-conversation cost from day one |
| Customers hate talking to a bot | Medium | Disclose it is an assistant; make "talk to a human" always work in one message |
| Swahili/Sheng handling poor at launch | Medium | English-only V1, stated plainly; measure demand before investing |

---

## 11. Open questions

1. **What is the real per-conversation LLM cost** at our expected intent mix?
   Determines whether the pricing above is viable at all. Measure before
   building.
2. Is this a standalone product, or a feature of Relay and Tenure? Standalone
   is a bigger market; a feature is a much easier sale and a stronger
   retention hook.
3. How much of the existing `metro_assistant_lc` / `metro_rag` / `chatbot_backend`
   work is reusable? **Needs a code review before scoping.**
4. Do we self-host a model or use a frontier API? Cost, latency and data
   residency all pull in different directions, and question 4 in the platform
   doc (data residency) may decide this for us.

---

Powered by Astralyn.
