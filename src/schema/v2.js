// CauseWay HQ v2.0 additions — CW-PROMPT-SP-001 §5–§9, provisioned to the hub.
//
// These are the v2.0 prompt's additive lists (Intelligence Feed, Content
// Calendar arc, HR spine, finance interface, alarm layer). The estate's own
// domain workbooks (src/schema/domains/) are the foundation; where a domain
// workbook defines its own equivalent (e.g. CONTENT's Content Calendar per
// EPR-16), the workbook version is provisioned on the domain site and the v2
// list here is retired in its favour — see the RETIRED set at the bottom.

import {
  text, multiline, number, currency, boolean, choice, dateTime, person, lookup, calculated,
} from "../columns.js";
import { TIER } from "../sensitivity.js";

// v1.0 lists that this v2.0 layer only *references* (via lookups). They must
// already exist on the site; the provisioner resolves them by display name and
// warns (does not fail) if one is missing.
export const EXTERNAL_LISTS = [
  "Regulatory Radar",
  "Positions & Roster",
  "Sanctions & Integrity Screen",
  "Live Pipeline",
];

const SCORE_1_4 = ["1", "2", "3", "4"]; // §7.4 scale: 1 Developing · 2 Meets · 3 Strong · 4 Exceptional

// The six competencies of the Performance Scorecard (§7.4), used to generate the
// mid/end/growth column triplets and the Overall Rating formula.
const COMPETENCIES = [
  "Reliability & Ownership",
  "Quality of Work",
  "Learning & Growth",
  "Communication",
  "Collaboration & Conduct",
  "Role-Specific Skill",
];

function scorecardColumns() {
  const cols = [
    person("Staff Member", { required: true }),
    text("Role/Code"),
    person("Supervisor"),
    dateTime("Review Date"),
  ];
  const endpointRefs = [];
  for (const c of COMPETENCIES) {
    cols.push(choice(`${c} — Mid`, SCORE_1_4));
    cols.push(choice(`${c} — End`, SCORE_1_4));
    cols.push(multiline(`${c} — Growth note`, { lines: 3 }));
    // Internal names strip spaces/punctuation; reference the End choice column
    // by its display name in the formula (SharePoint resolves display names and
    // coerces the numeric choice text to a number in arithmetic).
    endpointRefs.push(`[${c} — End]`);
  }
  // §7.4 Overall Rating: average the six End-point scores, map to a band.
  // pending: exact band thresholds to be reconciled against the firm's own
  // Excel scorecard (workbook) — these thresholds are a faithful default of the
  // 1/2/3/4 scale, not the confirmed cut-points.
  const avg = `(${endpointRefs.join("+")})/6`;
  const band =
    `=IF(${avg}>=3.5,"Exceptional",` +
    `IF(${avg}>=2.5,"Strong",` +
    `IF(${avg}>=1.5,"Meets","Developing")))`;
  cols.push(calculated("Overall Rating", band, "text"));
  return cols;
}

