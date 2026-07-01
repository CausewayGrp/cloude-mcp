# Pending — what this package does NOT yet build, and why

This layer provisions the **list data model** for §5–§9 (11 lists, 90 columns,
15 views, 12 reference seed rows) — the part that is fully specified in
CW-PROMPT-SP-001 v2.0 itself and needs no external file. The items below are
deliberately deferred, each for a concrete reason.

## 1. Waiting on the document bundle (workbook + HTML + build spec)

The build prompt says: *do not invent business content — extract it.* These need
the firm's own files, which are being shared as a zip / drive link:

- **v1.0 lists' full column sets** — Live Pipeline, Service Architecture,
  Regulatory Radar, Stakeholder Dossier, Sira Commitments, Risk Register, KPI
  Tracker, Positions & Roster, Lifecycle Instances. This package *references*
  four of them via lookups but does not define their columns.
- **Positions & Roster augmentation** — §7.1 asks for `Trigger Condition` +
  `Trigger Status` on every *position* record (this package adds them to
  Recruitment Pipeline, per §7.2; the Positions & Roster change belongs with the
  v1.0 list definition).
- **Performance Scorecard band thresholds** — §7.4 says reproduce the firm's own
  Excel averaging/banding. The Overall Rating formula here uses faithful default
  cut-points for the 1–4 scale; the exact thresholds come from the workbook.
- **Exact salary bands** — the Grades list carries the six grades and the pay
  principles verbatim; the USD-equivalent band figures live in the salary-scale
  workbook.
- **Chart of Accounts full five-digit codes** — this package seeds the six
  classes (the structure §8.1 gives); the full account list is the firm's real CoA.

## 2. Not reachable via Microsoft Graph (needs Power Automate / admin)

Per the session decision ("attempt Graph, document the true gaps"):

- **The §9 alarm layer** — seven flows. Specified in `docs/ALARMS.md`.
- **Content Calendar outbound posting** (§6.2) — LinkedIn/X connector flows,
  plus the Review-Gates stage-gate that blocks Status → Approved.
- **Intelligence Feed ingestion** (§5) — RSS triggers, the `intelligence@`
  mailbox parser, and the scheduled diff-polls (CBY-Aden daily → auto-draft
  Decree is the highest-value one).
- **Weekly Check-in reminders** (§7.3) — Monday/Friday Teams-card prompts.
- **Dynamic cross-list values** (§4 mechanism 2/3) — e.g. Engagement
  Profitability's Direct Costs = Σ Class-5 Expense Claims; monthly/quarterly KPI
  rollups. The *calculated* same-item fields (§4 mechanism 1) ARE provisioned
  here (Gross Margin, Margin %, Overall Rating).

## 3. Tenant configuration (portable Graph can't set these)

- **Purview sensitivity labels** — each list here records its D1–D4 tier
  (see `src/sensitivity.js`); applying the actual Purview label requires the
  tenant's label GUIDs and is an admin step. D1: Recruitment Pipeline,
  Performance Scorecard, Engagement Profitability, Cash Position. Content
  Calendar flips D2→D3 on publish.
- **Per-role landing pages & audience targeting** (§11).
- **Site/spoke creation & hub association** (§2) — this package assumes the hub
  and the twelve spokes exist and provisions lists into them by `spoke` name.

## 4. Explicitly parked by the spec (§13 Phase 9+)

Social sentiment/mentions monitoring; AI Builder document classification beyond
Purview auto-labeling; Power BI analytics beyond the basic dashboard pages.
