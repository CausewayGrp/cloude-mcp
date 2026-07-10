// CW-SPB-CONTENT — Content & Social Media. Owner: Creative Director.
// Tagline: From intent to delivery.
// AR-post rule (POL-LANG-01): AR posts are native-separate, never same-post
// bilingual.

import { text, multiline, boolean, choice, dateTime, person } from "../../columns.js";

export const CONTENT = {
  key: "content",
  code: "CW-SPB-CONTENT",
  site: {
    name: "CauseWay · Content & Social Media",
    tagline: "From intent to delivery",
    type: "communication",
    hub: "CauseWay-OS",
    owner: "Creative Director",
  },
  libraries: [
    { name: "Post Library", purpose: "Every post, coded, with its asset", kind: "documentLibrary",
      metadata: [choice("Platform", ["LinkedIn", "X", "Instagram"]), text("Peg"), dateTime("Date"),
                 choice("D-class", ["D0", "D1", "D2", "D3"]), text("Status")] },
    { name: "The Papers", purpose: "EN + native-AR originals", kind: "documentLibrary",
      metadata: [text("Paper"), choice("Language", ["EN", "AR"]), text("Status")] },
    { name: "Franchise Pipeline", purpose: "From the Collection, Dated Line, etc.", kind: "documentLibrary", docSet: true,
      metadata: [text("Series"), dateTime("Next date"), person("Owner")] },
    { name: "Brand Assets", purpose: "Logo kit, covers, templates", kind: "documentLibrary",
      metadata: [text("Asset"), text("Format"), text("Usage")] },
  ],
  lists: [
    {
      displayName: "Content Calendar",
      purpose: "EPR-16 scheduling",
      columns: [
        text("Post", { required: true }),
        choice("Platform", ["LinkedIn", "X", "Instagram"], { required: true }),
        dateTime("Date"),
        multiline("Message", { lines: 4 }),
        person("CD approved"),
        choice("Status", ["Draft", "In Review", "Approved", "Scheduled", "Published"], { defaultValue: "Draft" }),
      ],
      views: [
        { title: "Calendar view", fields: ["Post", "Platform", "Date", "Status"],
          query: "<OrderBy><FieldRef Name='Date' Ascending='TRUE'/></OrderBy>" },
        { title: "Pipeline by status", groupBy: "Status" },
      ],
    },
    {
      displayName: "Campaign Requests",
      purpose: "EPR-13",
      columns: [
        text("Campaign", { required: true }),
        text("Audience"),
        person("CD approved"),
        person("MD approved"),                     // MD gates public campaigns (D2+)
        choice("Status", ["OPEN", "IN-PROGRESS", "WAITING", "RESOLVED", "CLOSED", "REJECTED"], { defaultValue: "OPEN" }),
      ],
      views: [{ title: "By status", groupBy: "Status" }],
    },
    {
      displayName: "Website Requests",
      purpose: "EPR-14",
      columns: [
        text("Page", { required: true }),
        multiline("Change", { lines: 3 }),
        person("CD"),
        dateTime("Built"),
        dateTime("Published"),
      ],
      views: [{ title: "Publish queue", fields: ["Page", "Change", "CD", "Built", "Published"],
        query: "<Where><IsNull><FieldRef Name='Published'/></IsNull></Where>" }],
    },
    {
      displayName: "Asset Requests",
      purpose: "EPR-15",
      columns: [
        text("Asset", { required: true }),
        person("Requester"),
        person("CD"),
        dateTime("Delivered"),
      ],
      views: [{ title: "Open", fields: ["Asset", "Requester", "CD", "Delivered"],
        query: "<Where><IsNull><FieldRef Name='Delivered'/></IsNull></Where>" }],
    },
  ],
  permissions: [
    { group: "Creative Director", level: "Full control", note: "Owns the voice" },
    { group: "Social Operator", level: "Contribute", note: "Schedules" },
    { group: "Editor", level: "Contribute (Papers)", note: "Publishes" },
    { group: "MD", level: "Approve (public campaigns)", note: "D2+ gate" },
  ],
  flows: [
    { name: "Post scheduling", what: "Draft → CD approves → scheduled → posted", eprocess: "EPR-16" },
    { name: "AR-post rule", what: "AR posts flagged native-separate (never same-post bilingual)", eprocess: "POL-LANG-01" },
    { name: "Franchise cadence", what: "Series next-date → remind owner", eprocess: "SOP-BRD-01" },
  ],
};
