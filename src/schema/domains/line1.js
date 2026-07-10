// CW-SPB-LINE1 — Line I: State & Development. Owner: Line I Principal.
// Tagline: Counsel at the level of the state.

import { text, multiline, choice, dateTime, person } from "../../columns.js";
import { ENGAGEMENT_STAGE } from "../coding.js";

export const LINE1 = {
  key: "line1",
  code: "CW-SPB-LINE1",
  site: {
    name: "CauseWay · Line I — State & Development",
    tagline: "Counsel at the level of the state",
    type: "communication",
    hub: "CauseWay-OS",
    owner: "Line I Principal",
  },
  libraries: [
    { name: "Line I Intelligence", purpose: "Dated sector notes, WB/GCF trackers, monetary line", kind: "documentLibrary",
      metadata: [text("Topic"), text("Source"), dateTime("Date"), choice("D-class", ["D0", "D1", "D2", "D3"])] },
    { name: "Programme Workspaces", purpose: "One folder per live engagement", kind: "documentLibrary", docSet: true,
      metadata: [text("Engagement code"), text("Institution"), choice("Stage", ENGAGEMENT_STAGE)] },
    { name: "Readiness Registers", purpose: "Gap registers & costed plans", kind: "documentLibrary",
      metadata: [text("Engagement"), text("Claim"), text("Status"), person("Verifier")] },
    { name: "Line I TOR Library", purpose: "Ministry/WB/UN/PIU TOR frames", kind: "documentLibrary",
      metadata: [text("Counterpart type"), text("Version")] },
    { name: "Deliverables", purpose: "Issued analyses (not client files)", kind: "documentLibrary",
      metadata: [text("Engagement"), text("Gate status"), dateTime("Date")] },
  ],
  lists: [
    {
      displayName: "Line I Engagements",
      purpose: "Live mandate tracker",
      columns: [
        text("Code", { required: true }),        // ENG-YYYY-nnn
        text("Institution", { required: true }),
        text("Service"),                          // SV-L1-x
        choice("Stage", ENGAGEMENT_STAGE),
        dateTime("Target date"),
      ],
      views: [{ title: "Bridge board", fields: ["Code", "Institution", "Service", "Stage", "Target date"] }],
    },
    {
      displayName: "Readiness Register",
      purpose: "The engagement spine",
      columns: [
        text("Engagement", { required: true }),
        multiline("Claim", { lines: 2, required: true }),
        text("Source"),
        person("Verifier"),
        choice("Status", ["Unverified", "Verified", "Disputed", "Retired"], { defaultValue: "Unverified" }),
      ],
      views: [
        { title: "By status", groupBy: "Status" },
        { title: "Your action", fields: ["Engagement", "Claim", "Source", "Status"],
          query: "<Where><Eq><FieldRef Name='Verifier'/><Value Type='Integer'><UserID/></Value></Eq></Where>" },
      ],
    },
    {
      displayName: "Sector Feed",
      purpose: "Dated intelligence items",
      columns: [
        text("Item", { required: true }),
        text("Source"),
        dateTime("Date"),
        choice("Relevance", ["Line I", "Line II", "Line III", "Horizontal", "Firm-wide"]),
        text("Lands in"),
      ],
      views: [{ title: "This week", fields: ["Item", "Source", "Date", "Relevance", "Lands in"],
        query: "<Where><Geq><FieldRef Name='Date'/><Value Type='DateTime'><Today OffsetDays='-7'/></Value></Geq></Where>" +
               "<OrderBy><FieldRef Name='Date' Ascending='FALSE'/></OrderBy>" }],
    },
    {
      displayName: "Climate Pipeline",
      purpose: "GCF/adaptation concept notes",
      columns: [
        text("Institution", { required: true }),
        text("Window"),
        choice("Stage", ENGAGEMENT_STAGE),
        dateTime("Deadline"),
      ],
      views: [{ title: "By deadline", fields: ["Institution", "Window", "Stage", "Deadline"],
        query: "<OrderBy><FieldRef Name='Deadline' Ascending='TRUE'/></OrderBy>" }],
    },
  ],
  permissions: [
    { group: "Line I Principal", level: "Full control", note: "Owns the line" },
    { group: "Fellow (F3)", level: "Contribute", note: "Delivers" },
    { group: "Client seats", level: "Read (their workspace only)", note: "RLS by institution" },
    { group: "COO", level: "Read + gate", note: "Bridge" },
  ],
  flows: [
    { name: "Engagement start", what: "Signed → workspace instantiated → seed pack", eprocess: "EPR-17" },
    { name: "Register freshness", what: "Claim >30 days unverified → flag", eprocess: "SOP-H-01" },
    { name: "Sector feed", what: "Source update → item to Line I feed (Editor publishes)", eprocess: "SOP-INT-01" },
  ],
};
