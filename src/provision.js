// Estate provisioner. Modes:
//   --validate         static checks only (no network, no config needed)
//   --dry-run          build and print the ordered estate plan (no network)
//   --include-finale   also provision the Z08-finale HR lists (MD's call)
//   (default)          apply against the live tenant, idempotently
//
// Order of application per the estate README: theme → hub (zones, hub lists) →
// domains in build order (tech → finops → line1 → line2 → partner → content →
// people). Lists before lookups, lookups before views, views before seeds,
// permissions last. Power Automate flows cannot be created portably — every
// flow is emitted into the plan and docs/FLOWS.md instead.

import { ESTATE, HUB_LISTS, EXTRA_DOMAIN_LISTS } from "./schema/index.js";
import { DOMAINS, BUILD_ORDER } from "./schema/domains/index.js";
import { ZONES, FIVE_FOLDER_INTERIOR } from "./schema/zones.js";
import { LISTS as V2_LISTS, EXTERNAL_LISTS } from "./schema/v2.js";
import { GraphClient } from "./graph.js";
import { loadConfig, validateConfig } from "./config.js";
import { addTenantTheme, applySiteTheme, THEME_NAME } from "./branding/theme.js";

// ---- static validation --------------------------------------------------------

function validateColumns(owner, columns, errors, knownTargets) {
  const names = new Set();
  for (const col of columns || []) {
    if (names.has(col.name)) errors.push(`${owner}: duplicate column '${col.name}'`);
    names.add(col.name);
    if (col._lookup && knownTargets && !knownTargets.has(col._lookup.targetList)) {
      errors.push(`${owner}: lookup '${col.name}' targets unknown list '${col._lookup.targetList}'`);
    }
  }
  return names;
}

export function validateSchema() {
  const errors = [];

  // v2 lists (hub + routed) — lookups may target v2 lists or external v1 lists.
  const v2Names = new Set(V2_LISTS.map((l) => l.displayName));
  const knownTargets = new Set([...v2Names, ...EXTERNAL_LISTS]);
  for (const list of V2_LISTS) {
    const cols = validateColumns(list.displayName, list.columns, errors, knownTargets);
    for (const row of list.seed || []) {
      for (const f of Object.keys(row)) {
        if (f !== "Title" && !cols.has(f)) errors.push(`${list.displayName}: seed references unknown column '${f}'`);
      }
    }
  }

  // Domain workbooks.
  const domainKeys = new Set();
  for (const d of DOMAINS) {
    if (domainKeys.has(d.key)) errors.push(`duplicate domain key: ${d.key}`);
    domainKeys.add(d.key);
    if (!d.site?.name) errors.push(`domain ${d.key}: missing site name`);
    if (!d.site?.tagline) errors.push(`domain ${d.key}: missing tagline`);
    const listNames = new Set();
    for (const l of d.lists || []) {
      if (listNames.has(l.displayName)) errors.push(`${d.key}: duplicate list '${l.displayName}'`);
      listNames.add(l.displayName);
      validateColumns(`${d.key}/${l.displayName}`, l.columns, errors);
      for (const v of l.views || []) {
        if (!v.title) errors.push(`${d.key}/${l.displayName}: view without a title`);
      }
    }
    for (const lib of d.libraries || []) {
      if (!lib.name) errors.push(`${d.key}: library without a name`);
      validateColumns(`${d.key}/lib:${lib.name}`, lib.metadata, errors);
    }
    if ((d.flows || []).length === 0) errors.push(`${d.key}: workbook defines flows but none captured`);
  }

  // Zones.
  const zoneCodes = new Set();
  for (const z of ZONES) {
    if (zoneCodes.has(z.code)) errors.push(`duplicate zone code ${z.code}`);
    zoneCodes.add(z.code);
    if (!["D1", "D2"].includes(z.dClass)) errors.push(`zone ${z.code}: unexpected D-class ${z.dClass}`);
  }
  if (ZONES.length !== 16) errors.push(`expected sixteen zones, found ${ZONES.length}`);

  // Extra domain lists must target real domains.
  for (const l of EXTRA_DOMAIN_LISTS) {
    if (l.targetDomain !== "hub" && !domainKeys.has(l.targetDomain)) {
      errors.push(`extra list '${l.displayName}' targets unknown domain '${l.targetDomain}'`);
    }
  }

  return errors;
}

