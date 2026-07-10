// The workflow & forms registers — CW-TEC-WFR-001 sheets 02–03 and 05, plus the
// reusable request pattern demonstrated end-to-end in CW-SP-REF-001 (the
// Requests_People onboarding build). Verbatim from the firm's registers.

import { text, multiline, number, currency, boolean, choice, dateTime, person, lookup, calculated } from "../columns.js";
import { SEVERITY, STATUS, CATEGORY, EMPLOYMENT_TYPE, POSITION_GROUPS, SCREENING_OUTCOME, CLIENT_TYPE } from "./coding.js";

// ---- the twelve internal tech workflows (sheet 02) ---------------------------

export const WORKFLOW_REGISTER = [
  { code: "WF-TEC-01", name: "New staff onboarding (IT)", form: "FRM-01", steps: "Request → approve → provision seat → assign tier → issue device → induct → confirm", trigger: "A joiner confirmed by People", sop: "SOP-TEC-01", owner: "Ops" },
  { code: "WF-TEC-02", name: "New group / team site", form: "FRM-02", steps: "Request → scope → create site → set permissions → apply template → hand over", trigger: "A new team or workstream", sop: "SOP-TEC-02", owner: "Ops" },
  { code: "WF-TEC-03", name: "Joiner-mover-leaver access (JML)", form: "FRM-03", steps: "Trigger → map change → grant/alter/revoke → re-key if leaver → confirm same-day", trigger: "Any personnel change", sop: "SOP-TEC-03", owner: "Ops + MD" },
  { code: "WF-TEC-04", name: "Access request (grant/change)", form: "FRM-04", steps: "Request → owner approves → provision → log → review at quarter", trigger: "A role needs a tool or library", sop: "SOP-TEC-03", owner: "Ops" },
  { code: "WF-TEC-05", name: "Help-desk / service request", form: "FRM-05", steps: "Raise → triage severity → route → resolve → root cause → close", trigger: "Any internal IT need", sop: "SOP-TEC-04", owner: "Ops" },
  { code: "WF-TEC-06", name: "Incident response", form: "FRM-06", steps: "Detect → grade → contain → (break-glass) → resolve → post-incident review", trigger: "A security/availability event", sop: "SOP-TEC-05", owner: "MD + Ops" },
  { code: "WF-TEC-07", name: "Software / licence request", form: "FRM-07", steps: "Request → cost-check vs budget → approve → provision seat → add to register", trigger: "A new tool or seat is needed", sop: "SOP-TEC-06", owner: "Ops + MD" },
  { code: "WF-TEC-08", name: "Equipment / device", form: "FRM-08", steps: "Request → approve → procure/assign → secure/enrol → hand over → log asset", trigger: "A device is needed", sop: "SOP-TEC-06", owner: "Ops" },
  { code: "WF-TEC-09", name: "Change management", form: "FRM-09", steps: "Propose → assess risk → approve → schedule → implement → verify → log", trigger: "Any change to the live estate", sop: "SOP-TEC-07", owner: "Ops + MD" },
  { code: "WF-TEC-10", name: "Backup & restore verification", form: "FRM-10", steps: "Scheduled → run → verify integrity → test restore → log → alert on fail", trigger: "The backup calendar", sop: "SOP-TEC-08", owner: "Ops" },
  { code: "WF-TEC-11", name: "Data-subject / privacy request", form: "FRM-11", steps: "Receive → verify identity → locate → action (access/erase) → respond in time", trigger: "A data-subject request", sop: "SOP-TEC-09", owner: "MD" },
  { code: "WF-TEC-12", name: "Offboarding / decommission", form: "FRM-12", steps: "Trigger → revoke all → re-key → archive files → wipe device → confirm closed", trigger: "A leaver's last day", sop: "SOP-TEC-03", owner: "Ops + MD" },
];

// ---- the forms register, to field depth (sheet 03) ---------------------------
// A form is a data contract, not a document. The four highest-sensitivity forms
// are specified to field depth in the register; the remaining eight follow the
// same pattern. RBAC is read strictly: a D0 field is visible only to root tier.

