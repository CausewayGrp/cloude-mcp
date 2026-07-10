// CW-SPB-LINE2 — Line II: Banking & Regulation. Owner: Line II Principal.
// Tagline: Where regulation, risk, and reality meet.

import { text, multiline, number, boolean, choice, dateTime, person } from "../../columns.js";
import { ENGAGEMENT_STAGE, TIER } from "../coding.js";

export const LINE2 = {
  key: "line2",
  code: "CW-SPB-LINE2",
  site: {
    name: "CauseWay · Line II — Banking & Regulation",
    tagline: "Where regulation, risk, and reality meet",
    type: "communication",
    hub: "CauseWay-OS",
    owner: "Line II Principal",
  },
  libraries: [
    { name: "Tier Law Dossiers", purpose: "One per bank engagement, A→E", kind: "documentLibrary", docSet: true,
      metadata: [text("Engagement"), choice("Tier", TIER), text("Progress")] },
    { name: "Sanctions Terrain", purpose: "The doctrine, cases, list references", kind: "documentLibrary",
      metadata: [text("Topic"), dateTime("Date"), choice("D-class", ["D0", "D1", "D2", "D3"])] },
    { name: "CBDDQ Workroom", purpose: "Correspondent dossiers in progress", kind: "documentLibrary", docSet: true,
      metadata: [text("Engagement"), text("Section"), text("Status")] },
    { name: "Clinic Files", purpose: "Intake + 48h reads (NDA-gated)", kind: "documentLibrary", restricted: true,
      metadata: [text("File ref"), text("Domain"), text("Read status")] },
    { name: "Line II Deliverables", purpose: "Issued reads & SOPs", kind: "documentLibrary",
      metadata: [text("Engagement"), text("Gate"), dateTime("Date")] },
  ],
  lists: [
    {
      displayName: "Line II Engagements",
      purpose: "Tier-tracked mandates",
      columns: [
        text("Code", { required: true }),        // ENG-YYYY-nnn
        text("Institution", { required: true }),
        choice("Tier", TIER),
        dateTime("Target"),
        number("Screening streak", { min: 0, decimals: 0 }),  // consecutive clean daily screens
      ],
      views: [{ title: "Tier board", groupBy: "Tier" }],
    },
    {
      displayName: "Screening Log",
      purpose: "EPR-20 daily v-stamp",
      columns: [
        dateTime("Date", { required: true }),
        text("Lists"),                            // which sanctions lists were pulled
        multiline("Deltas", { lines: 2 }),        // what changed since yesterday
        person("Analyst"),
        boolean("V-stamp", { defaultValue: false }), // verified — or red flag if false with deltas
      ],
      views: [{ title: "Last 30 days", fields: ["Date", "Lists", "Deltas", "Analyst", "V-stamp"],
        query: "<Where><Geq><FieldRef Name='Date'/><Value Type='DateTime'><Today OffsetDays='-30'/></Value></Geq></Where>" +
               "<OrderBy><FieldRef Name='Date' Ascending='FALSE'/></OrderBy>" }],
    },
    {
      displayName: "Obligation Register",
      purpose: "Per-engagement claims",
      columns: [
        text("Engagement", { required: true }),
        multiline("Claim", { lines: 2, required: true }),
        text("Source"),
        person("Verifier"),
        choice("Status", ["Unverified", "Verified", "Disputed", "Retired"], { defaultValue: "Unverified" }),
      ],
      views: [{ title: "By status", groupBy: "Status" }],
    },
    {
      displayName: "Clinic Intake",
      purpose: "RSVP + file logging",
      columns: [
        text("Institution", { required: true }),
        text("File"),
        dateTime("Slot"),
        boolean("NDA signed", { defaultValue: false }),  // no file opens until NDA T12 logged
        dateTime("Read due"),                            // the 48h clock
      ],
      views: [{ title: "Upcoming clinic", fields: ["Institution", "File", "Slot", "NDA signed", "Read due"],
        query: "<Where><Geq><FieldRef Name='Slot'/><Value Type='DateTime'><Today/></Value></Geq></Where>" +
               "<OrderBy><FieldRef Name='Slot' Ascending='TRUE'/></OrderBy>" }],
    },
  ],
  permissions: [
    { group: "Line II Principal", level: "Full control", note: "Owns the line" },
    { group: "Fellow (F1/F2)", level: "Contribute", note: "Delivers" },
    { group: "Compliance", level: "Contribute (Screening)", note: "Runs v-stamp" },
    { group: "Client seats", level: "Read (own dossier)", note: "RLS" },
  ],
  flows: [
    { name: "Daily screening", what: "05:00 → pull deltas → v-stamp or red flag", eprocess: "EPR-20" },
    { name: "Clinic NDA gate", what: "No file opens until NDA T12 logged", eprocess: "SOP-LII-05" },
    { name: "Tier progression", what: "Milestone evidenced → tier bar advances", eprocess: "SOP-LII-01" },
  ],
};
