# The CauseWay-OS estate — the absorbed map

The complete understanding this package is built from, source by source.
Authority order for the SharePoint build:

1. **CW-SPB-\*** — the seven domain build workbooks (site, libraries, lists with
   exact columns and views, permissions, flows, build steps). One per domain.
2. **CW-SP-REF-001** — the estate reference: the sixteen zones, the reusable
   request pattern built end-to-end (form → list → flow → dashboard, with
   AuditLog), position groups, the e-process board.
3. **CW-TEC-WFR-001** — workflows, forms and coding register: the eight coding
   schemes, the twelve tech workflows, forms to field depth, the commercial
   coding, the screening gate.
4. **CW-PROG-001 (The Foundry)** — programme command: the sixteen-zone target
   architecture, the eight-session plan, the 8-hour induction, "shape first,
   finalization next, the induction last."
5. **CW-PROMPT-SP-001 v2.0** — the additive layer (intelligence feed, alarm
   layer, HR spine, finance interface), reconciled in `src/schema/v2.js`.
6. **The House Stationery** (branding upgrade) — the surface law: one paper,
   one green, one seal. See BRANDING.md.

## The shape

**One hub — CauseWay-OS** ("The operating system of the firm") holding the
sixteen zones as document libraries, each with the same five-folder interior,
plus the firm-level lists (Screening Gate, Intelligence Feed, Alarm Log).

**Seven domain sites**, hub-associated, built in this order (the README's law:
Tech first for infrastructure, Finance/Ops as the spine, then the delivery
floors, Content, and People last at the finale):

| # | Site | Tagline | Owner |
|---|---|---|---|
| 1 | CauseWay · Technology | Clarity in complexity | Technology Director |
| 2 | CauseWay · Finance & Operations | The number you sign is the number you pay | CFO + COO |
| 3 | CauseWay · Line I — State & Development | Counsel at the level of the state | Line I Principal |
| 4 | CauseWay · Line II — Banking & Regulation | Where regulation, risk, and reality meet | Line II Principal |
| 5 | CauseWay · Partnerships & Expert Network | The bench behind the bridge | Partnerships |
| 6 | CauseWay · Content & Social Media | From intent to delivery | Creative Director |
| 7 | CauseWay · People & Culture | Building the practitioners the sector will need | MD |

## The sixteen zones (hub libraries)

Foundation: 00 Canon & Operating System · 01 Strategy & Core · 02 Intelligence
& Evidence. Offer: 03 The Business Lines · 04 Commercial Architecture · 05
Profile & Identity. Presence: 06 Voice & Content · 07 Public Launch & Social ·
08 Technology & Digital · 09 The Aden Convening. Operate: 10 People & Culture ·
11 Firm Operations · **12 Finance & Administration [D1]** · **13 Governance,
Risk & Compliance [D1]** · 14 Registrations & Partnerships · 15 Quality &
Review.

Zones 12 and 13 are D1 — MD/COO only. Confidential zones are **never granted
through the onboarding form**, by rule.

## The laws the build obeys

- **Permission follows position, never person** (POL-GOV-03). Groups are
  positions; the provisioner creates the groups, the tenant admin manages
  membership.
- **Everything is coded so it automates.** Eight schemes, one vocabulary:
  workflows WF-TEC-01…12, forms FRM-01…12, severity P1–P4, status
  OPEN→…→REJECTED, category (JML/ACCESS/…), RBAC D0–D3+REQ, access tiers,
  zones. Commercial life carries the same discipline: lines L1/L2/L3/H/EN,
  tiers T1–T4, client types CT-xx, engagements ENG-YYYY-nnn, stages
  LEAD→SCREEN→SCOPE→ESCROW→DELIVER→REVIEW→CLOSE (SCREEN and ESCROW are gates,
  not stages), screening outcomes SCR-CLEAR/REVIEW/DECLINE.
- **A form is a data contract, not a document.** Fields are typed, required
  flags set, and RBAC read strictly — a D0 field (a privacy request's subject
  name) is never seen operationally.
- **Nothing advances silently.** Every workflow step updates the row, appends
  to the immutable AuditLog, and notifies the next holder.
- **The screening gate sits before the sale.** SCR-DECLINE is terminal and
  synchronous, routed to the MD on every channel.
- **English primary; Arabic native** (POL-LANG-01) — AR content is
  native-separate, never machine-mixed in one surface.
- **People & Culture is a SHELL by design** — completed at the Zone 08 finale
  where every JD and KPI combines; the rating system is built last. The
  provisioner honours this: the v2 HR spine is deferred behind
  `--include-finale`.
- **Lists are the databases the dashboards read** (CW-EPR-200, the Process
  Atlas). No dashboard number is manually maintained.

## Deliberately surfaced drifts (do not resolve silently)

- The canon says **forty-eight** workflows; the e-process board enumerates
  **forty-nine** (5+8+11+9+4+6+4+2). The estate reference surfaces this
  one-row drift to be settled in the compendium — preserved here unresolved.
- The tech register's zone scheme says "00…17 — the same eighteen the intranet
  shows"; the estate reference provisions **sixteen** zones. The estate
  reference is the newer SharePoint authority and is followed; the drift is
  noted.
- The Foundry orders the sixteen zones slightly differently (Archive as Zone
  15) from the estate reference (Quality & Review as 15). The estate reference
  wins for the build.

## Build steps per domain (workbook tab 06 — identical across domains)

1. Create the site (communication site; associate to CauseWay-OS hub; theme +
   accent) → 2. Build libraries with metadata columns → 3. Build lists with
   exact columns and default views → 4. Set permissions (groups; break
   inheritance only where marked) → 5. Home page (purpose, quick links, domain
   dashboard) → 6. Automations (flows named for eProcesses; test with one
   record) → 7. Seed & test → 8. Dashboard (reads the lists; pinned to home) →
   9. Sign-off (COO confirms against the workbook; mark live in CW-PLN-100).

Roughly half a day per domain for someone with SharePoint admin. This package
automates steps 2–4 and the theme of step 1; steps 5–9 are documented for the
admin (see PENDING.md).
