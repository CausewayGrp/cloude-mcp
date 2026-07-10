# The automation layer — every Power Automate flow the estate runs

Flows cannot be created portably through Microsoft Graph, so this is the
build sheet. **Flow name = the eProcess code** (the firm's law: the automation
layer *is* the process spine). Every flow below is named in the firm's own
workbooks; nothing is invented.

## 1 · Domain flows (CW-SPB workbooks, tab 05 — three per domain)

### Technology
| Flow | What it does | eProcess |
|---|---|---|
| Publish approval | Site change → CD approves → Editor publishes → log | EPR-14 |
| Credential rotation reminder | Rotation-due date → notify Tech Director | TEC-101 |
| Incident alert | New sealed-severity incident → Teams to COO | Incident Log |

### Finance & Operations
| Flow | What it does | eProcess |
|---|---|---|
| Approval escalation | SLA breach → reminder → +12h → next role → red card | SOP-FIN-02 |
| Spend thresholds | $500→CFO, $2k→COO, >$2k→MD | EPR-05 |
| Settlement chase | −3 days from promise → chase list | EPR-02 |

### Line I — State & Development
| Flow | What it does | eProcess |
|---|---|---|
| Engagement start | Signed → workspace instantiated → seed pack | EPR-17 |
| Register freshness | Claim >30 days unverified → flag | SOP-H-01 |
| Sector feed | Source update → item to Line I feed (Editor publishes) | SOP-INT-01 |

### Line II — Banking & Regulation
| Flow | What it does | eProcess |
|---|---|---|
| Daily screening | 05:00 → pull deltas → v-stamp or red flag | EPR-20 |
| Clinic NDA gate | No file opens until NDA T12 logged | SOP-LII-05 |
| Tier progression | Milestone evidenced → tier bar advances | SOP-LII-01 |

### Partnerships & Expert Network
| Flow | What it does | eProcess |
|---|---|---|
| Expert intake | Cascade → auto-screen → route by score | SOP-EN-01 |
| Coverage alert | Specialisation gap → Marketing trigger | Bench board R6 |
| QA gate | Deliverable → four gates scored → COO sign-off | SOP-EN-02 |

### Content & Social Media
| Flow | What it does | eProcess |
|---|---|---|
| Post scheduling | Draft → CD approves → scheduled → posted | EPR-16 |
| AR-post rule | AR posts flagged native-separate (never same-post bilingual) | POL-LANG-01 |
| Franchise cadence | Series next-date → remind owner | SOP-BRD-01 |

### People & Culture (SHELL — completed at the Z08 finale)
| Flow | What it does | eProcess |
|---|---|---|
| Application intake | FRM-WEB-3 → screen → 2/5-day promise clock | EPR-11 pre |
| Review cycle | Calendar → self → manager → calibration → MD sign | EPR-11 |
| JD combination | [Z08 FINALE: every Needs-Ledger deposit → rating system] | finale |

## 2 · The reusable request flow (CW-SP-REF-001 — build once, clone per workflow)

One flow pattern serves the whole e-process board. Its reference instantiation
is onboarding (WF-HR-01) against `Requests_People` + `AuditLog` + `Comments`:

**On submit:** write one row with a generated `RequestRef` (e.g. HR-2026-014) →
set `SLA_Due` from the start date, stage → *With supervisor* → route to the
supervisor **by position, not name** → append to the immutable `AuditLog` →
notify the approver in Teams and by email.

**Stages & SLAs:** With supervisor (1d) → HR (1d) → Technology (2d) → Manager
confirm → Closed.

**At every step:** the list row updates, one audit row is appended, and the
next holder is notified. Nothing advances silently.
**On a return:** a written reason is required, the clock resets, and the
request routes back to the requester — never lost, never blamed.
**On an SLA breach:** the request escalates one link up the chain and surfaces
on the dashboard. It stays visible until it moves.

**AuditLog is append-only.** The flow's service account can add rows but not
edit them — that immutability is what makes the workflow defensible to an
auditor.

## 3 · The twelve tech workflows (CW-TEC-WFR-001 sheet 02)

Each is a clone of the reusable flow against its own form (FRM-xx) and SOP.

| Code | Workflow | Form | Trigger | SOP | Owner |
|---|---|---|---|---|---|
| WF-TEC-01 | New staff onboarding (IT) | FRM-01 | A joiner confirmed by People | SOP-TEC-01 | Ops |
| WF-TEC-02 | New group / team site | FRM-02 | A new team or workstream | SOP-TEC-02 | Ops |
| WF-TEC-03 | Joiner-mover-leaver (JML) | FRM-03 | Any personnel change | SOP-TEC-03 | Ops + MD |
| WF-TEC-04 | Access request | FRM-04 | A role needs a tool or library | SOP-TEC-03 | Ops |
| WF-TEC-05 | Help-desk / service request | FRM-05 | Any internal IT need | SOP-TEC-04 | Ops |
| WF-TEC-06 | Incident response | FRM-06 | A security/availability event | SOP-TEC-05 | MD + Ops |
| WF-TEC-07 | Software / licence request | FRM-07 | A new tool or seat is needed | SOP-TEC-06 | Ops + MD |
| WF-TEC-08 | Equipment / device | FRM-08 | A device is needed | SOP-TEC-06 | Ops |
| WF-TEC-09 | Change management | FRM-09 | Any change to the live estate | SOP-TEC-07 | Ops + MD |
| WF-TEC-10 | Backup & restore verification | FRM-10 | The backup calendar | SOP-TEC-08 | Ops |
| WF-TEC-11 | Data-subject / privacy request | FRM-11 | A data-subject request | SOP-TEC-09 | MD |
| WF-TEC-12 | Offboarding / decommission | FRM-12 | A leaver's last day | SOP-TEC-03 | Ops + MD |

Cross-connections the register names: onboarding and JML run against the
credentials register; incident and service workflows write to the incident and
service logs; the licence workflow checks the budget before it provisions.
The processes are not islands — they share the codes.

## 4 · The screening gate (CW-TEC-WFR-001 sheet 05)

Not a step in the sales process — **a gate before it**. Six stages against the
hub's `Screening Gate` list: intake capture (beneficial parties named) →
Arabic-first name resolution (the method the firm applies to itself first; the
50% ownership rule mapped through the chain) → sanctions & exposure screen
(OFAC-designated institutions excluded on sight) → the Five Declines test →
disposition → the standing record (re-screen on any change of parties or at
renewal).

**SCR-DECLINE is terminal and synchronous, routed to the MD on every channel
— not in a batch.** A decline costs a conversation, not a commitment.

## 5 · The v2.0 alarm layer (retained; see ALARMS.md)

The seven pre-committed alarms from CW-PROMPT-SP-001 §9 remain specified in
`docs/ALARMS.md` and log to the hub's `Alarm Log` list. Where a workbook flow
covers the same trigger (e.g. FINOPS approval escalation), build the workbook's
version — it is the firm's own.

## 6 · The e-process board (target state)

The canon's board beneath every zone: Engagement 5 · Governance & Risk 8 ·
People 11 · Operations 9 · Events 4 · Marketing 6 · Technology 4 · Knowledge 2.
The canon names these the forty-eight workflows; the enumeration sums to
forty-nine — a one-row drift the estate reference surfaces deliberately, to
settle in the compendium before the flows are cloned. Do not resolve it
silently in either direction.
