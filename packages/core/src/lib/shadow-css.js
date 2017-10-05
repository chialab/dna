/**
 * A regex to match css `:host` selector.
 * @type {RegExp}
 * @private
 */
const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/g;
/**
 * A regex to match content rule.
 * @type {RegExp}
 * @private
 */
const CONTENT_REGEX = /(?:^|\s)content:\s*([\w_-]*);/g;

/**
 * CSSKeyframesRule class.
 * @type {function}
 * @private
 */
const KFRule = self.CSSKeyframesRule ||
    self.WebKitCSSKeyframesRule ||
    self.MozCSSKeyframesRule;

/**
 * Add a scope to all selectors.
 * @private
 *
 * @param {CSSStyleSheet} sheet The css sheet to scope.
 * @param {String} scope The scope selector.
 */
function scoped(sheet, scope) {
    let rules = sheet.cssRules || sheet.rules;
    if (sheet.insertRule) {
        let reg = new RegExp(`${scope}([\\s.[:]|$)`);
        for (let i = 0, len = rules.length; i < len; i++) {
            let rule = rules[i];
            if (!(rule instanceof KFRule)) {
                try {
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
                        body = rule.cssText
                            .replace(rule.selectorText, selector)
                            .replace(CONTENT_REGEX, 'content: "$1";');
                    } else if (rule.cssRules || rule.rules) {
                        scoped(rule, scope);
                        body = rule.cssText;
                    }
                    sheet.deleteRule(i);
                    sheet.insertRule(body, i);
                } catch (ex) {
                    //
                }
            }
        }
    }
    return [].map.call(
        rules,
        (rule) => rule.cssText.replace(CONTENT_REGEX, 'content: "$1";')
    ).join('');
}

/**
 * Convert a shadowDOM css string into a normal scoped css.
 * @private
 *
 * @param {HTMLStyleElement} style The style element.
 * @param {String} css The css string to convert.
 * @param {String} is The component name for scoping.
 */
export function convertShadowCSS(style, css, is) {
    let scope = `.${is}`;
    style.textContent = css
        .replace(HOST_REGEX, (fullMatch, mod) =>
            `${scope}${mod ? mod.slice(1, -1) : ''}`
        );
    style.textContent = scoped(style.sheet, scope);
}
