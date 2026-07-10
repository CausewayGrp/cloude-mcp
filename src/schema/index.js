// The CauseWay-OS estate, composed.
//
// One hub (CauseWay-OS) + seven domain sites (the CW-SPB workbooks) + the
// sixteen zone libraries + the workflow/forms registers + the v2.0 additive
// lists, reconciled. Sources, in order of authority for the SharePoint build:
//   1. CW-SPB-* domain workbooks (one per domain, verbatim)
//   2. CW-SP-REF-001 estate reference (zones, the reusable request pattern)
//   3. CW-TEC-WFR-001 workflows/forms/coding register
//   4. CW-PROMPT-SP-001 v2.0 (additive lists, reconciled in v2.js)
//   5. The House Stationery branding upgrade (src/branding/)

import { text, choice, dateTime, person, multiline } from "../columns.js";
import { DOMAINS, BUILD_ORDER } from "./domains/index.js";
import { ZONES, FIVE_FOLDER_INTERIOR, EPROCESS_DOMAINS } from "./zones.js";
import {
  WORKFLOW_REGISTER, FORMS_REGISTER, SCREENING_GATE, SCREENING_LOG_COLUMNS,
  requestsListColumns, AUDIT_LOG_COLUMNS, COMMENTS_COLUMNS, ONBOARDING_STAGES, ONBOARDING_SLAS,
} from "./workflows.js";
import { LISTS as V2_LISTS, EXTERNAL_LISTS, RETIRED, DEFERRED_TO_FINALE, V2_TARGET } from "./v2.js";
import * as CODING from "./coding.js";

export const HUB = {
  key: "hub",
  site: {
    name: "CauseWay-OS",
    tagline: "The operating system of the firm",
    type: "communication",
    owner: "MD",
  },
};

// ---- hub-level lists ----------------------------------------------------------

// The screening gate list — firm-level, upstream of every mandate.
const SCREENING_LIST = {
  key: "screeningGate",
  displayName: "Screening Gate",
  purpose: "Counterpart screening before any mandate — the gate the Five Declines run on (CW-TEC-WFR-001 sheet 05)",
  columns: SCREENING_LOG_COLUMNS,
  views: [
    { title: "Open screens", fields: ["Engagement code", "Client type", "Outcome", "Analyst", "Screened date"],
      query: "<Where><IsNull><FieldRef Name='Outcome'/></IsNull></Where>" },
    { title: "Declines", fields: ["Engagement code", "Client type", "Finding / reason", "Screened date"],
      query: "<Where><Eq><FieldRef Name='Outcome'/><Value Type='Choice'>SCR-DECLINE</Value></Eq></Where>" },
    { title: "Re-screens due", fields: ["Engagement code", "Re-screen due", "Analyst"],
      query: "<Where><Leq><FieldRef Name='Re-screen_x0020_due'/><Value Type='DateTime'><Today OffsetDays='14'/></Value></Leq></Where>" },
  ],
};

// The reusable request pattern (CW-SP-REF-001) — Requests + AuditLog + Comments.
// Provisioned to the People domain site (its reference instantiation is the
// onboarding JML workflow); the same trio is cloned per workflow family later.
const REQUESTS_PATTERN = [
  {
    key: "requestsPeople",
    displayName: "Requests_People",
    targetDomain: "people",
    purpose: "The onboarding (JML) request database — one row per request, staged by the flow (WF-HR-01)",
    columns: requestsListColumns(ONBOARDING_STAGES),
    views: [
      { title: "In flight", fields: ["RequestRef", "JoinerName", "Position", "StartDate", "CurrentStage", "Assignee", "Status", "SLA_Due"],
        query: "<Where><Neq><FieldRef Name='Status'/><Value Type='Choice'>Closed</Value></Neq></Where>" },
      { title: "Overdue", fields: ["RequestRef", "JoinerName", "CurrentStage", "Assignee", "SLA_Due"],
        query: "<Where><And><Lt><FieldRef Name='SLA_x005f_Due'/><Value Type='DateTime'><Today/></Value></Lt>" +
               "<Neq><FieldRef Name='Status'/><Value Type='Choice'>Closed</Value></Neq></And></Where>" },
      { title: "By stage", groupBy: "CurrentStage" },
    ],
  },
  {
    key: "auditLog",
    displayName: "AuditLog",
    targetDomain: "people",
    purpose: "Append-only — one row per transition. The flow's service account can add rows but not edit them; that immutability is what makes the workflow defensible to an auditor.",
    appendOnly: true,
    columns: AUDIT_LOG_COLUMNS,
    views: [{ title: "By request", groupBy: "RequestRef" }],
  },
  {
    key: "requestComments",
    displayName: "Comments",
    targetDomain: "people",
    purpose: "Request comments — read/written by the flow; nothing stored twice",
    columns: COMMENTS_COLUMNS,
    views: [{ title: "By request", groupBy: "RequestRef" }],
  },
];

// v2.0 survivors routed to their estate sites.
const V2_SURVIVORS = V2_LISTS
  .filter((l) => !RETIRED.has(l.displayName))
  .map((l) => ({
    ...l,
    targetDomain: V2_TARGET[l.displayName] || "hub",
    deferredToFinale: DEFERRED_TO_FINALE.has(l.displayName),
  }));

export const HUB_LISTS = [
  SCREENING_LIST,
  ...V2_SURVIVORS.filter((l) => l.targetDomain === "hub"),
];

// Lists that live on a domain site but are defined outside its workbook
// (the request pattern trio + routed v2 survivors).
export const EXTRA_DOMAIN_LISTS = [
  ...REQUESTS_PATTERN,
  ...V2_SURVIVORS.filter((l) => l.targetDomain !== "hub"),
];

export const ESTATE = {
  hub: HUB,
  domains: DOMAINS,
  buildOrder: BUILD_ORDER,
  zones: ZONES,
  zoneInterior: FIVE_FOLDER_INTERIOR,
  eprocessBoard: EPROCESS_DOMAINS,
  hubLists: HUB_LISTS,
  extraDomainLists: EXTRA_DOMAIN_LISTS,
  workflowRegister: WORKFLOW_REGISTER,
  formsRegister: FORMS_REGISTER,
  screeningGate: SCREENING_GATE,
  onboarding: { stages: ONBOARDING_STAGES, slas: ONBOARDING_SLAS },
  coding: CODING,
};

// ---- backwards-compatible exports (v2 provisioner-era API) --------------------
export { V2_LISTS as LISTS, EXTERNAL_LISTS, RETIRED, DEFERRED_TO_FINALE };
export { DOMAINS, BUILD_ORDER, ZONES, FIVE_FOLDER_INTERIOR, EPROCESS_DOMAINS };
export { WORKFLOW_REGISTER, FORMS_REGISTER, SCREENING_GATE };
