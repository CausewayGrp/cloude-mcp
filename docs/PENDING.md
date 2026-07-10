# Pending — what stays manual or deferred, and why

The provisioner automates the estate's data layer end-to-end: zone libraries
and interiors, domain libraries with metadata, every list with exact columns,
named views, reference seeds, position groups with base grants, sealed lists,
and the house theme. The rest, honestly:

## 1. Tenant-admin steps (not portably automatable)

- **Site creation & hub association** — creating communication sites and
  registering/associating the CauseWay-OS hub uses the SPO admin surface, not
  portable Graph. Create the hub + seven sites once, then feed their IDs to the
  provisioner (`CW_SITE_ID`, `CW_SITE_TECH`, `CW_SITE_FINOPS`, `CW_SITE_LINE1`,
  `CW_SITE_LINE2`, `CW_SITE_PARTNER`, `CW_SITE_CONTENT`, `CW_SITE_PEOPLE`).
- **Home pages & dashboards** (build steps 5 and 8) — purpose text, quick
  links, the domain dashboard web parts pinned to home.
- **Doc-set content types** — libraries marked `docSet: true` (Programme
  Workspaces, Tier Law Dossiers, CBDDQ Workroom, Expert Profiles, Staff Files,
  Franchise Pipeline) provision as document libraries; enabling the Document
  Set content type is a site-collection feature toggle.
- **Group membership** — the provisioner creates position groups; the admin
  puts people in them (permission follows position; persons change, positions
  don't).
- **Client-seat RLS** — "Read (their workspace only) / own dossier" is
  per-item/folder security by institution, applied per engagement.
- **Purview sensitivity labels** — D0–D3 tiers are recorded on every list and
  zone; label GUIDs are tenant-specific.
- **AuditLog immutability** — the provisioner creates the list; the admin
  restricts the flow service account to Add-only (no Edit/Delete role) so the
  append-only guarantee holds at the platform level.
- **Per-domain header accents** — page-level styling on each domain's headers;
  the base theme is applied automatically.

## 2. Power Automate (specified, not created)

Every flow in `docs/FLOWS.md`: 21 domain flows (3 × 7 workbooks), the reusable
request flow and its twelve WF-TEC clones, the screening gate, the v2 alarm
layer (`docs/ALARMS.md`). Flow names = eProcess codes, always.

## 3. Deferred by the firm's own sequencing

- **The Z08 finale** — People & Culture is a SHELL by design; the rating
  system is built last, when every JD and KPI combines. The v2 HR spine
  (Grades, Recruitment Pipeline, Weekly Check-in, Performance Scorecard) is
  schema-complete and unlocks with `--include-finale` when the MD calls it.
- **Placeholder values** — columns the workbooks mark `[PH]`/`[PLACEHOLDER]`
  (budget amounts, estimates) are seeded later by their owners.
- **The 48-vs-49 workflow drift** — deliberately left open per the estate
  reference, to settle in the compendium.

## 4. Explicitly parked (v2.0 §13, unchanged)

Social sentiment/mentions monitoring; AI Builder classification beyond Purview
auto-labeling; Power BI beyond the basic dashboard pages.
