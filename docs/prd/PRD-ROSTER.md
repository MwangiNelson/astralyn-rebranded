# PRD — Roster, by Astralyn

**Field Workforce Operations** · Status: **Concept**
Version 1.0 · July 2026

---

## 1. Summary

Roster plans the shift, verifies the clock-in against the place it was meant
to happen, dispatches the day's tasks to the phone in the worker's hand, and
produces a timesheet payroll can trust — without anyone retyping anything.

It is the fifth product because it sells into accounts we already have. Every
Relay fleet has drivers and conductors. Every Tenure agency has caretakers,
cleaners and security. Roster is the cheapest revenue in the suite, because
the customer is already signed in.

---

## 2. The problem

Shifts are planned on paper, attendance is taken on trust, and the argument at
the end of the month is about hours nobody recorded.

1. **Attendance is unverifiable.** A supervisor marks a register, or a worker
   sends a WhatsApp message. Buddy-punching and ghost workers are routine and
   invisible.
2. **Supervisors spend the day on the phone** finding out where people are.
3. **Task assignment evaporates.** Told verbally in the morning, disputed in
   the afternoon, with no record of what was actually asked for.
4. **Payroll is manual re-entry** from a paper register into a spreadsheet —
   slow, error-prone, and the source of most staff disputes.
5. **No evidence when a client disputes coverage.** A security or cleaning
   contractor cannot prove the shift happened.

---

## 3. Target user

**Primary — the Operations Manager.** Runs 20–500 workers across sites. Judged
on coverage and cost. Buys the product.

**Primary — the Supervisor.** Assigns and verifies on the ground. Their
adoption decides whether the data is real.

**Secondary — the Worker.** Clocks in, receives tasks, sees their hours.
Low-end Android, patchy data, limited storage. **Offline-first is not
optional.**

**Secondary — Payroll.** Consumes the timesheet. Wants an export that needs no
correction.

### Segments
- Security firms (highest pain, contractual proof-of-coverage requirement)
- Cleaning and facilities contractors
- Construction crews
- Field sales and distribution
- Existing Relay and Tenure customers

---

## 4. Jobs to be done

| As a… | I want to… | So that… |
|-------|-----------|----------|
| Ops Manager | see who is actually on site right now | I can fix coverage gaps today |
| Ops Manager | hand payroll a timesheet with no re-entry | month-end stops being a week |
| Supervisor | assign today's tasks in two minutes | I stop repeating myself on the phone |
| Supervisor | know a clock-in was really at the site | I can trust the register |
| Worker | clock in with no signal | I still get paid for the shift |
| Worker | see my own hours | I don't have to argue about them |
| Ops Manager | prove coverage to a client | I keep the contract |

---

## 5. Scope

### V1

**Planning**
- Sites with geofences
- Shift patterns and rotations
- Publish a schedule; notify workers via Signal
- Coverage gaps highlighted before the day starts
- Swap and leave requests with approval

**Attendance**
- **Geofenced clock-in/out** — GPS verified against the site boundary
- **Offline-first**: queue locally, sync on reconnect, server-side idempotency
- Photo capture on clock-in (anti-buddy-punch), stored in Vault
- Exception flags: late, early, out-of-bounds, missing clock-out
- Supervisor override, always audited

**Dispatch**
- Task list per shift, per worker
- Completion with photo/note evidence
- Real-time status to the supervisor

**Output**
- Timesheets: regular, overtime, night, public holiday
- Payroll export (CSV, common Kenyan payroll formats)
- Coverage report per site per period — the contractor's proof
- Exception report

### V1.1
- Skills and certifications with expiry (guard licences, first aid) — reuses
  Relay's expiry engine
- Cost-to-serve per site
- Client-facing coverage portal
- NFC/QR checkpoint patrol scanning

### Later
- Full payroll calculation (probably never — we export)
- Shift marketplace for open shifts
- Biometric verification

### Out of scope
- Payroll processing and statutory filing
- HR: recruitment, contracts, performance reviews
- Field service scheduling with route optimisation (different product)

---

## 6. Data model

