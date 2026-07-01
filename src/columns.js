// Column builders — each returns a Microsoft Graph `columnDefinition` object
// accepted as-is by the mcp-sharepoint `addColumn` tool (and by createList's
// inline `columns` array). Lookup columns cannot know their target list id
// until provisioning time, so they are emitted with a `_lookup` marker that the
// provisioner resolves against the live site before creating the column.

export function text(name, { required = false } = {}) {
  return { name, required, text: { allowMultipleLines: false, textType: "plain" } };
}

export function multiline(name, { required = false, lines = 6 } = {}) {
  return {
    name,
    required,
    text: { allowMultipleLines: true, textType: "plain", linesForEditing: lines },
  };
}

export function number(name, { required = false, min, max, decimals = "automatic" } = {}) {
  const col = { name, required, number: { decimalPlaces: decimals } };
  if (min !== undefined) col.number.minimum = min;
  if (max !== undefined) col.number.maximum = max;
  return col;
}

export function currency(name, { required = false, locale = "en-US" } = {}) {
  return { name, required, currency: { locale } };
}

export function boolean(name, { defaultValue } = {}) {
  const col = { name, boolean: {} };
  if (defaultValue !== undefined) col.defaultValue = { value: defaultValue ? "1" : "0" };
  return col;
}

export function choice(name, choices, { required = false, allowFillIn = false, displayAs = "dropDownMenu", defaultValue } = {}) {
  const col = {
    name,
    required,
    choice: { choices, displayAs, allowTextEntry: allowFillIn },
  };
  if (defaultValue !== undefined) col.defaultValue = { value: defaultValue };
  return col;
}

export function dateTime(name, { required = false, format = "dateTime" } = {}) {
  return { name, required, dateTime: { displayAs: "default", format } };
}

export function person(name, { required = false, multi = false } = {}) {
  return {
    name,
    required,
    personOrGroup: { allowMultipleSelection: multi, chooseFromType: "peopleOnly" },
  };
}

/**
 * Lookup column. `targetList` is a display name resolved to a list id at
 * provisioning time; `columnName` is the field shown from the target (default
 * Title). `optional` records that the spec allows the lookup to be empty.
 */
export function lookup(name, targetList, { columnName = "Title", multi = false, optional = false } = {}) {
  return {
    name,
    _lookup: { targetList, columnName, multi, optional },
  };
}

/**
 * Calculated column. `outputType` is one of text | number | dateTime | boolean |
 * currency. This is what makes the spec's §4 "dynamic updates" rule
 * provisionable with no flow.
 */
export function calculated(name, formula, outputType = "text", { format } = {}) {
  const calc = { formula, outputType };
  if (format) calc.format = format;
  return { name, calculated: calc };
}