export const FORMS_REGISTER = [
  {
    code: "FRM-01", feeds: "WF-TEC-01", name: "New staff onboarding (IT)",
    fields: [
      { field: "Full name", type: "Text", required: true, rbac: "REQ", note: "The joiner's legal name" },
      { field: "Role / position code", type: "Lookup", required: true, rbac: "D1", note: "From the People positions register (P-xx)" },
      { field: "Start date", type: "Date", required: true, rbac: "REQ", note: "Drives the provisioning clock" },
      { field: "Access tier", type: "Choice", required: true, rbac: "D1", note: "D2 or D3 default; D1 by exception, MD-approved" },
      { field: "Zone(s)", type: "Choice (multi)", required: true, rbac: "D1", note: "Which libraries the seat needs" },
      { field: "Device needed", type: "Choice", required: true, rbac: "REQ", note: "Yes / No / BYOD-enrolled" },
      { field: "Approver", type: "Person", required: true, rbac: "D1", note: "The manager who owns the seat" },
      { field: "Status", type: "Choice", required: "auto", rbac: "D1", note: "OPEN → … → CLOSED" },
    ],
  },
  {
    code: "FRM-04", feeds: "WF-TEC-04", name: "Access request (grant/change)",
    fields: [
      { field: "Requester", type: "Person", required: true, rbac: "REQ", note: "Auto-filled from the account" },
      { field: "Account / tool code", type: "Lookup", required: true, rbac: "REQ", note: "From the credentials register (ACC-xx)" },
      { field: "Access type", type: "Choice", required: true, rbac: "REQ", note: "Grant / Change / Revoke" },
      { field: "Business reason", type: "Text", required: true, rbac: "REQ", note: "Why the access is needed" },
      { field: "Owner approval", type: "Person", required: true, rbac: "D1", note: "The account owner signs" },
      { field: "Expiry", type: "Date", required: false, rbac: "D1", note: "Required for D3 (time-bound) access" },
    ],
  },
  {
    code: "FRM-06", feeds: "WF-TEC-06", name: "Incident response",
    fields: [
      { field: "Detected by", type: "Person", required: true, rbac: "D1", note: "Who raised the incident" },
      { field: "Severity", type: "Choice", required: true, rbac: "D1", note: "P1–P4 — sets the SLA and routing" },
      { field: "Systems affected", type: "Choice (multi)", required: true, rbac: "D1", note: "Which accounts/platforms" },
      { field: "Data exposed?", type: "Choice", required: true, rbac: "D0", note: "Yes/No/Unknown — Yes escalates to P1" },
      { field: "Containment", type: "Text", required: true, rbac: "D1", note: "What was done to contain" },
      { field: "Root cause", type: "Text", required: true, rbac: "D1", note: "Required before close" },
      { field: "What changed", type: "Text", required: true, rbac: "D1", note: "The fix that prevents recurrence" },
    ],
  },
  {
    code: "FRM-11", feeds: "WF-TEC-11", name: "Data-subject / privacy request",
    fields: [
      { field: "Subject name", type: "Text", required: true, rbac: "D0", note: "The data subject — never seen operationally" },
      { field: "Request type", type: "Choice", required: true, rbac: "D0", note: "Access / Rectify / Erase / Object" },
      { field: "Identity verified", type: "Choice", required: true, rbac: "D0", note: "Must be Yes before any action" },
      { field: "Response due", type: "Date", required: "auto", rbac: "D0", note: "The statutory clock" },
      { field: "Action taken", type: "Text", required: true, rbac: "D0", note: "What was done, for the record" },
    ],
  },
];

// ---- the reusable request pattern (CW-SP-REF-001, built end-to-end) ----------
// One reusable flow, instantiated per workflow row: form → list → staged flow →
// dashboard, with an append-only AuditLog and a Comments list behind it.
// "AuditLog is append-only … that immutability is what makes the workflow
// defensible to an auditor."

export function requestsListColumns(stages) {
  return [
    text("RequestRef"),                                      // system — generated on create, e.g. HR-2026-014
    text("JoinerName", { required: true }),                  // shown as the item title
    choice("Position", ["[seed from positions register]"], { allowFillIn: true }),
    choice("EmploymentType", EMPLOYMENT_TYPE, { required: true }),
    person("LineManager", { required: true }),               // first approver in the chain
    dateTime("StartDate", { required: true }),               // ≥ today + 3 working days; SLA counts back
    choice("LicenceTier", ["Business Standard", "Business Premium"], { required: true }), // Premium = MD/COO only
    choice("PositionGroup", POSITION_GROUPS),                // auto from position
    choice("ZonesGranted", ZONES_GRANTABLE, { allowFillIn: false }), // 12 & 13 excluded by rule
    boolean("VaultAccess", { defaultValue: false }),         // on only if the position holds a credential (CW-POL-T09)
    choice("Device", ["Laptop — standard", "Laptop — security-tier", "BYOD (managed)"], { required: true }),
    text("CurrentStage"),                                    // set by the flow
    person("Assignee"),                                      // current holder, by position
    choice("Status", ["Submitted", "With supervisor", "In chain", "Returned", "Approved", "Closed"]),
    dateTime("SLA_Due"),                                     // set on submit; breach escalates one link up
    multiline("ReturnReason", { lines: 2 }),                 // required if a step returns the request
  ];
}

