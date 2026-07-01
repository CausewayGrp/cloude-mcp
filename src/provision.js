// Provisioner orchestrator. Three modes:
//   --validate : static checks on the schema only (no network, no config needed)
//   --dry-run  : build and print the ordered plan (no network)
//   (default)  : apply the plan against the live site, idempotently
//
// Ordering matters: lists are created first, then simple columns, then lookup
// columns (whose targets must already exist), then views, then reference seeds.

import { LISTS, EXTERNAL_LISTS } from "./schema/index.js";
import { GraphClient } from "./graph.js";
import { loadConfig, validateConfig } from "./config.js";

// ---- static validation -----------------------------------------------------

export function validateSchema() {
  const errors = [];
  const definedNames = new Set(LISTS.map((l) => l.displayName));
  const knownTargets = new Set([...definedNames, ...EXTERNAL_LISTS]);
  const keys = new Set();

  for (const list of LISTS) {
    if (keys.has(list.key)) errors.push(`duplicate list key: ${list.key}`);
    keys.add(list.key);
    if (!list.displayName) errors.push(`list ${list.key} has no displayName`);
    if (!list.spoke) errors.push(`list ${list.displayName} has no spoke`);
    if (!list.tier) errors.push(`list ${list.displayName} has no confidentiality tier`);

    const colNames = new Set();
    for (const col of list.columns || []) {
      if (colNames.has(col.name)) errors.push(`${list.displayName}: duplicate column '${col.name}'`);
      colNames.add(col.name);
      if (col._lookup && !knownTargets.has(col._lookup.targetList)) {
        errors.push(`${list.displayName}: lookup '${col.name}' targets unknown list '${col._lookup.targetList}'`);
      }
    }
    // Seed rows must reference real columns (Title is always present).
    for (const row of list.seed || []) {
      for (const field of Object.keys(row)) {
        if (field !== "Title" && !colNames.has(field)) {
          errors.push(`${list.displayName}: seed references unknown column '${field}'`);
        }
      }
    }
  }
  return errors;
}

// ---- plan ------------------------------------------------------------------

export function buildPlan() {
  const externalRefs = new Set();
  for (const list of LISTS) {
    for (const col of list.columns || []) {
      if (col._lookup && EXTERNAL_LISTS.includes(col._lookup.targetList)) {
        externalRefs.add(col._lookup.targetList);
      }
    }
  }
  return {
    lists: LISTS.map((l) => ({
      displayName: l.displayName,
      spoke: l.spoke,
      tier: l.tier,
      simpleColumns: (l.columns || []).filter((c) => !c._lookup).map((c) => c.name),
      lookupColumns: (l.columns || []).filter((c) => !!c._lookup).map((c) => ({
        name: c.name,
        target: c._lookup.targetList,
        optional: c._lookup.optional,
      })),
      views: (l.views || []).map((v) => v.title),
      seedRows: (l.seed || []).length,
    })),
    externalDependencies: [...externalRefs],
  };
}

export function printPlan(plan) {
  console.log("CauseWay HQ provisioning plan (CW-PROMPT-SP-001 v2.0, §5–§9)\n");
  for (const l of plan.lists) {
    console.log(`■ ${l.displayName}  [${l.tier}]`);
    console.log(`   spoke: ${l.spoke}`);
    console.log(`   columns: ${l.simpleColumns.length} simple + ${l.lookupColumns.length} lookup`);
    for (const lk of l.lookupColumns) {
      console.log(`      ↳ ${lk.name} → ${lk.target}${lk.optional ? " (optional)" : ""}`);
    }
    console.log(`   views: ${l.views.join(", ") || "(default only)"}`);
    if (l.seedRows) console.log(`   seed: ${l.seedRows} row(s)`);
    console.log("");
  }
  if (plan.externalDependencies.length) {
    console.log("External (v1.0) lists this build references and expects to already exist:");
    for (const d of plan.externalDependencies) console.log(`   • ${d}`);
    console.log("");
  }
  const total = plan.lists.reduce(
    (a, l) => ({
      cols: a.cols + l.simpleColumns.length + l.lookupColumns.length,
      views: a.views + l.views.length,
      seeds: a.seeds + l.seedRows,
    }),
    { cols: 0, views: 0, seeds: 0 }
  );
  console.log(`Totals: ${plan.lists.length} lists · ${total.cols} columns · ${total.views} named views · ${total.seeds} seed rows`);
}

