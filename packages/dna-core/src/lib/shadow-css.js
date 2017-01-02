/**
 * A regex to match css `:host` selector.
 * @type {RegExp}
 * @private
 */
const HOST_REGEX = /(\:host)(\(([^(]+(\([^)]*\))?)+\))?/g;
/**
 * A regex to match css blocks.
 * @type {RegExp}
 * @private
 */
const CSS_BLOCKS = /(#|\@|\.|\[|[a-zA-Z]|\:)([^{\;\}\/]*)({({(.|\n)*?}|.|\n)*?})/g;
/**
 * A regex to match css rules in block.
 * @type {RegExp}
 * @private
 */
const CSS_RULES = /[^{]*{/;
/**
 * A regex to split css rules.
 * @type {RegExp}
 * @private
 */
const SEPARATOR_REGEX = /\,\s*/;
/**
 * A regex to match animation rules.
 * @type {RegExp}
 * @private
 */
const KEYFRAMES = /^(\-\w*\-)?keyframes/;

/**
 * Convert a shadowDOM css string into a normal scoped css.
 * @private
 *
 * @param {String} css The css string to convert.
 * @param {String} is The component name for scoping.
 * @return {String} The converted string.
 */
export function convertShadowCSS(css, is) {
    const scope = `.${is}`;
    return css
        // split blocks
        .replace(CSS_BLOCKS, (fullMatch, start, header, body) => {
            fullMatch = fullMatch.trim();
            if (fullMatch[0] === '@') {
                if (fullMatch.match(KEYFRAMES)) {
                    return fullMatch;
                }
                body = convertShadowCSS(body, is);
                return `${start}${header}${body}`;
            }
            return fullMatch
                // get rules
                .replace(CSS_RULES, (chunk) =>
                    // split rules
                    chunk.split(SEPARATOR_REGEX)
                        .map((rule) => {
                            rule = rule.trim();
                            if (rule.indexOf(':host') === 0) {
                                return rule.replace(HOST_REGEX, (fullMatch, host, mod, state) =>
                                    `${scope}${state || ''}`
                                );
                            }
                            return `${scope} ${rule}`;
                        })
                        .join(', ')
                );
        });
}