```
Organisation (Core/Aegis)
  └── Site
        id, org_id, name, address, geofence (PostGIS polygon),
        radius_m, client_id?

  └── Worker
        id, org_id, account_id, name, phone, employee_no,
        pay_rate, pay_type, skills[], certifications[],
        status: active|suspended|ended

  └── ShiftPattern
        id, org_id, name, start_time, end_time, days[], break_minutes

  └── Shift
        id, org_id, site_id, worker_id, pattern_id?,
        starts_at, ends_at, status: planned|published|active|closed,
        published_at

  └── Attendance
        id, org_id, shift_id, worker_id,
        clock_in_at, clock_in_geo, clock_in_photo (Vault),
        clock_out_at, clock_out_geo,
        within_geofence: bool, exceptions[],
        client_ref                      ← idempotency for offline sync
        override_by?, override_reason?

  └── Task
        id, org_id, shift_id, title, description, due_at,
        status, completed_at, evidence[] (Vault)

  └── Timesheet
        id, org_id, worker_id, period_start, period_end,
        regular_minutes, overtime_minutes, night_minutes,
        holiday_minutes, exceptions[], approved_by, approved_at
```

> **PostGIS, not a naive radius check.** Sites are rarely circles — a
> warehouse compound or an estate boundary is a polygon, and a circular
> approximation produces false exceptions that destroy trust in the register
> within a week.

---

## 7. The flow that decides the product: offline clock-in

```
Worker taps Clock In
  → capture GPS + timestamp + photo, on device
  → evaluate geofence LOCALLY (polygon cached with the shift)
  → write to local queue with a client-generated UUID
  → show confirmation immediately  ← the worker is never blocked
  → on reconnect: sync queue
      → server de-duplicates on client_ref
      → server RE-EVALUATES the geofence (device is not trusted)
      → mismatch between device and server verdict → exception, not rejection
```

Two rules that matter:

- **The worker is never blocked by connectivity.** A clock-in that fails
  because of signal is a wage dispute, and wage disputes end deployments.
- **The device is never trusted.** GPS is spoofable. The server re-evaluates
  and flags disagreement for a human, rather than silently accepting or
  silently rejecting.

---

## 8. Core dependencies

| Service | Used for |
|---------|----------|
| **Aegis** | Managers, supervisors, workers; roles per org |
| **Signal** | Schedule publication, shift reminders, coverage alerts |
| **Meter** | Per-active-worker billing |
| **Vault** | Clock-in photos, task evidence, certifications |
| **Trace** | Audit of every override and timesheet approval |
| **Rail** | (Later) direct wage disbursement |

---

## 9. Pricing

| Tier | Workers | Price / active worker / month |
|------|---------|------------------------------|
| Crew | 1–25 | KES 150 |
| Operations | 26–150 | KES 110 |
| Enterprise | 151+ | KES 80 |

Billed on workers who clocked in at least once in the period. Seasonal crews
are the norm in these industries; charging for an inactive worker guarantees a
monthly billing argument.

---

## 10. Success metrics

- **Clock-in compliance** — % of planned shifts with a verified clock-in.
  Target >90% by month 2.
- **Offline sync success** — target >99.5%. Every failure is a wage dispute.
- **Payroll export accepted without correction.** Target >95%.
- **Exception rate trend.** Should fall over time; if it rises, geofences are
  wrong or the product is being gamed.
- **Supervisor time saved**, self-reported at onboarding and month 3.

---

## 11. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Worker phones too old / no data | **Critical** | Offline-first; minimal APK; supervisor bulk clock-in as fallback |
| GPS spoofing | High | Server-side re-evaluation; photo verification; anomaly detection on impossible movement |
| Workers resist surveillance | **High** | Frame around correct pay, not monitoring; workers see their own hours; union/labour-law review before launch |
| Battery drain from location | Medium | Location only at clock events, never continuous tracking |
| Geofence accuracy in dense urban areas | Medium | Generous polygons; exceptions flagged for humans, never auto-rejected |
| Payroll format fragmentation | Medium | Generic CSV first; specific formats on demand |

---

## 12. Open questions

1. **Is security the beachhead?** Highest pain, contractual proof requirement,
   and the largest crews. But also the most price-sensitive and the most
   labour-relations-sensitive segment.
2. Do we need an Android app in V1, or is a well-built PWA sufficient? PWA is
   far cheaper; offline reliability and photo capture on low-end Android is
   the deciding constraint. **Needs a device test on real target hardware.**
3. Is proof-of-coverage for the *client* actually a bigger selling point than
   payroll accuracy? If so, the client portal moves into V1.
4. What are the labour-law constraints on location capture and photo
   verification in Kenya? **Legal answer required before build, not after.**

---

Powered by Astralyn.
