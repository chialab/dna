const doc = new DOMParser().parseFromString('<html><body></body></html>', 'text/html');

/**
 * A regex to match css `:host` selector.
 * @type {RegExp}
 * @private
 */
const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/g;

/**
 * A regex for selector splitting.
 * @type {RegExp}
 * @private
 */
const SPLIT_SELECTOR_REGEX = /\s*,\s*/;

/**
 * Add a scope to sheet selectors.
 * @private
 * @param {CSSStyleSheet} sheet The sheet to convert.
 * @param {String} scope The scope name to use.
 * @return {String} The updated css.
 */
function convertShadowSheet(sheet, scope) {
    let content = sheet.cssText;
    if (sheet.selectorText) {
        let selector = sheet.selectorText.trim();
        if (selector.indexOf(scope) === 0) {
            return content;
        }
        let scoped = selector
            .split(SPLIT_SELECTOR_REGEX)
            .map((sel) => `${scope} ${sel}`).join(', ');
        return content.replace(selector, scoped);
    }
    let rules = sheet.cssRules || sheet.rules;
    if (!rules) {
        return content;
    }
    let inner = '';
    for (let i = 0, len = rules.length; i < len; i++) {
        inner += `${convertShadowSheet(rules[i], scope)}\n`;
    }
    if (sheet.parentStyleSheet) {
        let firstBracket = content.indexOf('{');
        return `${content.substring(0, firstBracket)}{${inner}}`;
    }
    return inner;
}

/**
 * Convert a shadowDOM style CSS string into a normal scoped css.
 * @private
 *
 * @param {String} css The style CSS to convert.
 * @param {String} is The component name for scoping.
 * @return {String} The scoped css.
 */
export function convertShadowCSS(css, is) {
    let style = doc.createElement('style');
    let scope = `.${is}`;
    style.textContent = css.replace(HOST_REGEX, (fullMatch, mod) => `${scope}${(mod || '').slice(1, -1)}`);
    doc.body.appendChild(style);
    return convertShadowSheet(style.sheet, scope);
}
