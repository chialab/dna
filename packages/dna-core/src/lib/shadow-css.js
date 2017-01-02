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
 * @return {String} The scoped css.
 */
function scoped(sheet, scope) {
    let rules = sheet.cssRules || sheet.rules;
    let reg = new RegExp(`${scope}([\.\[:]|$)`);
    for (let i = 0, len = rules.length; i < len; i++) {
        let rule = rules[i];
        if (rule.insertRule) {
            let body = rule.cssText;
            if (rule.selectorText) {
                let selector = rule.cssText.split('{').shift().split(',')
                    .map((rule) => {
                        rule = rule.trim();
                        if (rule.match(reg)) {
                            return rule;
                        }
                        return `${scope} ${rule}`;
                    })
                    .join(', ');
                body = rule.cssText.replace(rule.selectorText, selector);
            } else if (rule.cssRules || rule.rules) {
                scoped(rule, scope);
                body = rule.cssText;
            }
            sheet.deleteRule(i);
            sheet.insertRule(body, i);
        }
    }
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
    let scope = `.${is}`;
    style.textContent = style.textContent
        .replace(HOST_REGEX, (fullMatch, mod, state) =>
            `${scope}${state || ''}`
        );
    scoped(style.sheet, scope);
}
