// Provisioner configuration, read from the environment. Nothing secret is ever
// written to disk or committed. In application mode all three app credentials
// plus SITE_ID are required; in delegated mode a Graph-scoped ACCESS_TOKEN plus
// SITE_ID are required.

export function loadConfig() {
  const authMode = (process.env.CW_AUTH_MODE || "application").toLowerCase();
  const cfg = {
    authMode,
    tenantId: process.env.CW_TENANT_ID,
    clientId: process.env.CW_CLIENT_ID,
    clientSecret: process.env.CW_CLIENT_SECRET,
    accessToken: process.env.CW_ACCESS_TOKEN,
    siteId: process.env.CW_SITE_ID,
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
