# §9 — The alarm layer (flow specifications)

Power Automate flows cannot be created through Microsoft Graph in a portable
way, so the seven alarms below are specified here for a tenant admin (or a
future flow-provisioning layer) to build. Every flow writes one row to the
**Alarm Log** list (provisioned by this package) on each fire, so a
never-firing alarm is visible and can be re-tuned.

Alarm Log columns each flow should populate: `Trigger Name`, `Fired Date`,
`Watched Value`, `Threshold`, `Routed To`. `Acknowledged By` / `Acknowledged
Date` are filled by the recipient, not the flow.

| # | Trigger | Watched list / field | Threshold | Routes to | Trigger type |
|---|---|---|---|---|---|
| 1 | Conversion falling | Pipeline Stage transitions, computed monthly | Diagnostic→Design conversion below plan for 2 consecutive months | MD + affected Line Director | Scheduled (monthly) |
| 2 | QA gate first-pass falling | Review Gates, PASS/RETURNED ratio | Any drop month-over-month | COO | Scheduled (monthly) |
| 3 | Revenue concentration rising | Live Pipeline, single-relationship share of total weighted value | Above 20% | MD + CFO (Teams **+ email**) | On item change |
| 4 | Recurring share flat | Pipeline Health = "Standing" share of total | Not rising across two consecutive quarters | MD | Scheduled (quarterly) |
| 5 | Sanctioned-nexus signal | Sanctions & Integrity Screen, any Flag outcome | Immediate, any occurrence | MD + COO + CCO — Teams **and a priority/urgent notification** | On item change |
| 6 | Decree SLA approaching | Regulatory Radar, Response Deadline | 24h before deadline, and again at breach | The decree's Owner | Scheduled (hourly check) |
| 7 | Performance load flagged | Weekly Check-in, Load Check | "Heavy" logged two weeks running for same person | That person's Supervisor — **private** Teams message | On item change |

## Build notes

- **#5 is the highest-priority alarm.** It must not wait for someone to open
  Teams at their normal pace — use the tenant's urgent/priority messaging if the
  Teams plan supports it, in addition to the standard card. Fire on *any* Flag
  outcome, immediately.
- **#7 routes privately**, never to a public channel — it is a wellbeing signal.
- Alarms 1, 2, 4 are inherently periodic (they compare across months/quarters),
  so they are scheduled flows per §4's rule that a schedule is a last resort for
  genuinely time-based computation. Alarms 3, 5, 7 fire on item change.
- Thresholds are the firm's own pre-committed triggers (workbook tab 02,
  "Triggers that shift posture"). Confirm the exact plan baselines for #1 and the
  "below plan" definition against the workbook before going live.