// ---- plan -----------------------------------------------------------------------

export function buildPlan({ includeFinale = false } = {}) {
  const domains = BUILD_ORDER.map((key) => {
    const d = DOMAINS.find((x) => x.key === key);
    const extras = EXTRA_DOMAIN_LISTS.filter(
      (l) => l.targetDomain === key && (includeFinale || !l.deferredToFinale)
    );
    const deferred = EXTRA_DOMAIN_LISTS.filter((l) => l.targetDomain === key && l.deferredToFinale && !includeFinale);
    return {
      key,
      site: d.site,
      shell: !!d.shell,
      libraries: (d.libraries || []).map((l) => ({ name: l.name, metadata: (l.metadata || []).length, restricted: !!l.restricted })),
      lists: (d.lists || []).map((l) => ({ name: l.displayName, cols: l.columns.length, views: (l.views || []).map((v) => v.title), sealed: !!l.sealed })),
      extraLists: extras.map((l) => l.displayName),
      deferredLists: deferred.map((l) => l.displayName),
      permissions: d.permissions || [],
      flows: d.flows || [],
    };
  });
  return {
    theme: THEME_NAME,
    hub: {
      site: ESTATE.hub.site,
      zones: ZONES.map((z) => `${z.code} ${z.name}${z.dClass === "D1" ? " [D1]" : ""}`),
      interior: FIVE_FOLDER_INTERIOR,
      lists: HUB_LISTS.map((l) => l.displayName),
    },
    domains,
    workflowRegister: ESTATE.workflowRegister.map((w) => `${w.code} ${w.name}`),
    includeFinale,
  };
}

export function printPlan(plan) {
  console.log("CauseWay-OS estate provisioning plan\n");
  console.log(`Theme: "${plan.theme}" — malachite/porcelain/gold-foil, applied to the hub and every domain site\n`);
  console.log(`■ HUB — ${plan.hub.site.name} (${plan.hub.site.tagline})`);
  console.log(`   ${plan.hub.zones.length} zone libraries, each with the five-folder interior:`);
  for (const z of plan.hub.zones) console.log(`      ${z}`);
  console.log(`   hub lists: ${plan.hub.lists.join(", ")}\n`);
  for (const d of plan.domains) {
    console.log(`■ ${d.site.name}${d.shell ? "  [SHELL — completed at Z08 finale]" : ""}`);
    console.log(`   tagline: ${d.site.tagline} · owner: ${d.site.owner}`);
    console.log(`   libraries: ${d.libraries.map((l) => l.name + (l.restricted ? " [restricted]" : "")).join(", ")}`);
    for (const l of d.lists) {
      console.log(`   list: ${l.name}${l.sealed ? " [SEALED]" : ""} — ${l.cols} cols · views: ${l.views.join(", ")}`);
    }
    if (d.extraLists.length) console.log(`   + estate lists: ${d.extraLists.join(", ")}`);
    if (d.deferredLists.length) console.log(`   (deferred to finale: ${d.deferredLists.join(", ")})`);
    console.log(`   groups: ${d.permissions.map((p) => p.group).join(" · ")}`);
    for (const f of d.flows) console.log(`   flow [${f.eprocess}]: ${f.name} — ${f.what}`);
    console.log("");
  }
  console.log(`Workflow register (flows to build in Power Automate, docs/FLOWS.md):`);
  for (const w of plan.workflowRegister) console.log(`   ${w}`);
  const totals = plan.domains.reduce(
    (a, d) => ({
      libs: a.libs + d.libraries.length,
      lists: a.lists + d.lists.length + d.extraLists.length,
      flows: a.flows + d.flows.length,
    }),
    { libs: 0, lists: plan.hub.lists.length, flows: 0 }
  );
  console.log(`\nTotals: 1 hub + ${plan.domains.length} domain sites · ${plan.hub.zones.length} zones · ${totals.libs} libraries · ${totals.lists} lists · ${totals.flows} domain flows + ${plan.workflowRegister.length} register workflows`);
}

