// Provisioner configuration, read from the environment. Nothing secret is ever
// written to disk or committed. In application mode all three app credentials
// plus SITE_ID are required; in delegated mode a Graph-scoped ACCESS_TOKEN plus
// SITE_ID are required.

import { BUILD_ORDER } from "./schema/domains/index.js";

export function loadConfig() {
  const authMode = (process.env.CW_AUTH_MODE || "application").toLowerCase();
  // One env var per domain site: CW_SITE_TECH, CW_SITE_FINOPS, CW_SITE_LINE1,
  // CW_SITE_LINE2, CW_SITE_PARTNER, CW_SITE_CONTENT, CW_SITE_PEOPLE. A domain
  // without a site id is skipped with a warning — the estate builds in stages.
  const domainSites = {};
  for (const key of BUILD_ORDER) {
    const v = process.env[`CW_SITE_${key.toUpperCase()}`];
    if (v) domainSites[key] = v;
  }
  const cfg = {
    authMode,
    tenantId: process.env.CW_TENANT_ID,
    clientId: process.env.CW_CLIENT_ID,
    clientSecret: process.env.CW_CLIENT_SECRET,
    accessToken: process.env.CW_ACCESS_TOKEN,
    siteId: process.env.CW_SITE_ID,            // the CauseWay-OS hub
    domainSites,
    spAdminHost: process.env.CW_SP_ADMIN_HOST, // e.g. contoso-admin.sharepoint.com (tenant theme)
  };
  return cfg;
}

export function validateConfig(cfg) {
  const missing = [];
  if (!cfg.siteId) missing.push("CW_SITE_ID");
  if (cfg.authMode === "application") {
    if (!cfg.tenantId) missing.push("CW_TENANT_ID");
    if (!cfg.clientId) missing.push("CW_CLIENT_ID");
    if (!cfg.clientSecret) missing.push("CW_CLIENT_SECRET");
  } else if (cfg.authMode === "delegated") {
    if (!cfg.accessToken) missing.push("CW_ACCESS_TOKEN");
  } else {
    throw new Error(`CW_AUTH_MODE must be 'application' or 'delegated' (got '${cfg.authMode}')`);
  }
  return missing;
}
