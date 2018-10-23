/**
 * A regex to match css `:host` selector.
 * @type {RegExp}
 * @private
 */
const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/g;

/**
 * Add a scope to sheet selectors.
 * @private
 * @param {CSSStyleSheet} sheet The sheet to convert.
 * @param {String} is The scope name to use.
 * @return {String} The updated css.
 */
function convertShadowSheet(sheet, is) {
    if (sheet.selectorText) {
        if (sheet.selectorText.indexOf(`.${is}`) === 0) {
            return sheet.cssText;
        }
        return sheet.cssText
            .replace(sheet.selectorText, `.${is} ${sheet.selectorText}`);
    }
    let rules = sheet.cssRules || sheet.rules;
    if (!rules) {
        return sheet.cssText;
    }
    let chunks = [];
    for (let i = 0, len = rules.length; i < len; i++) {
        let rule = rules[i];
        chunks.push(convertShadowSheet(rule, is));
    }
    let content = chunks.join('\n');
    if (sheet.cssText) {
        let firstBracket = sheet.cssText.indexOf('{');
        return `${sheet.cssText.substring(0, firstBracket)}${content}}`;
    }
    return content;
}

/**
 * Convert a shadowDOM style element string into a normal scoped css.
 * @private
 *
 * @param {HTMLStyleElement} style The style element to convert.
 * @param {String} is The component name for scoping.
 * @return {String} The scoped css.
 */
export function convertShadowCSS(style, is) {
    style.textContent = style.textContent
        .replace(HOST_REGEX, (fullMatch, mod) => `.${is}${mod ? mod.slice(1, -1) : ''}`);
    style.textContent = convertShadowSheet(style.sheet, is);
}