// ---- live apply ------------------------------------------------------------

async function resolveLookup(col, nameToId, client, siteId, warnings) {
  const target = col._lookup.targetList;
  const listId = nameToId.get(target);
  if (!listId) {
    warnings.push(`skipped lookup '${col.name}' → '${target}' (target list not found on site)`);
    return null;
  }
  return { name: col.name, lookup: { listId, columnName: col._lookup.columnName } };
}

export async function apply(cfg) {
  const client = new GraphClient(cfg);
  const warnings = [];

  // Map existing lists by display name (idempotency + lookup resolution).
  const existing = await client.getLists(cfg.siteId);
  const nameToId = new Map(existing.map((l) => [l.displayName, l.id]));

  // 1. Lists.
  for (const list of LISTS) {
    if (nameToId.has(list.displayName)) {
      console.log(`= list exists: ${list.displayName}`);
      continue;
    }
    const created = await client.createList(cfg.siteId, list.displayName, list.description);
    nameToId.set(list.displayName, created.id);
    console.log(`+ created list: ${list.displayName}`);
  }

  // 2. Simple columns, then 3. lookup columns (targets now certainly exist).
  for (const list of LISTS) {
    const listId = nameToId.get(list.displayName);
    const have = new Set((await client.getColumns(cfg.siteId, listId)).map((c) => c.name));
    for (const col of (list.columns || []).filter((c) => !c._lookup)) {
      if (have.has(col.name)) continue;
      await client.addColumn(cfg.siteId, listId, col);
      console.log(`  + ${list.displayName}.${col.name}`);
    }
    for (const col of (list.columns || []).filter((c) => !!c._lookup)) {
      if (have.has(col.name)) continue;
      const resolved = await resolveLookup(col, nameToId, client, cfg.siteId, warnings);
      if (!resolved) continue;
      await client.addColumn(cfg.siteId, listId, resolved);
      console.log(`  + ${list.displayName}.${col.name} → ${col._lookup.targetList}`);
    }
  }

  // 4. Views.
  for (const list of LISTS) {
    const listId = nameToId.get(list.displayName);
    for (const view of list.views || []) {
      try {
        await client.createView(cfg.siteId, listId, view);
        console.log(`  ~ view ${list.displayName} / ${view.title}`);
      } catch (e) {
        warnings.push(`view '${view.title}' on '${list.displayName}': ${e.message}`);
      }
    }
  }

  // 5. Reference seeds (idempotent on the list's seedKey).
  for (const list of LISTS.filter((l) => l.seed)) {
    const listId = nameToId.get(list.displayName);
    const key = list.seedKey || "Title";
    const seen = new Set((await client.getItems(cfg.siteId, listId)).map((i) => i.fields?.[key]));
    for (const row of list.seed) {
      if (seen.has(row[key])) continue;
      await client.addItem(cfg.siteId, listId, row);
      console.log(`  • seeded ${list.displayName}: ${row.Title}`);
    }
  }

  if (warnings.length) {
    console.log("\nWarnings:");
    for (const w of warnings) console.log(`  ! ${w}`);
  }
  console.log("\nDone.");
  return { warnings };
}

// ---- entrypoint ------------------------------------------------------------

export async function run(argv) {
  const mode = argv.includes("--validate")
    ? "validate"
    : argv.includes("--dry-run")
    ? "dry-run"
    : "apply";

  const errors = validateSchema();
  if (errors.length) {
    console.error("Schema validation failed:");
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }
  console.error(`Schema OK: ${LISTS.length} lists validated.\n`);

  if (mode === "validate") return;

  const plan = buildPlan();
  if (mode === "dry-run") {
    printPlan(plan);
    return;
  }

  const cfg = loadConfig();
  const missing = validateConfig(cfg);
  if (missing.length) {
    console.error(`Cannot apply — missing config: ${missing.join(", ")}`);
    console.error("Set these env vars, or run with --dry-run to preview without a tenant.");
    process.exit(1);
  }
  await apply(cfg);
}
