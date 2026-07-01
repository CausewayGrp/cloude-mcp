# CauseWay HQ provisioner (`cloude-mcp`)

Declarative SharePoint list schema for the CauseWay HQ Microsoft 365 build
(**CW-PROMPT-SP-001 v2.0**, §5–§9) plus an idempotent Microsoft Graph
provisioner that builds it.

This is the CauseWay-specific layer. The generic SharePoint list/column/view/item
tooling it relies on lives in the companion **[mcp-sharepoint](https://github.com/matrix712/mcp-sharepoint)**
MCP server; this package uses its own thin Graph client so it can also run
standalone.

## What it provisions

The 11 new v2.0 lists — every column, choice, grade, competency and account
class taken **verbatim from the spec**, nothing invented:

| List | Spoke | Tier |
|---|---|---|
| Intelligence Feed (§5) | Intelligence & Pipeline | D2 |
| Content Calendar (§6) | Marketing & Communications | D2 → D3 on publish |
| Grades (§7.1, seeded G1–G6) | People & Culture | D2 |
| Recruitment Pipeline (§7.2) | People & Culture | D1 |
| Weekly Check-in (§7.3) | People & Culture | D2 |
| Performance Scorecard (§7.4) | People & Culture | D1 |
| Chart of Accounts (§8.1, seeded 6 classes) | Finance & Engagement Economics | D2 |
| Expense Claims (§8.2) | Finance & Engagement Economics | D2 |
| Engagement Profitability (§8.3) | Finance & Engagement Economics | D1 |
| Cash Position (§8.4) | Finance & Engagement Economics | D1 |
| Alarm Log (§9) | Operations & Governance | D2 |

**Totals:** 11 lists · 90 columns · 15 named views · 12 reference seed rows.

Calculated columns (§4 mechanism 1 — Gross Margin, Margin %, Overall Rating) are
provisioned directly. Cross-list and time-based values (§4 mechanisms 2/3) and
the alarm/ingestion/posting flows need Power Automate — see
[`docs/PENDING.md`](docs/PENDING.md) and [`docs/ALARMS.md`](docs/ALARMS.md).

## Usage

```bash
# Static schema checks — no tenant, no network:
npm run validate

# Preview the full ordered plan — no tenant, no network:
npm run plan

# Apply against a live site (idempotent — safe to re-run):
CW_AUTH_MODE=application \
CW_TENANT_ID=...  CW_CLIENT_ID=...  CW_CLIENT_SECRET=...  \
CW_SITE_ID=contoso.sharepoint.com,<siteCollGuid>,<webGuid> \
npm run provision
```

Delegated mode: set `CW_AUTH_MODE=delegated` and `CW_ACCESS_TOKEN` (Graph-scoped;
note view creation additionally needs a SharePoint-scoped token — see the
mcp-sharepoint README).

The provisioner:
1. creates lists (skips any that already exist),
2. adds simple columns, then lookup columns once their targets exist,
3. creates the named views (via SharePoint REST),
4. seeds reference data (Grades, Chart of Accounts) keyed idempotently.

Lookups to v1.0 lists (Regulatory Radar, Positions & Roster, Sanctions &
Integrity Screen, Live Pipeline) are resolved by display name; if one is missing
the provisioner **warns and continues** rather than failing.

## Layout

```
src/columns.js       column builders → Microsoft Graph columnDefinition objects
src/schema/index.js  the 11 list definitions (§5–§9) + external dependencies
src/graph.js         minimal Graph + SharePoint REST client
src/provision.js     validate / dry-run / idempotent apply
src/config.js        env-based configuration
bin/provision.js     CLI entrypoint
docs/ALARMS.md       §9 alarm layer as flow specs (not Graph-buildable)
docs/PENDING.md      everything deferred, and why
```

## Status

The list data model is complete and its schema is validated and dry-run-proven.
It has **not** been run against a live tenant from this environment (no
credentials). Business content that must be extracted from the firm's workbook,
and all Power Automate flows / Purview labels / per-role pages, are tracked in
[`docs/PENDING.md`](docs/PENDING.md).
