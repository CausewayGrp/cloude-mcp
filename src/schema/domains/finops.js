// CW-SPB-FINOPS — Finance & Operations. Owners: CFO (The Vault) + COO (The Bridge).
// "The Vault and the Bridge in SharePoint: all 22 eProcesses as lists, the
// pricing engine, the approval and settlement records, and the SLA board that
// turns promises into a dashboard."
// Tagline: The number you sign is the number you pay.

import { text, multiline, number, currency, boolean, choice, dateTime, person } from "../../columns.js";
import { STATUS, ENGAGEMENT_STAGE } from "../coding.js";

export const FINOPS = {
  key: "finops",
  code: "CW-SPB-FINOPS",
  site: {
    name: "CauseWay · Finance & Operations",
    tagline: "The number you sign is the number you pay",
    type: "communication",
    hub: "CauseWay-OS",
    owner: "CFO + COO",
  },
  libraries: [
    { name: "Pricing & Proposals", purpose: "FIN-100 + proposals (placeholder pricing)", kind: "documentLibrary", restricted: true,
      metadata: [text("Service"), text("Client"), text("Version"), choice("D-class", ["D0", "D1", "D2", "D3"])] },
    { name: "Financial Records", purpose: "Invoices, credit notes, settlements", kind: "documentLibrary", restricted: true,
      metadata: [text("Type"), text("Counterpart"), dateTime("Date"), choice("Status", STATUS)] },
    { name: "Operations Manuals", purpose: "EPR-100, OPS-100, SOPs", kind: "documentLibrary",
      metadata: [text("Doc"), text("Version"), person("Owner")] },
    { name: "Vendor Records", purpose: "Local-first procurement proof", kind: "documentLibrary",
      metadata: [text("Vendor"), text("Category"), boolean("Local"), dateTime("Date")] },
  ],
  lists: [
    {
      displayName: "EPR-01 Leave",
      purpose: "Leave requests",
      columns: [
        choice("Type", ["Annual", "Sick", "Unpaid", "Compassionate", "Other"], { required: true }),
        dateTime("From", { required: true }),
        dateTime("To", { required: true }),
        number("Days", { min: 0.5, decimals: 1 }),
        person("Coverage"),
        person("Approver"),
        choice("Status", STATUS, { defaultValue: "OPEN" }),
      ],
      views: [{ title: "Team calendar", fields: ["Type", "From", "To", "Days", "Coverage", "Status"] }],
    },
    {
      displayName: "EPR-02 Advances",
      purpose: "Payment requests",
      columns: [
        multiline("Purpose", { lines: 2, required: true }),
        currency("Amount"),              // [PH] — seeded later
        text("Engagement code"),         // ENG-YYYY-nnn
        dateTime("Settle by"),
        choice("Status", STATUS, { defaultValue: "OPEN" }),
      ],
      views: [{ title: "Overdue settle", fields: ["Purpose", "Amount", "Engagement code", "Settle by", "Status"],
        query: "<Where><And><Lt><FieldRef Name='Settle_x0020_by'/><Value Type='DateTime'><Today/></Value></Lt>" +
               "<Neq><FieldRef Name='Status'/><Value Type='Choice'>CLOSED</Value></Neq></And></Where>" }],
    },
    {
      displayName: "EPR-05 Procurement",
      purpose: "Purchase requests",
      columns: [
        text("Item", { required: true }),
        currency("Estimate"),            // [PH]
        number("Quotes", { min: 0, decimals: 0 }),
        boolean("Local first", { defaultValue: true }),
        choice("Status", STATUS, { defaultValue: "OPEN" }),
      ],
      views: [{ title: "By status", groupBy: "Status" }],
    },
    {
      // Confidential — 2-person visibility. Provisioner breaks inheritance:
      // MD + COO only (see permissions below).
      displayName: "EPR-09 Incidents (Sealed)",
      purpose: "Confidential — 2-person",
      sealed: true,
      columns: [
        text("Route", { required: true }),
        multiline("Narrative", { lines: 6 }),
        text("Contact preference"),
        choice("Status", STATUS, { defaultValue: "OPEN" }),
      ],
      views: [{ title: "MD-COO only", fields: ["Route", "Status"] }],
    },
    {
      displayName: "The Bridge Board",
      purpose: "SLA + engagement master",
      columns: [
        text("Engagement", { required: true }),  // ENG-YYYY-nnn
        choice("SLA status", ["Green", "Amber", "Red"]),
        boolean("Green gate", { defaultValue: false }),
        person("Owner"),
        choice("Stage", ENGAGEMENT_STAGE),
      ],
      views: [{ title: "Live", fields: ["Engagement", "SLA status", "Green gate", "Owner", "Stage"],
        query: "<Where><Neq><FieldRef Name='Stage'/><Value Type='Choice'>CLOSE</Value></Neq></Where>" }],
    },
  ],
  permissions: [
    { group: "CFO — The Vault", level: "Full control (Finance)", note: "Rates, settlements" },
    { group: "COO — The Bridge", level: "Full control (Ops)", note: "SLA, gates" },
    { group: "Office Admin", level: "Contribute (petty)", note: "EPR-03/04" },
    { group: "EPR-09", level: "Broken inheritance", note: "2 people only" },
  ],
  flows: [
    { name: "Approval escalation", what: "SLA breach → reminder → +12h → next role → red card", eprocess: "SOP-FIN-02" },
    { name: "Spend thresholds", what: "$500→CFO, $2k→COO, >$2k→MD", eprocess: "EPR-05" },
    { name: "Settlement chase", what: "−3 days from promise → chase list", eprocess: "EPR-02" },
  ],
};
