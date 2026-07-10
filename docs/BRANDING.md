# The house branding — enforcement law

Source: **"Complete branding system upgrade" — The House Stationery**
(CauseWay Stationery & Identity). Its own words are the law:

> One house · one green · one seal. Every surface is cut from one porcelain
> stock and one institutional green, closed with an engine-turned seal in gold
> foil — the register of a house that keeps standards, not a firm that
> decorates them. *هويةٌ تُدرَك قبل أن تُقرأ.*

## The palette (src/branding/tokens.js)

| Token | Value | Role |
|---|---|---|
| `malachite` | `#0A4A3A` | **The one house green** — primary everywhere |
| `malachiteUp` | `#0C5C46` | Lifted green — hover, secondary emphasis |
| `porcelain` | `#ECEEE4` | **The one paper stock** — surfaces, backgrounds |
| `porcelain2` | `#E3E7DD` | Secondary paper |
| `goldFoil` | `#C9A24B` | **The one accent** — the seal; small, deliberate |
| `goldDeep` | `#B08641` | Deep gold for small text on light ground |
| `ink` | `#13251D` | Text |
| `alert` | `#B00020` | The single alarm red |

**The upgrade supersedes the legacy intranet forest/deep palette**
(`#1C3D32`/`#13291F`, kept in `LEGACY_PALETTE` for deliberate migration only).
New surfaces never use legacy values.

## Type

- **Archivo** — the workhorse sans: UI, tables, forms.
- **Fraunces** — display serif (intranet reference builds).
- **Amiri** — Arabic, always native (POL-LANG-01): Arabic content is
  native-separate, never machine-mixed into an English surface, and never
  same-post bilingual on social.
- **Monospace** — every instrument code: `CW-XXX-###`, `ENG-YYYY-nnn`, `WF-TEC-xx`.

## Identity constants (never retyped, always imported from tokens.js)

- CauseWay for Financial, Banking & Development Consultancies (Limited) · CR 26666
- Khormaksar · Aden · Republic of Yemen · +967 2 236655
- causewaygrp.com · office@causewaygrp.com
- Tagline: **From intent to delivery.** / **من النية إلى التنفيذ**
- Descriptor: Financial · Banking · Development / للاستشارات المالية والمصرفية والتنموية
- Motto: Clarity in complexity. Trust in turbulence.

## How the provisioner enforces it

1. **SharePoint theme** (`src/branding/theme.js`): the "CauseWay House" Fluent
   palette — malachite primary, porcelain neutrals, gold-foil accent —
   registered at tenant level (`AddTenantTheme`, needs `CW_SP_ADMIN_HOST`) and
   applied to the hub and every domain site (`ApplyTheme`) on every run.
2. **Gold is the accent, not a second colour.** The Fluent `accent` slot is the
   only place gold enters the theme; anything louder is off-register.
3. **CSS variables** (`cssVariables()`) for any HTML surface the estate renders
   (dashboards, embedded pages), so pages and sites read from one source.
4. Workbook tab 01 says "CauseWay theme (forest/gold); accent for this domain
   applied to headers" — the theme instruction carries forward; the *palette*
   is the upgraded house system per the branding upgrade's supersession.
   Per-domain header accents are a page-level touch applied by the admin
   (PENDING.md) — accents never replace malachite as primary.

## What never happens

- No second green, no second paper, no second accent.
- No raw stock photography on identity surfaces; treated imagery only.
- No bilingual mixing inside one surface — EN and AR are parallel natives.
- No legacy palette on new surfaces.
