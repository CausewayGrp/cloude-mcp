// CauseWay brand tokens — extracted from the firm's own material, not invented.
//
// PRIMARY SOURCE: "Complete branding system upgrade" (The House Stationery,
// CauseWay Stationery & Identity) — "One house · one green · one seal. Every
// surface is cut from one porcelain stock and one institutional green, closed
// with an engine-turned seal in gold foil."
//
// LEGACY SOURCE (superseded for brand surfaces, retained for reference because
// the intranet reference builds still carry it): CauseWay_OS_Technology_Hub
// forest/deep palette.

export const BRAND = {
  name: "CauseWay",
  legalName: "CauseWay for Financial, Banking & Development Consultancies (Limited)",
  registration: "CR 26666",
  location: "Khormaksar · Aden · Republic of Yemen",
  domain: "causewaygrp.com",
  email: "office@causewaygrp.com",
  phone: "+967 2 236655",
  tagline: { en: "From intent to delivery.", ar: "من النية إلى التنفيذ" },
  descriptor: { en: "Financial · Banking · Development", ar: "للاستشارات المالية والمصرفية والتنموية" },
  motto: "Clarity in complexity. Trust in turbulence.",
};

// The upgraded house palette — the authoritative surface system.
export const PALETTE = {
  malachite: "#0A4A3A",   // the one house green (--hg)
  malachiteUp: "#0C5C46", // lifted green for hover/accents
  porcelain: "#ECEEE4",   // the one paper stock (--paper)
  porcelain2: "#E3E7DD",  // secondary paper (--paper2)
  goldFoil: "#C9A24B",    // the one accent — the engine-turned seal (--foil)
  goldDeep: "#B08641",    // deep gold for small text on light ground
  ink: "#13251D",         // text on paper (--ink)
  alert: "#B00020",       // the single alarm red observed in the system
};

// Legacy intranet palette (Technology Hub reference build) — kept so existing
// pages can be migrated deliberately, not so new surfaces use it.
export const LEGACY_PALETTE = {
  deep: "#13291F",
  forest: "#1C3D32",
  gold: "#B08641",
  goldBright: "#C9A24B",
  bone: "#F6F2E9",
  paper: "#FBF9F4",
  ink: "#22201C",
  line: "#E4DCCB",
  muted: "#6E6A60",
  // domain accent family used by the sixteen-zone map
  teal: "#0F5A4E",
  oxblood: "#6A2536",
  aubergine: "#46315C",
  graphite: "#36495A",
  bronze: "#7A5223",
};

export const TYPE = {
  sans: "'Archivo', system-ui, sans-serif",   // workhorse — UI, tables, forms
  serif: "'Fraunces', Georgia, serif",         // display — intranet reference builds
  arabic: "'Amiri', serif",                    // Arabic — native, never machine-mixed
  mono: "ui-monospace, monospace",             // codes: CW-XXX-###, ENG-YYYY-nnn
};

// Language law (POL-LANG-01): English primary; Arabic content as native files.
// Social AR posts are native-separate, never same-post bilingual.
export const LANGUAGE_RULE =
  "English primary; Arabic as native content, never machine-mixed in one surface (POL-LANG-01)";