// ---- live apply -------------------------------------------------------------------

const ROLE_MAP = [
  [/^full control/i, "Full Control"],
  [/^contribute/i, "Contribute"],
  [/^read/i, "Read"],
  [/^approve/i, "Read"], // approval is a flow concern; the group reads the site
];

function baseRole(level) {
  for (const [re, role] of ROLE_MAP) if (re.test(level)) return role;
  return null;
}

async function provisionLists(client, siteId, lists, nameToId, warnings, label) {
  for (const list of lists) {
    let listId = nameToId.get(list.displayName);
    if (!listId) {
      const created = await client.createList(siteId, list.displayName, list.purpose || list.description);
      listId = created.id;
      nameToId.set(list.displayName, listId);
      console.log(`+ [${label}] list: ${list.displayName}`);
    }
    const have = new Set((await client.getColumns(siteId, listId)).map((c) => c.name));
    for (const col of (list.columns || []).filter((c) => !c._lookup)) {
      if (have.has(col.name)) continue;
      await client.addColumn(siteId, listId, col);
    }
    for (const col of (list.columns || []).filter((c) => !!c._lookup)) {
      if (have.has(col.name)) continue;
      const targetId = nameToId.get(col._lookup.targetList);
      if (!targetId) { warnings.push(`[${label}] lookup '${list.displayName}.${col.name}' → '${col._lookup.targetList}' skipped (target missing)`); continue; }
      await client.addColumn(siteId, listId, { name: col.name, lookup: { listId: targetId, columnName: col._lookup.columnName } });
    }
    for (const view of list.views || []) {
      try {
        await client.createView(siteId, listId, view);
      } catch (e) {
        warnings.push(`[${label}] view '${view.title}' on '${list.displayName}': ${e.message.slice(0, 120)}`);
      }
    }
    if (list.seed) {
      const key = list.seedKey || "Title";
      const seen = new Set((await client.getItems(siteId, listId)).map((i) => i.fields?.[key]));
      for (const row of list.seed) {
        if (!seen.has(row[key])) await client.addItem(siteId, listId, row);
      }
    }
  }
}