// Zones a seat may be granted — confidential zones (12, 13) are never granted
// through the form, by rule.
const ZONES_GRANTABLE = [
  "00 Canon", "01 Strategy", "02 Intelligence", "03 Business Lines", "04 Commercial",
  "05 Profile", "06 Voice", "07 Social", "08 Technology", "09 Convening",
  "10 People & Culture", "11 Operations", "14 Registrations", "15 Quality",
];

export const AUDIT_LOG_COLUMNS = [
  text("RequestRef", { required: true }),
  dateTime("When", { required: true }),
  text("Actor"),          // position, not person, where the flow acts
  text("FromStage"),
  text("ToStage"),
  multiline("Why", { lines: 2 }),
];

export const COMMENTS_COLUMNS = [
  text("RequestRef", { required: true }),
  person("Author"),
  dateTime("When"),
  multiline("Comment"),
];

export const ONBOARDING_STAGES = ["With supervisor", "HR", "Technology", "Manager", "Closed"];

// Stage SLAs from the reference build's swimlane: supervisor 1d, HR 1d,
// Technology 2d. On breach: escalate one link up — it stays visible until it
// moves. On return: written reason required, clock resets, routes back to the
// requester — never lost, never blamed.
export const ONBOARDING_SLAS = { "With supervisor": 1, HR: 1, Technology: 2 };

// ---- the screening gate (CW-TEC-WFR-001 sheet 05) -----------------------------
// Screening is a gate before the sale, not a step in it. Arabic-first name
// resolution, the 50% ownership rule mapped through the chain, the Five
// Declines, synchronous decline routing to the MD on every channel.

export const SCREENING_GATE = [
  { stage: 1, name: "Intake capture", what: "The counterpart is logged as a LEAD with its client-type code (CT-xx) and the beneficial parties named — the persons behind the institution, not only the institution", gate: "Proceeds to screen" },
  { stage: 2, name: "Name resolution (Arabic-first)", what: "Every party is resolved in Arabic and transliteration — the method the firm applies to itself first — against sanctions and adverse-media sources; the 50% ownership rule is mapped through the chain", gate: "Names resolved, or held" },
  { stage: 3, name: "Sanctions & exposure screen", what: "Each resolved party is screened; OFAC-designated institutions are excluded on sight; indirect exposure through ownership is followed, not waved past", gate: "SCR-CLEAR / SCR-REVIEW / SCR-DECLINE" },
  { stage: 4, name: "The Five Declines test", what: "Beyond sanctions: does the mandate ask for advocacy, sit below standard, conflict with another mandate, or touch integrity? Any yes is a decline", gate: "Pass, or decline with reason" },
  { stage: 5, name: "Disposition", what: "CLEAR proceeds to SCOPE; REVIEW goes to the MD with the finding; DECLINE is terminal, synchronous, and routed to the MD on every channel — and the reason is recorded", gate: "Gate set; nothing proceeds unmet" },
  { stage: 6, name: "The record", what: "The screening outcome (SCR-xx) is stamped on the engagement and held; a re-screen runs on any change of parties or at renewal", gate: "A standing, auditable record" },
];

export const SCREENING_LOG_COLUMNS = [
  text("Engagement code", { required: true }),      // ENG-YYYY-nnn
  choice("Client type", CLIENT_TYPE),
  multiline("Beneficial parties", { lines: 3 }),    // the persons behind the institution
  boolean("Arabic-first resolved", { defaultValue: false }),
  choice("Outcome", SCREENING_OUTCOME),
  multiline("Finding / reason", { lines: 3 }),      // the reason is recorded, always
  person("Analyst"),
  dateTime("Screened date"),
  dateTime("Re-screen due"),                        // on any change of parties or at renewal
];
