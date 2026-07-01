// §10 confidentiality tiers. The D1–D4 → Purview sensitivity-label mapping is
// tenant-specific (label GUIDs differ per tenant) and cannot be applied to a
// list purely via Graph in a portable way, so the provisioner records the tier
// on each list and emits it in the plan; applying the actual Purview label is a
// tenant-admin step tracked in docs/PENDING.md.

export const TIER = {
  D1: "D1 — Restricted (personnel/financial-sensitive)",
  D2: "D2 — Internal",
  D3: "D3 — Shareable / public once released",
  D4: "D4 — Public",
};
