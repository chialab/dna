const doc = document.implementation.createHTMLDocument('');

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
 * @param {RegExp} scopeRegex The scope class regex.
 */
function convertShadowSheet(sheet, scope, scopeRegex) {
    if (sheet.selectorText) {
        let selector = sheet.selectorText.trim();
        if (selector.match(scopeRegex)) {
            return;
        }
        let scoped = selector
            .split(SPLIT_SELECTOR_REGEX)
            .map((sel) => `${scope} ${sel}`).join(', ');
        sheet.selectorText = scoped;
    }
    let rules = sheet.cssRules || sheet.rules;
    if (!rules) {
        return;
    }
    for (let i = 0, len = rules.length; i < len; i++) {
        convertShadowSheet(rules[i], scope);
    }
}

/**
 * Convert a shadowDOM style CSS string into a normal scoped css.
 * @private
 *
 * @param {String} css The style CSS to convert.
 * @param {String} is The component name for scoping.
 * @return {HTMLStyleElement} The scoped css.
 */
export function convertShadowCSS(css, is) {
    let style = doc.createElement('style');
    let scope = `.${is}`;
    style.textContent = css.replace(HOST_REGEX, (fullMatch, mod) => `${scope}${(mod || '').slice(1, -1)}`);
    doc.body.appendChild(style);
    convertShadowSheet(style.sheet, scope, new RegExp(`${scope}/b`));
    doc.body.removeChild(style);
    return style;
}
