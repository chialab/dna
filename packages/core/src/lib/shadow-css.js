/**
 * A regex to match css `:host` selector.
 * @type {RegExp}
 * @private
 */
const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/g;
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
                        body = rule.cssText.replace(rule.selectorText, selector);
                        // Safari does not use "..." for single word content
                        if (rule.style && rule.style.content && !rule.style.content.match(/^([\w_-]+\(|['"])/)) {
                            body = body.replace(`content: ${rule.style.content}`, `content: "${rule.style.content}"`);
                        }
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
}

/**
 * Convert a shadowDOM css string into a normal scoped css.
 * @private
 *
 * @param {HTMLStyleElement} style The style element.
 * @param {String} css The css string to convert.
 * @param {String} is The component name for scoping.
 * @return {String} The converted string.
 */
export function convertShadowCSS(style, css, is) {
    let scope = `.${is}`;
    style.textContent = css.replace(HOST_REGEX, (fullMatch, mod) =>
        `${scope}${mod ? mod.slice(1, -1) : ''}`
    );
    scoped(style.sheet, scope) || '';
}