export const LISTS = [
  // ─────────────────────────────────────────────────────────── §5 Intelligence
  {
    key: "intelligenceFeed",
    displayName: "Intelligence Feed",
    spoke: "Intelligence & Pipeline",
    tier: TIER.D2,
    description:
      "Every external source lands here (§5.2). A routing record, not a publication — " +
      "provenance is always visible via Source + Category, per Doctrine Rule IV.",
    columns: [
      choice("Source", [
        "UNDP Procurement Notices",
        "Financial Stability Board",
        "World Bank Projects & Procurement",
        "FATF",
        "CBY-Aden",
        "Sana'a Center for Strategic Studies",
        "Reuters / Al Jazeera",
        "Government of Yemen (SABA)",
      ], { required: true }),
      choice("Source Type", ["RSS-Native", "Email-Parsed", "Scheduled-Poll"]),
      text("Headline", { required: true }),
      multiline("Summary"),
      dateTime("Published Date"),
      dateTime("Ingested Date"),
      choice("Category", [
        "Tender/Donor",
        "Standards-Body",
        "CBY-Aden Circular",
        "Independent Analysis",
        "Wire News",
        "Government Statement",
      ]),
      choice("Relevance", ["Line I", "Line II", "Line III", "Horizontal", "Firm-wide"]),
      lookup("Auto-linked Decree", "Regulatory Radar", { optional: true }),
      boolean("Reviewed", { defaultValue: false }),
    ],
    views: [
      // §5.2: a Kanban-by-Category board and a "Needs Review" queue.
      { title: "By Category", groupBy: "Category" },
      {
        title: "Needs Review",
        fields: ["Headline", "Source", "Category", "Published Date"],
        query: "<Where><Eq><FieldRef Name='Reviewed'/><Value Type='Boolean'>0</Value></Eq></Where>" +
               "<OrderBy><FieldRef Name='Published_x0020_Date' Ascending='FALSE'/></OrderBy>",
      },
    ],
  },

  // ────────────────────────────────────────────────────── §6 Content Calendar
  {
    key: "contentCalendar",
    displayName: "Content Calendar",
    spoke: "Marketing & Communications",
    tier: TIER.D2, // → D3 once Status = Published (§10). Enforced by flow, see PENDING.
    description:
      "Outbound social register (§6.2): three platforms, six pillars, the 29-day " +
      "campaign arc. Every post passes the four Review Gates before Approved.",
    columns: [
      choice("Platform", ["LinkedIn", "X", "Instagram"], { required: true }),
      choice("Pillar", [
        "The Premise",
        "The Lines",
        "Evidence & Insight",
        "The Convening",
        "Formation",
        "The Identity",
      ]),
      choice("Campaign Phase", ["Presence", "Announcement", "Countdown", "Launch", "After"]),
      multiline("Draft Copy"),
      choice("Status", ["Draft", "In Review", "Approved", "Scheduled", "Published"], { defaultValue: "Draft" }),
      dateTime("Scheduled Date/Time"),
      person("Approved By"),
      text("Published Link"),
    ],
    views: [
      { title: "Pipeline by Status", groupBy: "Status" },
      {
        title: "Scheduled",
        fields: ["Title", "Platform", "Campaign Phase", "Scheduled Date/Time"],
        query: "<Where><Eq><FieldRef Name='Status'/><Value Type='Choice'>Scheduled</Value></Eq></Where>",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────── §7 Grades
  {
    key: "grades",
    displayName: "Grades",
    spoke: "People & Culture",
    tier: TIER.D2,
    description:
      "Six position-based grades (§7.1). Pay follows the seat and the competency " +
      "level, never tenure or negotiation alone; the framework is consistent and the " +
      "same rules apply to everyone; bands are USD-equivalent for design but paid in " +
      "YER at the prevailing rate, reviewed as FX conditions shift; no band or step " +
      "disadvantages a person for a disability or background.",
    columns: [
      text("Grade", { required: true }),
      text("Tier"),
      multiline("Who sits here", { lines: 3 }),
      multiline("Competency expectation", { lines: 3 }),
    ],
    seed: [
      { Title: "G1", Grade: "G1", Tier: "Entry / Intern", "Who sits here": "Interns, entry support", "Competency expectation": "Core competencies developing" },
      { Title: "G2", Grade: "G2", Tier: "Officer", "Who sits here": "Officers, coordinators, junior delivery", "Competency expectation": "Core competencies at level 2" },
      { Title: "G3", Grade: "G3", Tier: "Specialist", "Who sits here": "Specialists, leads", "Competency expectation": "Core at level 2-3, one role-specific at level 3" },
      { Title: "G4", Grade: "G4", Tier: "Senior / Division contributor", "Who sits here": "Senior delivery, Quality/Risk leads", "Competency expectation": "Core at level 3, role-specific at level 3-4" },
      { Title: "G5", Grade: "G5", Tier: "Director", "Who sits here": "Line Directors, Partnerships", "Competency expectation": "Core at level 3+, role-specific at level 4" },
      { Title: "G6", Grade: "G6", Tier: "Principal / Executive", "Who sits here": "MD, COO", "Competency expectation": "Authority across the firm's standard, level 4" },
    ],
    seedKey: "Grade",
  },

  // ──────────────────────────────────────────────────── §7.2 Recruitment
  {
    key: "recruitmentPipeline",
    displayName: "Recruitment Pipeline",
    spoke: "People & Culture",
    tier: TIER.D1, // Offer Details are personnel-sensitive (§10)
    description:
      "Trigger-based hiring (§7.2): a role opens when its business trigger is met, " +
      "not on a calendar. Candidates for financial/compliance/client-facing roles " +
      "get the same integrity screen as a counterparty — no exception.",
    columns: [
      lookup("Position", "Positions & Roster"),
      lookup("Grade", "Grades"),
      choice("Trigger Status", ["Not Yet Met", "Met — Ready to Open", "Position Open"]),
      multiline("Trigger Condition", { lines: 2 }),
      text("Candidate Name"),
      choice("Stage", ["Sourced", "Screened", "Interviewed", "Offered", "Onboarding", "Hired", "Declined"]),
      lookup("Screening Record", "Sanctions & Integrity Screen", { optional: true }),
      multiline("Interview Notes"),
      multiline("Offer Details"), // D1
      dateTime("Start Date"),
    ],
    views: [
      { title: "By Stage", groupBy: "Stage" },
      {
        title: "Awaiting Trigger",
        fields: ["Candidate Name", "Trigger Status", "Trigger Condition"],
        query: "<Where><Neq><FieldRef Name='Trigger_x0020_Status'/><Value Type='Choice'>Position Open</Value></Neq></Where>",
      },
    ],
  },

  // ───────────────────────────────────────────────────── §7.3 Weekly Check-in
  {
    key: "weeklyCheckin",
    displayName: "Weekly Check-in",
    spoke: "People & Culture",
    tier: TIER.D2,
    description:
      "Generalized from the firm's proven internship check-in (§7.3) to every staff " +
      "member. Load Check is the firm's early-warning signal for burnout / " +
      "under-utilization — kept, not dropped.",
    columns: [
      person("Staff Member", { required: true }),
      text("Role/Code"),
      person("Supervisor"),
      number("Week Number", { min: 1, max: 53, decimals: 0 }),
      multiline("Monday Plan"),
      multiline("Delivered by Friday"),
      multiline("Learning Noted"),
      choice("Load Check", ["Light", "Right", "Heavy"]),
      text("Attendance"),
    ],
    views: [
      { title: "This Week by Person", groupBy: "Staff Member" },
      {
        title: "Heavy Load",
        fields: ["Staff Member", "Week Number", "Load Check", "Supervisor"],
        query: "<Where><Eq><FieldRef Name='Load_x0020_Check'/><Value Type='Choice'>Heavy</Value></Eq></Where>",
      },
    ],
  },

  // ─────────────────────────────────────────────── §7.4 Performance Scorecard
  {
    key: "performanceScorecard",
    displayName: "Performance Scorecard",
    spoke: "People & Culture",
    tier: TIER.D1, // personnel-sensitive (§10)
    description:
      "The firm's six-competency framework (§7.4), rated 1–4 at Mid and End points. " +
      "Overall Rating is a calculated average-and-band, reproducing the firm's Excel " +
      "logic (band thresholds pending workbook confirmation).",
    columns: scorecardColumns(),
    views: [
      { title: "By Supervisor", groupBy: "Supervisor" },
    ],
  },

  // ─────────────────────────────────────────────── §8.1 Chart of Accounts
  {
    key: "chartOfAccounts",
    displayName: "Chart of Accounts",
    spoke: "Finance & Engagement Economics",
    tier: TIER.D2,
    description:
      "Reference only (§8.1) — NOT a ledger. Five-digit, six-class structure so every " +
      "expense/cost captured here reaches the Finance Partner (Kayan) pre-classified. " +
      "USD is the functional currency.",
    columns: [
      text("Class Code", { required: true }),
      text("Class Name"),
      multiline("Description", { lines: 2 }),
    ],
    seed: [
      { Title: "1 — Assets", "Class Code": "1", "Class Name": "Assets" },
      { Title: "2 — Liabilities", "Class Code": "2", "Class Name": "Liabilities" },
      { Title: "3 — Equity", "Class Code": "3", "Class Name": "Equity" },
      { Title: "4 — Revenue", "Class Code": "4", "Class Name": "Revenue" },
      { Title: "5 — Direct Cost", "Class Code": "5", "Class Name": "Direct Cost" },
      { Title: "6 — Operating Expense", "Class Code": "6", "Class Name": "Operating Expense" },
    ],
    seedKey: "Class Code",
  },

  // ───────────────────────────────────────────────────── §8.2 Expense Claims
  {
    key: "expenseClaims",
    displayName: "Expense Claims",
    spoke: "Finance & Engagement Economics",
    tier: TIER.D2,
    description:
      "Capture + approval layer (§8.2). Approved claims carry an Account Class and an " +
      "optional Engagement so data reaches Kayan pre-classified. Tiered approval " +
      "routing by amount is a flow (v1.0 §5.5) — see PENDING.",
    columns: [
      person("Claimant", { required: true }),
      currency("Amount", { required: true }),
      multiline("Purpose"),
      dateTime("Date"),
      lookup("Account Class", "Chart of Accounts"),
      lookup("Engagement", "Live Pipeline", { optional: true }),
      choice("Approval Status", ["Submitted", "Approved", "Rejected"], { defaultValue: "Submitted" }),
      person("Approver"),
    ],
    views: [
      { title: "By Approval Status", groupBy: "Approval Status" },
      {
        title: "Awaiting Approval",
        fields: ["Claimant", "Amount", "Date", "Account Class"],
        query: "<Where><Eq><FieldRef Name='Approval_x0020_Status'/><Value Type='Choice'>Submitted</Value></Eq></Where>",
      },
    ],
  },

  // ──────────────────────────────────────────── §8.3 Engagement Profitability
  {
    key: "engagementProfitability",
    displayName: "Engagement Profitability",
    spoke: "Finance & Engagement Economics",
    tier: TIER.D1, // financial (§10)
    description:
      "One record per engagement (§8.3), linked to Live Pipeline once at Build+ stage. " +
      "Revenue is a fact Kayan's books hold (entered, not computed); Direct Costs are " +
      "summed from linked Expense Claims (Class 5) by flow; margins are calculated.",
    columns: [
      lookup("Engagement", "Live Pipeline"),
      currency("Revenue Recognized"),
      currency("Direct Costs"), // populated by flow (sum of Class-5 Expense Claims)
      calculated("Gross Margin", "=[Revenue Recognized]-[Direct Costs]", "currency"),
      calculated("Margin %", "=IF([Revenue Recognized]=0,0,([Revenue Recognized]-[Direct Costs])/[Revenue Recognized])", "number"),
    ],
    views: [
      { title: "Margin Trend", fields: ["Title", "Revenue Recognized", "Direct Costs", "Gross Margin", "Margin %"] },
    ],
  },

  // ─────────────────────────────────────────────────────── §8.4 Cash Position
  {
    key: "cashPosition",
    displayName: "Cash Position",
    spoke: "Finance & Engagement Economics",
    tier: TIER.D1,
    description:
      "Manually entered weekly by the CFO (§8.4). The actual bank balance lives in a " +
      "banking system this build cannot reach — the dashboard shows 'last updated by " +
      "CFO on [date]', never a faked live figure.",
    columns: [
      dateTime("Date", { required: true }),
      currency("Balance", { required: true }),
      person("Entered By"),
    ],
    views: [
      { title: "Latest First", fields: ["Date", "Balance", "Entered By"],
        query: "<OrderBy><FieldRef Name='Date' Ascending='FALSE'/></OrderBy>" },
    ],
  },

  // ───────────────────────────────────────────────────────────── §9 Alarm Log
  {
    key: "alarmLog",
    displayName: "Alarm Log",
    spoke: "Operations & Governance",
    tier: TIER.D2,
    description:
      "Every alarm fire is logged here (§9) so the firm can see which alarms fire and " +
      "which never do — a silent alarm may mean a wrong threshold, not that all is " +
      "well. The alarm flows themselves are documented in docs/ALARMS.md.",
    columns: [
      text("Trigger Name", { required: true }),
      dateTime("Fired Date"),
      text("Watched Value"),
      text("Threshold"),
      text("Routed To"),
      person("Acknowledged By"),
      dateTime("Acknowledged Date"),
    ],
    views: [
      { title: "By Trigger", groupBy: "Trigger Name" },
      {
        title: "Unacknowledged",
        fields: ["Trigger Name", "Fired Date", "Watched Value", "Routed To"],
        query: "<Where><IsNull><FieldRef Name='Acknowledged_x0020_Date'/></IsNull></Where>" +
               "<OrderBy><FieldRef Name='Fired_x0020_Date' Ascending='FALSE'/></OrderBy>",
      },
    ],
  },
];

// ---- estate reconciliation ---------------------------------------------------
// Where the firm's own domain workbook defines the same instrument, the
// workbook version wins and the v2 list is retired (not provisioned).
export const RETIRED = new Set([
  "Content Calendar", // superseded by CW-SPB-CONTENT's Content Calendar (EPR-16)
]);

// PEOPLE is a SHELL completed at the Zone 08 finale — "the rating system is
// built last" is the workbook's own law, and the MD holds sequencing
// authority. The v2 HR spine is therefore defined but NOT provisioned until
// the finale is invoked explicitly (--include-finale).
export const DEFERRED_TO_FINALE = new Set([
  "Grades",
  "Recruitment Pipeline",
  "Weekly Check-in",
  "Performance Scorecard",
]);

// Which estate site each surviving v2 list provisions to. Unlisted → hub.
export const V2_TARGET = {
  "Expense Claims": "finops",
  "Engagement Profitability": "finops",
  "Cash Position": "finops",
  "Chart of Accounts": "finops",
  "Grades": "people",
  "Recruitment Pipeline": "people",
  "Weekly Check-in": "people",
  "Performance Scorecard": "people",
  // Intelligence Feed and Alarm Log stay on the hub — firm-wide instruments.
};
