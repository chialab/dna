/**
 * A regex to match css `:host` selector.
 * @type {RegExp}
 * @private
 */
const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/g;
/**
 * A regex to match css comments.
 * @type {RegExp}
 * @private
 */
const CSS_COMMENTS_REGEX = /\s*(?!<")\/\*[^*]+\*\/(?!")\s*/g;
/**
 * A regex to match css rules.
 * @type {RegExp}
 * @private
 */
const CSS_RULES_REGEX = /(#|\*|\.|@|\[|[a-zA-Z])([^{;}]*){/g;

/**
 * Convert a shadowDOM css string into a normal scoped css.
 * @private
 *
 * @param {String} css The css string to convert.
 * @param {String} is The component name for scoping.
 * @return {String} The scoped css.
 */
export function convertShadowCSS(css, is) {
    let scope = `.${is}`;
    return css
        .replace(CSS_COMMENTS_REGEX, '')
        .replace(HOST_REGEX, (fullMatch, mod) => `${scope}${mod ? mod.slice(1, -1) : ''}`)
        .replace(CSS_RULES_REGEX, (match) => {
            match = match.trim();
            if (match[0] === '@') {
                return match;
            }
            return match
                .split(',')
                .map((selector) => {
                    selector = selector.trim();
                    if (selector.indexOf(scope) === 0) {
                        return selector;
                    }
                    return `${scope} ${selector}`;
                })
                .join(',');
        });
}
