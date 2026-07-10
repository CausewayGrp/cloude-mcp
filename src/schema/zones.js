// The sixteen zones — CW-SP-REF-001 site map, "the target the tech team
// provisions." Each zone is a document library on the hub with the same
// five-folder interior standard. Zones 12 and 13 are D1 (MD/COO only).
//
// The Foundry programme (CW-PROG-001) orders the same sixteen zones with an
// Archive zone; the estate reference is the SharePoint-specific authority and
// is followed here. Where the two drift, the estate reference wins for the
// build and the drift is noted, not hidden — the same discipline the estate
// applies to its own 48-vs-49 workflow count.

export const FIVE_FOLDER_INTERIOR = [
  "01 · Doctrine & Policies",
  "02 · Working Files",
  "03 · Directory & Records",
  "04 · Templates & Forms",
  "05 · Archive",
];

export const ZONES = [
  // Foundation
  { code: "00", name: "Canon & Operating System", phase: "Foundation", dClass: "D2", holds: "The map, the doctrine, brand & naming law, classification model" },
  { code: "01", name: "Strategy & Core", phase: "Foundation", dClass: "D2", holds: "Vision, business plan, the Visual Atlas, positioning" },
  { code: "02", name: "Intelligence & Evidence", phase: "Foundation", dClass: "D2", holds: "The Aden Ledger, economic reference, briefings" },
  // Offer
  { code: "03", name: "The Business Lines", phase: "Offer", dClass: "D2", holds: "Line I–III doctrine, decks & JDs, Expert Network" },
  { code: "04", name: "Commercial Architecture", phase: "Offer", dClass: "D2", holds: "Pricing engine, packages, envelopes, proposals" },
  { code: "05", name: "Profile & Identity", phase: "Offer", dClass: "D2", holds: "Capability statements, profiles, credentials, the dossier" },
  // Presence
  { code: "06", name: "Voice & Content", phase: "Presence", dClass: "D2", holds: "Articles, explainers, language standard, editorial" },
  { code: "07", name: "Public Launch & Social", phase: "Presence", dClass: "D2", holds: "Social kit, launch plan, channels" },
  { code: "08", name: "Technology & Digital", phase: "Presence", dClass: "D2", holds: "This estate, website & portal, registers, workflows" },
  { code: "09", name: "The Aden Convening", phase: "Presence", dClass: "D2", holds: "Programme, invitees, the record — 21–22 July" },
  // Operate
  { code: "10", name: "People & Culture", phase: "Operate", dClass: "D2", holds: "Onboarding (JML), induction, policies, grievance channel" },
  { code: "11", name: "Firm Operations", phase: "Operate", dClass: "D2", holds: "Calendar, SLA, vendors, procurement, the Monday review" },
  { code: "12", name: "Finance & Administration", phase: "Operate", dClass: "D1", holds: "Model, invoicing, budgets — MD/COO only" },
  { code: "13", name: "Governance, Risk & Compliance", phase: "Operate", dClass: "D1", holds: "Risk register, compliance, KYC — MD/COO only" },
  { code: "14", name: "Registrations & Partnerships", phase: "Operate", dClass: "D2", holds: "Legal registration, MoUs, partners" },
  { code: "15", name: "Quality & Review", phase: "Operate", dClass: "D2", holds: "Seen-before-sent, finalisation register, review log" },
];

// The e-process board beneath every zone — one reusable flow, instantiated per
// row. The canon names these the forty-eight workflows; the enumeration sums to
// forty-nine. A one-row drift, surfaced rather than hidden, to settle in the
// compendium before the flows are cloned.
export const EPROCESS_DOMAINS = [
  { code: "EG", name: "Engagement", count: 5, scope: "Intake → clearance → delivery" },
  { code: "GR", name: "Governance & Risk", count: 8, scope: "KYC, incidents, compliance" },
  { code: "HR", name: "People", count: 11, scope: "Onboarding, leave, grievance" },
  { code: "OF", name: "Operations", count: 9, scope: "Procurement, vendors, budget" },
  { code: "EV", name: "Events", count: 4, scope: "The Convening machinery" },
  { code: "MK", name: "Marketing", count: 6, scope: "Content, social, releases" },
  { code: "IT", name: "Technology", count: 4, scope: "Access, change, help desk" },
  { code: "KI", name: "Knowledge", count: 2, scope: "Publishing, the record" },
];
