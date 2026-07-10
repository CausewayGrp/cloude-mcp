// CW-SPB-TECH — Technology domain. Owner: Technology Director.
// "The SharePoint that runs the firm's digital estate: the website source of
// truth, the backend build artifacts, the credential and incident registers,
// and the deploy pipeline."

import { text, multiline, number, currency, choice, dateTime, person } from "../../columns.js";
import { SEVERITY, STATUS } from "../coding.js";

export const TECH = {
  key: "tech",
  code: "CW-SPB-TECH",
  site: {
    name: "CauseWay · Technology",
    tagline: "Clarity in complexity",
    type: "communication",
    hub: "CauseWay-OS",
    owner: "Technology Director",
  },
  libraries: [
    { name: "Website Source", purpose: "The 25-page site + COPY_BOOK as the canonical source", kind: "documentLibrary",
      metadata: [text("Version"), choice("Status", STATUS), dateTime("Last published"), person("Editor")] },
    { name: "Backend Masters", purpose: "WEB-004/005, FRM-100, schema, handover", kind: "documentLibrary",
      metadata: [text("Version"), person("Owner"), choice("D-class", ["D0", "D1", "D2", "D3"])] },
    { name: "Deploy Artifacts", purpose: "Build scripts, env templates, acceptance", kind: "documentLibrary",
      metadata: [text("Stage"), choice("Status", STATUS)] },
    { name: "Design Assets", purpose: "Logo kit, tokens, brand exports", kind: "documentLibrary",
      metadata: [text("Format"), text("Usage")] },
  ],
  lists: [
    {
      displayName: "TEC-100 Budget",
      purpose: "Tech spend tracking",
      columns: [
        text("Line", { required: true }),
        text("Vendor"),
        currency("Amount"),            // [PLACEHOLDER] — seeded later
        choice("Status", STATUS),
      ],
      views: [{ title: "By status", groupBy: "Status" }],
    },
    {
      displayName: "TEC-101 Credentials",
      purpose: "Secrets inventory (references, not values)",
      columns: [
        text("System", { required: true }),
        person("Owner"),
        dateTime("Rotation due"),
        choice("Status", STATUS),
      ],
      views: [{ title: "Rotation due", fields: ["System", "Owner", "Rotation due", "Status"],
        query: "<OrderBy><FieldRef Name='Rotation_x0020_due' Ascending='TRUE'/></OrderBy>" }],
    },
    {
      displayName: "EPR-08 IT Requests",
      purpose: "Service desk",
      columns: [
        choice("Severity", SEVERITY, { required: true }),
        multiline("What", { lines: 3 }),
        text("Asset"),
        choice("Status", STATUS, { defaultValue: "OPEN" }),
        multiline("Fix note", { lines: 2 }),
      ],
      views: [{ title: "Open by severity", fields: ["Severity", "What", "Asset", "Status"],
        query: "<Where><Eq><FieldRef Name='Status'/><Value Type='Choice'>OPEN</Value></Eq></Where>" +
               "<OrderBy><FieldRef Name='Severity' Ascending='TRUE'/></OrderBy>" }],
    },
    {
      displayName: "EPR-14 Site Changes",
      purpose: "Publish lane",
      columns: [
        multiline("Request", { lines: 2, required: true }),
        person("CD approved"),
        dateTime("Built"),
        dateTime("Published"),
      ],
      views: [{ title: "Publish queue", fields: ["Request", "CD approved", "Built", "Published"],
        query: "<Where><IsNull><FieldRef Name='Published'/></IsNull></Where>" }],
    },
    {
      displayName: "Incident Log",
      purpose: "Tech incidents",
      columns: [
        dateTime("Date", { required: true }),
        choice("Severity", SEVERITY, { required: true }),
        multiline("Description", { lines: 3 }),
        multiline("Resolution", { lines: 2 }),
      ],
      views: [{ title: "Last 30 days", fields: ["Date", "Severity", "Description", "Resolution"],
        query: "<Where><Geq><FieldRef Name='Date'/><Value Type='DateTime'><Today OffsetDays='-30'/></Value></Geq></Where>" +
               "<OrderBy><FieldRef Name='Date' Ascending='FALSE'/></OrderBy>" }],
    },
  ],
  permissions: [
    { group: "Technology Director", level: "Full control", note: "Owns the site" },
    { group: "Developer", level: "Contribute", note: "Builds" },
    { group: "Editor", level: "Contribute (Website Source)", note: "Publishes" },
    { group: "COO", level: "Read + approve", note: "Gates deploy" },
  ],
  flows: [
    { name: "Publish approval", what: "Site change → CD approves → Editor publishes → log", eprocess: "EPR-14" },
    { name: "Credential rotation reminder", what: "Rotation-due date → notify Tech Director", eprocess: "TEC-101" },
    { name: "Incident alert", what: "New sealed-severity incident → Teams to COO", eprocess: "Incident Log" },
  ],
};
