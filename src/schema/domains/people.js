// CW-SPB-PEOPLE — People & Culture. Owner: MD.
// Tagline: Building the practitioners the sector will need.
//
// SHELL BY DESIGN: this domain is completed at the Zone 08 finale, where every
// JD and KPI combines — the rating system is built LAST. The lists below are
// the shell the finale fills; the Needs Ledger is the deposit box the other
// zones pay into until then.

import { text, multiline, boolean, choice, dateTime, person } from "../../columns.js";

export const PEOPLE = {
  key: "people",
  code: "CW-SPB-PEOPLE",
  shell: true, // completed at the Z08 finale — do not build the rating system before it
  site: {
    name: "CauseWay · People & Culture",
    tagline: "Building the practitioners the sector will need",
    type: "communication",
    hub: "CauseWay-OS",
    owner: "MD",
  },
  libraries: [
    { name: "Pathway TORs", purpose: "F1–F6 + N1–N4 (from PPL-200)", kind: "documentLibrary",
      metadata: [text("Track"), text("Version")] },
    { name: "Applicant Records", purpose: "Applications + rubric scores", kind: "documentLibrary", restricted: true,
      metadata: [text("Ref"), text("Pathway"), text("Stage")] },
    { name: "Staff Files", purpose: "Per-person (restricted)", kind: "documentLibrary", restricted: true, docSet: true,
      metadata: [text("Position"), dateTime("Start"), text("Reviews")] },
    { name: "Policy Set", purpose: "People & Culture policies", kind: "documentLibrary",
      metadata: [text("Policy"), text("Version")] }, // [Z08 finale]
  ],
  lists: [
    {
      displayName: "Applications",
      purpose: "EPR + FRM-WEB-3 landing",
      columns: [
        text("Ref", { required: true }),
        text("Pathway"),                            // F1–F6 / N1–N4
        text("Name", { required: true }),
        text("Stage"),
        dateTime("Promise clock"),                  // the 2/5-day promise
      ],
      views: [{ title: "Foundry board", fields: ["Ref", "Pathway", "Name", "Stage", "Promise clock"] }],
    },
    {
      displayName: "Rubric Scores",
      purpose: "Exercise scoring",
      columns: [
        text("Applicant", { required: true }),
        text("Axis scores"),                        // per-axis; combined at Z08 finale
        choice("Recommendation", ["Advance", "Hold", "Decline"]),
      ],
      views: [{ title: "By pathway", fields: ["Applicant", "Axis scores", "Recommendation"] }],
    },
    {
      displayName: "Performance Cycle",
      purpose: "EPR-11",
      columns: [
        person("Staff", { required: true }),
        text("Cycle"),                              // e.g. 2026-H2
        multiline("Self", { lines: 3 }),
        multiline("Manager", { lines: 3 }),
        multiline("Calibration", { lines: 2 }),
        boolean("Signed", { defaultValue: false }), // MD sign closes the cycle
      ],
      views: [{ title: "On-time reviews", fields: ["Staff", "Cycle", "Signed"] }],
    },
    {
      displayName: "Needs Ledger",
      purpose: "Roles the zones ask for [Z08 finale input]",
      columns: [
        text("From zone", { required: true }),
        text("Role", { required: true }),
        multiline("JD seed", { lines: 3 }),
        multiline("KPI seed", { lines: 3 }),
        text("Entrance"),                           // how the role enters (pathway/track)
      ],
      views: [{ title: "All deposits", fields: ["From zone", "Role", "JD seed", "KPI seed", "Entrance"] }],
    },
  ],
  permissions: [
    { group: "MD", level: "Full control", note: "Sequencing authority" },
    { group: "Foundry lead", level: "Contribute", note: "Pipeline" },
    { group: "Managers", level: "Contribute (own team files)", note: "Reviews" },
    // Note from the workbook, preserved: Z08 FINALE — rating system built last.
  ],
  flows: [
    { name: "Application intake", what: "FRM-WEB-3 → screen → 2/5-day promise clock", eprocess: "EPR-11 pre" },
    { name: "Review cycle", what: "Calendar → self → manager → calibration → MD sign", eprocess: "EPR-11" },
    { name: "JD combination", what: "[Z08 FINALE: every Needs-Ledger deposit → rating system]", eprocess: "finale" },
  ],
};
