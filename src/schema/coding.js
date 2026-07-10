// The coding scheme — CW-TEC-WFR-001 sheets 01 & 04, verbatim.
//
// "Nothing here is named without being coded, because a code is what a machine
// can route on." Eight tech schemes + the commercial schemes. A SharePoint list
// built from the register uses them as-is: severity, status and category
// become choice columns; the role scheme becomes the permission level; the
// workflow and form codes become the lookup that ties a ticket to its process.

// ---- the eight tech schemes -------------------------------------------------

export const SEVERITY = ["P1", "P2", "P3", "P4"]; // critical · major · standard · request

export const STATUS = ["OPEN", "IN-PROGRESS", "WAITING", "RESOLVED", "CLOSED", "REJECTED"];

export const CATEGORY = ["JML", "ACCESS", "LICENCE", "EQUIPMENT", "SUPPORT", "SECURITY", "CHANGE", "DATA"];

// Access tiers plus REQ (requester) — who can raise, approve, action and see each field.
export const RBAC = ["D0", "D1", "D2", "D3", "REQ"];

export const ACCESS_TIER = {
  D0: "root",
  D1: "management",
  D2: "operational",
  D3: "contributor",
};

// Workflow codes WF-TEC-01…12 and form codes FRM-01…12 are defined in
// workflows.js; zone codes 00…15 in zones.js.

// ---- the commercial schemes (sheet 04) --------------------------------------

export const LINE = ["L1", "L2", "L3", "H", "EN"]; // three lines, the horizontal, the Expert Network

export const TIER = ["T1", "T2", "T3", "T4"]; // Assessment · Sprint · Programme · Retainer

export const CLIENT_TYPE = ["CT-BANK", "CT-ISLB", "CT-MFI", "CT-EXCH", "CT-MIN", "CT-CB", "CT-DFI", "CT-DONOR"];

// SCREEN and ESCROW are gates, not stages: nothing passes them unmet.
export const ENGAGEMENT_STAGE = ["LEAD", "SCREEN", "SCOPE", "ESCROW", "DELIVER", "REVIEW", "CLOSE"];

// SCR-DECLINE is terminal and synchronous, routed to the MD on every channel.
export const SCREENING_OUTCOME = ["SCR-CLEAR", "SCR-REVIEW", "SCR-DECLINE"];

// Engagement numbers: ENG-YYYY-nnn — year and sequence, the case number every
// mandate carries from first note to final invoice.
export const ENGAGEMENT_CODE_PATTERN = /^ENG-\d{4}-\d{3}$/;

// Instrument codes: the clean convention. Legacy CWXXX### is retired to Zone 15.
export const INSTRUMENT_CODE_PATTERN = /^CW-[A-Z]{2,4}-[\w-]+$/;

// ---- position groups (permission follows position, never person) ------------
// From the estate reference's onboarding schema (PositionGroup choices).
export const POSITION_GROUPS = ["CW-MD", "CW-COO", "CW-Creative", "CW-Technology", "CW-AllStaff"];

export const EMPLOYMENT_TYPE = ["Staff", "Fellow", "Intern", "Expert"];

// FINOPS spend thresholds (CW-SPB-FINOPS tab 05): $500→CFO, $2k→COO, >$2k→MD.
export const SPEND_THRESHOLDS = [
  { upTo: 500, approver: "CFO" },
  { upTo: 2000, approver: "COO" },
  { upTo: Infinity, approver: "MD" },
];
