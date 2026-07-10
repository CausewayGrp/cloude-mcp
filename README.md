# CauseWay-OS estate provisioner (`cloude-mcp`)

The CauseWay SharePoint estate as code: **one hub, seven domain sites, sixteen
zones, the coding scheme, the workflow spine, and the house branding** — all
extracted verbatim from the firm's own build workbooks and provisioned
idempotently through Microsoft Graph + SharePoint REST.

Companion repo: [mcp-sharepoint](https://github.com/matrix712/mcp-sharepoint)
(the generic list/column/view/item MCP tooling). This package carries its own
thin Graph client so it also runs standalone.

## Sources (authority order)

1. `CW-SPB-{TECH,FINOPS,LINE1,LINE2,PARTNER,CONTENT,PEOPLE}` — the seven domain
   build workbooks: site, libraries with metadata, lists with exact columns and
   views, permissions by position, flows, build steps.
2. `CW-SP-REF-001` — the estate reference: sixteen zones, the reusable request
   pattern (form → list → flow → dashboard + append-only AuditLog).
3. `CW-TEC-WFR-001` — workflows, forms & coding register: eight coding schemes,
   twelve tech workflows, forms to field depth, the screening gate.
4. `CW-PROMPT-SP-001 v2.0` — the additive layer, reconciled (`src/schema/v2.js`).
5. **The House Stationery** branding upgrade — one paper, one green, one seal.

The full absorbed map is in [`docs/ESTATE.md`](docs/ESTATE.md).

## What it provisions

- **The hub (CauseWay-OS)** — 16 zone document libraries (zones 12 & 13 D1),
  each with the five-folder interior; the firm-level lists: Screening Gate,
  Intelligence Feed, Alarm Log.
- **Seven domain sites, in the workbooks' build order** — 30 libraries with
  metadata columns, 40 lists with exact columns and named views (44 at the
  finale), position groups with base grants, the sealed 2-person EPR-09 list.
- **The house theme** — "CauseWay House": malachite `#0A4A3A`, porcelain
  `#ECEEE4`, gold-foil accent `#C9A24B`, registered at tenant level and applied
  to every site ([`docs/BRANDING.md`](docs/BRANDING.md)).
- **The automation layer, specified** — every flow named for its eProcess:
  21 domain flows, the reusable request flow + 12 WF-TEC clones, the screening
  gate, the alarm layer ([`docs/FLOWS.md`](docs/FLOWS.md), [`docs/ALARMS.md`](docs/ALARMS.md)).

What stays manual (site creation, home pages, doc sets, Purview labels, group
membership, flows) is itemized honestly in [`docs/PENDING.md`](docs/PENDING.md).

## Usage

```bash
npm run validate            # static schema checks — no tenant, no network
npm run plan                # the full ordered estate plan — no tenant, no network
node bin/provision.js --dry-run --include-finale   # preview incl. the Z08-finale HR spine

# Apply (idempotent — safe to re-run any number of times):
CW_AUTH_MODE=application \
CW_TENANT_ID=... CW_CLIENT_ID=... CW_CLIENT_SECRET=... \
CW_SITE_ID=<hub site id> \
CW_SITE_TECH=... CW_SITE_FINOPS=... CW_SITE_LINE1=... CW_SITE_LINE2=... \
CW_SITE_PARTNER=... CW_SITE_CONTENT=... CW_SITE_PEOPLE=... \
CW_SP_ADMIN_HOST=<tenant>-admin.sharepoint.com \
npm run provision
```

Domains without a site ID are skipped with a warning — the estate builds in
stages, matching the workbooks' own order: tech → finops → line1 → line2 →
partner → content → people (last, at the finale).

## The laws the code obeys

- **Permission follows position, never person** — groups are positions.
- **Everything is coded so it automates** — the eight schemes and the
  commercial coding are `src/schema/coding.js`, used as choice columns as-is.
- **A form is a data contract** — `src/schema/workflows.js` carries the forms
  register to field depth, RBAC read strictly.
- **Nothing advances silently** — the request pattern appends to an immutable
  AuditLog on every transition.
- **People & Culture is a SHELL** — the rating system is built last; the HR
  spine unlocks only with `--include-finale`.
- **One green, one paper, one seal** — the theme is applied on every run;
  legacy palettes never touch new surfaces.

## Layout

```
src/branding/tokens.js     the house palette, identity constants, type, language law
src/branding/theme.js      "CauseWay House" Fluent theme + tenant/site application
src/schema/coding.js       the eight schemes + commercial coding (one vocabulary)
src/schema/zones.js        the sixteen zones + the e-process board
src/schema/workflows.js    WF-TEC-01..12, forms to field depth, request pattern, screening gate
src/schema/domains/        one module per CW-SPB workbook (seven)
src/schema/v2.js           CW-PROMPT-SP-001 v2.0 additions, reconciled (retired/deferred/routed)
src/schema/index.js        the estate, composed
src/graph.js               Graph + SharePoint REST client (lists, libraries, folders, views, groups, sealing)
src/provision.js           validate / dry-run / idempotent apply
bin/provision.js           CLI
docs/ESTATE.md             the absorbed map + the laws + surfaced drifts
docs/FLOWS.md              every flow, buildable spec
docs/BRANDING.md           the branding enforcement law
docs/ALARMS.md             the v2.0 alarm layer
docs/PENDING.md            what stays manual, honestly
```

## Status

Schema validated; the full estate plan dry-runs clean (1 hub + 7 sites · 16
zones · 30 libraries · 40 lists · 15+ named views · 21 domain flows + 12
register workflows). Not yet run against the live tenant from this
environment (no credentials here) — the apply path guards on missing config
and every operation is idempotent for staged rollout.
