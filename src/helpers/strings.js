const DASH = /\W+/g;
const CAMEL_TO_DASH = /([a-z\d])([A-Z])/g;
const DASH_TO_CAMEL = /\W+(.)/g;

/**
 * Convert a string from camelCase to dash-case.
 * @param {string} str The string to convert.
 * @return {string} The converted string.
 */
export function camelToDash(str) {
    return str.replace(DASH, '-').replace(CAMEL_TO_DASH, '$1-$2').toLowerCase();
}
/**
 * Convert a string from dash-case to camelCase.
 * @param {string} str The string to convert.
 * @return {string} The converted string.
 */
export function dashToCamel(str) {
    return str.replace(DASH_TO_CAMEL, (x, chr) => chr.toUpperCase());
}
