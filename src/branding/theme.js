// SharePoint theme for the CauseWay estate, generated from the house palette.
//
// SharePoint "modern" themes are a Fluent palette JSON registered per tenant
// (Add-SPOTheme / REST _api/thememanager/AddTenantTheme) and then applied to
// each site. Microsoft Graph has no theme API, so application goes through the
// SharePoint REST endpoint with a SharePoint-scoped token — same pattern as
// view creation.

import { PALETTE, BRAND } from "./tokens.js";

// Fluent slots derived from the house system: malachite primary, porcelain
// surfaces, gold foil reserved for the accent slot — one green, one paper,
// one accent, exactly as the stationery law states.
export const THEME_NAME = "CauseWay House";

export const THEME_PALETTE = {
  themePrimary: PALETTE.malachite,
  themeLighterAlt: "#f1f6f4",
  themeLighter: "#cae0d9",
  themeLight: "#a1c7bc",
  themeTertiary: "#579282",
  themeSecondary: PALETTE.malachiteUp,
  themeDarkAlt: "#094334",
  themeDark: "#07382c",
  themeDarker: "#052920",
  accent: PALETTE.goldFoil,
  neutralLighterAlt: PALETTE.porcelain2,
  neutralLighter: PALETTE.porcelain,
  neutralLight: "#d8dccf",
  neutralQuaternaryAlt: "#c9cdc1",
  neutralQuaternary: "#bfc4b8",
  neutralTertiaryAlt: "#b7bcb0",
  neutralTertiary: "#8f948a",
  neutralSecondary: "#5f645b",
  neutralPrimaryAlt: "#3b4038",
  neutralPrimary: PALETTE.ink,
  neutralDark: "#101c16",
  black: "#0b140f",
  white: "#ffffff",
};

/**
 * Register the house theme at tenant level. Requires a SharePoint-scoped
 * app-only token against the *-admin.sharepoint.com host.
 * @param {import("../graph.js").GraphClient} client
 * @param {string} adminHost - e.g. "contoso-admin.sharepoint.com"
 */
export async function addTenantTheme(client, adminHost) {
  const token = await client.spToken(adminHost);
  const res = await fetch(`https://${adminHost}/_api/thememanager/AddTenantTheme`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
      Accept: "application/json;odata.metadata=minimal",
    },
    body: JSON.stringify({
      name: THEME_NAME,
      themeJson: JSON.stringify({
        isInverted: false,
        name: THEME_NAME,
        palette: THEME_PALETTE,
      }),
    }),
  });
  if (!res.ok) throw new Error(`AddTenantTheme failed (${res.status}): ${await res.text()}`);
  return { theme: THEME_NAME };
}

/**
 * Apply the registered house theme to one site.
 * @param {import("../graph.js").GraphClient} client
 * @param {string} webUrl - the site's web URL
 */
export async function applySiteTheme(client, webUrl) {
  const host = new URL(webUrl).host;
  const token = await client.spToken(host);
  const res = await fetch(`${webUrl}/_api/ThemeManager/ApplyTheme`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
      Accept: "application/json;odata.metadata=minimal",
    },
    body: JSON.stringify({
      name: THEME_NAME,
      themeJson: JSON.stringify({
        isInverted: false,
        name: THEME_NAME,
        palette: THEME_PALETTE,
      }),
    }),
  });
  if (!res.ok) throw new Error(`ApplyTheme on ${webUrl} failed (${res.status}): ${await res.text()}`);
  return { applied: THEME_NAME, webUrl };
}

/** CSS custom properties block for any HTML surface the estate renders. */
export function cssVariables() {
  return [
    ":root {",
    `  --cw-green: ${PALETTE.malachite};`,
    `  --cw-green-up: ${PALETTE.malachiteUp};`,
    `  --cw-paper: ${PALETTE.porcelain};`,
    `  --cw-paper-2: ${PALETTE.porcelain2};`,
    `  --cw-foil: ${PALETTE.goldFoil};`,
    `  --cw-gold-deep: ${PALETTE.goldDeep};`,
    `  --cw-ink: ${PALETTE.ink};`,
    `  --cw-alert: ${PALETTE.alert};`,
    "}",
  ].join("\n");
}

export { BRAND };
