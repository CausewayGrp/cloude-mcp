// The seven domain sites of the CauseWay-OS estate — one module per CW-SPB
// workbook. Build order across the estate (README, SharePoint Build):
// 1. Tech (hub + infrastructure) → 2. Finance/Ops (the Bridge, the spine) →
// 3. Line I, Line II, Partnerships (the delivery floors) → 4. Content →
// 5. People (last, at the Z08 finale).

import { TECH } from "./tech.js";
import { FINOPS } from "./finops.js";
import { LINE1 } from "./line1.js";
import { LINE2 } from "./line2.js";
import { PARTNER } from "./partner.js";
import { CONTENT } from "./content.js";
import { PEOPLE } from "./people.js";

export const DOMAINS = [TECH, FINOPS, LINE1, LINE2, PARTNER, CONTENT, PEOPLE];

export const BUILD_ORDER = ["tech", "finops", "line1", "line2", "partner", "content", "people"];

export { TECH, FINOPS, LINE1, LINE2, PARTNER, CONTENT, PEOPLE };