export async function apply(cfg, { includeFinale = false } = {}) {
  const client = new GraphClient(cfg);
  const warnings = [];

  // 0. Theme — tenant registration needs the admin host; site application works per-site.
  if (cfg.spAdminHost) {
    try { await addTenantTheme(client, cfg.spAdminHost); console.log(`~ tenant theme registered: ${THEME_NAME}`); }
    catch (e) { warnings.push(`tenant theme: ${e.message.slice(0, 140)}`); }
  } else {
    warnings.push("CW_SP_ADMIN_HOST not set — tenant theme registration skipped (site-level ApplyTheme still runs)");
  }

  // 1. Hub — zones as document libraries with the five-folder interior, then hub lists.
  const hubSiteId = cfg.siteId;
  const hubLists = await client.getLists(hubSiteId);
  const hubNameToId = new Map(hubLists.map((l) => [l.displayName, l.id]));

  for (const zone of ZONES) {
    const libName = `${zone.code} · ${zone.name}`;
    let libId = hubNameToId.get(libName);
    if (!libId) {
      const created = await client.createList(hubSiteId, libName, `${zone.holds} — ${zone.dClass}`, "documentLibrary");
      libId = created.id;
      hubNameToId.set(libName, libId);
      console.log(`+ [hub] zone library: ${libName}`);
    }
    try {
      const driveId = await client.getListDrive(hubSiteId, libId);
      for (const folder of FIVE_FOLDER_INTERIOR) await client.ensureFolder(hubSiteId, driveId, folder);
    } catch (e) {
      warnings.push(`[hub] interior of '${libName}': ${e.message.slice(0, 120)}`);
    }
  }
  await provisionLists(client, hubSiteId, HUB_LISTS, hubNameToId, warnings, "hub");
  try { await applySiteTheme(client, await client.getWebUrl(hubSiteId)); } catch (e) { warnings.push(`hub theme: ${e.message.slice(0, 120)}`); }

  // 2. Domains, in build order.
  for (const key of BUILD_ORDER) {
    const d = DOMAINS.find((x) => x.key === key);
    const siteId = cfg.domainSites[key];
    if (!siteId) {
      warnings.push(`domain '${key}' has no CW_SITE_${key.toUpperCase()} — skipped (create the site, associate to the hub, then re-run)`);
      continue;
    }
    const lists = await client.getLists(siteId);
    const nameToId = new Map(lists.map((l) => [l.displayName, l.id]));
    const webUrl = await client.getWebUrl(siteId);

    // Libraries with metadata columns.
    for (const lib of d.libraries || []) {
      let libId = nameToId.get(lib.name);
      if (!libId) {
        const created = await client.createList(siteId, lib.name, lib.purpose, "documentLibrary");
        libId = created.id;
        nameToId.set(lib.name, libId);
        console.log(`+ [${key}] library: ${lib.name}`);
      }
      const have = new Set((await client.getColumns(siteId, libId)).map((c) => c.name));
      for (const col of lib.metadata || []) {
        if (!have.has(col.name)) await client.addColumn(siteId, libId, col);
      }
    }

    // Workbook lists + estate extras routed here.
    const extras = EXTRA_DOMAIN_LISTS.filter((l) => l.targetDomain === key && (includeFinale || !l.deferredToFinale));
    await provisionLists(client, siteId, [...(d.lists || []), ...extras], nameToId, warnings, key);

    // Permissions: groups are positions. Scoped grants (parenthesized) are
    // recorded for the admin; base grants are applied at web level.
    for (const p of d.permissions || []) {
      if (!p.group || /note/i.test(p.group)) continue;
      try {
        const group = await client.ensureSiteGroup(webUrl, p.group);
        const role = baseRole(p.level || "");
        if (role) await client.grantWebRole(webUrl, group.Id, role);
        if (/\(/.test(p.level || "")) warnings.push(`[${key}] scoped grant '${p.group}: ${p.level}' — apply the library scope manually`);
      } catch (e) {
        warnings.push(`[${key}] group '${p.group}': ${e.message.slice(0, 120)}`);
      }
    }

    // Sealed lists: EPR-09 pattern — MD + COO only.
    for (const l of (d.lists || []).filter((x) => x.sealed)) {
      try {
        const md = await client.ensureSiteGroup(webUrl, "MD");
        const coo = await client.ensureSiteGroup(webUrl, "COO — The Bridge");
        await client.sealList(webUrl, nameToId.get(l.displayName), [
          { groupId: md.Id, roleName: "Full Control" },
          { groupId: coo.Id, roleName: "Full Control" },
        ]);
        console.log(`~ [${key}] sealed: ${l.displayName} (2-person)`);
      } catch (e) {
        warnings.push(`[${key}] sealing '${l.displayName}': ${e.message.slice(0, 120)}`);
      }
    }

    try { await applySiteTheme(client, webUrl); } catch (e) { warnings.push(`[${key}] theme: ${e.message.slice(0, 120)}`); }
  }

  if (warnings.length) {
    console.log("\nWarnings:");
    for (const w of warnings) console.log(`  ! ${w}`);
  }
  console.log("\nDone. Flows are specified in docs/FLOWS.md — build them in Power Automate, named for their eProcess codes.");
  return { warnings };
}

// ---- entrypoint --------------------------------------------------------------------

export async function run(argv) {
  const includeFinale = argv.includes("--include-finale");
  const mode = argv.includes("--validate") ? "validate" : argv.includes("--dry-run") ? "dry-run" : "apply";

  const errors = validateSchema();
  if (errors.length) {
    console.error("Schema validation failed:");
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }
  console.error(`Schema OK: estate validated (${DOMAINS.length} domains, ${ZONES.length} zones, ${V2_LISTS.length} v2 lists).\n`);

  if (mode === "validate") return;

  const plan = buildPlan({ includeFinale });
  if (mode === "dry-run") { printPlan(plan); return; }

  const cfg = loadConfig();
  const missing = validateConfig(cfg);
  if (missing.length) {
    console.error(`Cannot apply — missing config: ${missing.join(", ")}`);
    console.error("Set these env vars, or run with --dry-run to preview without a tenant.");
    process.exit(1);
  }
  await apply(cfg, { includeFinale });
}
