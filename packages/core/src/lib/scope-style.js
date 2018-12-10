/**
 * A regex to match css `:host` selector.
 * @type {RegExp}
 * @private
 */
export const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/g;

/**
 * A regex for selector splitting.
 * @type {RegExp}
 * @private
 */
export const SPLIT_SELECTOR_REGEX = /\s*,\s*/;

/**
 * Add a scope to sheet selectors.
 * @memberof DNA
 * @param {CSSStyleSheet|HTMLStyleElement} sheet The sheet to convert.
 * @param {String} scope The scope name to use.
 */
export function scopeStyle(sheet, scope, scopeRegex) {
    if (sheet instanceof HTMLStyleElement) {
        sheet = sheet.sheet;
    }
    scopeRegex = scopeRegex || new RegExp(`${scope}/b`);
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
        scopeStyle(rules[i], scope, scopeRegex);
    }
}
