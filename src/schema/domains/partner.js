// CW-SPB-PARTNER — Partnerships & Expert Network. Owner: Partnerships.
// Tagline: The bench behind the bridge.

import { text, multiline, number, boolean, choice, dateTime, person } from "../../columns.js";

export const PARTNER = {
  key: "partner",
  code: "CW-SPB-PARTNER",
  site: {
    name: "CauseWay · Partnerships & Expert Network",
    tagline: "The bench behind the bridge",
    type: "communication",
    hub: "CauseWay-OS",
    owner: "Partnerships",
  },
  libraries: [
    { name: "Expert Profiles", purpose: "One record per bench member", kind: "documentLibrary", docSet: true,
      metadata: [text("Code"), text("Cluster"), text("Tier"), text("Status")] },
    { name: "Vetting Records", purpose: "References, screening, conflict checks", kind: "documentLibrary", restricted: true,
      metadata: [text("Expert"), text("Check type"), dateTime("Date"), text("Outcome")] },
    { name: "Signed Documents", purpose: "NDA, conduct, neutrality, data (EN/AR)", kind: "documentLibrary", restricted: true,
      metadata: [text("Expert"), text("Doc"), dateTime("Signed date")] },
    { name: "Bench Deliverables QA", purpose: "Four-gate scored outputs", kind: "documentLibrary",
      metadata: [text("Output"), text("Gate scores"), text("Sign-off")] },
  ],
  lists: [
    {
      displayName: "Expert Register",
      purpose: "The bench, by code",
      columns: [
        text("Name", { required: true }),
        text("Cluster"),
        text("Codes"),                            // specialisation codes
        text("Tier"),                             // Tier 0/1 approved by MD/CEO
        choice("Screen status", ["SCR-CLEAR", "SCR-REVIEW", "SCR-DECLINE", "Pending"], { defaultValue: "Pending" }),
        text("Coverage"),
      ],
      views: [{ title: "By cluster", groupBy: "Cluster" }],
    },
    {
      displayName: "Intake Pipeline",
      purpose: "12-step lifecycle tracker",
      columns: [
        text("Applicant", { required: true }),
        number("Step", { min: 1, max: 12, decimals: 0 }),
        number("Score", { min: 0, decimals: 1 }),
        person("Routed to"),
        choice("Status", ["OPEN", "IN-PROGRESS", "WAITING", "RESOLVED", "CLOSED", "REJECTED"], { defaultValue: "OPEN" }),
      ],
      views: [{ title: "By step", groupBy: "Step" }],
    },
    {
      displayName: "Coverage Map",
      purpose: "Specialisation gaps",
      columns: [
        text("Code", { required: true }),         // specialisation code
        number("Experts count", { min: 0, decimals: 0 }),
        dateTime("Last used"),
        boolean("Gap flag", { defaultValue: false }),
      ],
      views: [{ title: "Gaps first", fields: ["Code", "Experts count", "Last used", "Gap flag"],
        query: "<OrderBy><FieldRef Name='Gap_x0020_flag' Ascending='FALSE'/></OrderBy>" }],
    },
    {
      displayName: "QA Scores",
      purpose: "Deliverable four-gate log",
      columns: [
        text("Output", { required: true }),
        number("Evidence", { min: 0, max: 10, decimals: 0 }),
        number("Analytical", { min: 0, max: 10, decimals: 0 }),
        number("Editorial", { min: 0, max: 10, decimals: 0 }),
        number("Brand", { min: 0, max: 10, decimals: 0 }),
        person("Signed"),
      ],
      views: [{ title: "Pending sign-off", fields: ["Output", "Evidence", "Analytical", "Editorial", "Brand"],
        query: "<Where><IsNull><FieldRef Name='Signed'/></IsNull></Where>" }],
    },
  ],
  permissions: [
    { group: "Partnerships", level: "Full control", note: "Sourcing & register" },
    { group: "COO", level: "Read + approve QA", note: "Sign-off" },
    { group: "Compliance", level: "Contribute (Vetting)", note: "Screening" },
    { group: "MD/CEO", level: "Approve Tier 0/1", note: "Authority" },
  ],
  flows: [
    { name: "Expert intake", what: "Cascade → auto-screen → route by score", eprocess: "SOP-EN-01" },
    { name: "Coverage alert", what: "Specialisation gap → Marketing trigger", eprocess: "Bench board R6" },
    { name: "QA gate", what: "Deliverable → four gates scored → COO sign-off", eprocess: "SOP-EN-02" },
  ],
};
