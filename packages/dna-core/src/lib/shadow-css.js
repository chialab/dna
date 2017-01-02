/**
 * A regex to match css `:host` selector.
 * @type {RegExp}
 * @private
 */
const HOST_REGEX = /\:host(\(([^({]+(\([^)]*\))?)+\))?/g;

/**
 * Add a scope to all selectors.
 * @private
 *
 * @param {CSSStyleSheet} css The css sheet to scope.
 * @param {String} scope The scope selector.
 * @param {Array} ignore A list of selectors to ignore.
 * @return {String} The scoped css.
 */
function scoped(sheet, scope, ignore) {
    let rules = sheet.rules || sheet.cssRules;
    let res = '';
    for (let i = 0, len = rules.length; i < len; i++) {
        let rule = rules[i];
        let body = rule.cssText;
        if (rule.selectorText) {
            let selector = rule.selectorText.split(',')
                .map((rule) => {
                    rule = rule.trim();
                    if (ignore.indexOf(rule) !== -1) {
                        return rule;
                    }
                    return `${scope} ${rule}`;
                })
                .join(', ');
            body = rule.cssText.replace(rule.selectorText, selector);
        } else if (rule.rules || rule.cssRules) {
            scoped(rule, scope, ignore);
            body = rule.cssText;
        }
        sheet.deleteRule(i);
        sheet.insertRule(body, i);
        res += body;
    }
    return res;
}

/**
 * Convert a shadowDOM css string into a normal scoped css.
 * @private
 *
 * @param {String} css The css string to convert.
 * @param {String} is The component name for scoping.
 * @return {String} The converted string.
 */
export function convertShadowCSS(style, is) {
    let ingoreSelectors = [];
    let scope = `.${is}`;
    style.textContent = style.textContent
        .replace(HOST_REGEX, (fullMatch, mod, state) => {
            let s = `${scope}${state || ''}`;
            ingoreSelectors.push(s);
            return s;
        });
    style.textContent = scoped(style.sheet, scope, ingoreSelectors);
}
