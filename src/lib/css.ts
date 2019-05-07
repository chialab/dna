/**
 * A cache for scoped CSS.
 */
const CACHE: {
    [key: string]: {
        [key: string]: string;
    },
} = {};

/**
 * Match all `:host` selectors in a CSS string.
 */
const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/g;

/**
 * Match all comments in a CSS string.
 */
const CSS_COMMENTS_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

/**
 * Match all css selectors in a CSS string.
 */
const CSS_SELECTORS_REGEX = /(#|\*|\.|@|\[|[a-zA-Z])([^{;}]*){/g;

/**
 * Scope a CSS string, adding a compnent-specific trailing selector to all rules.
 * It also converts `:host` selectors for cross browser compatibility.
 *
 * @param name The component definition name.
 * @param text The CSS string.
 * @return A scoped CSS string.
 */
export function css(name: string, text: string): string {
    const cached = CACHE[name] = CACHE[name] || {};
    const scope = `[is="${name}"]`;
    if (text in cached) {
        return cached[text];
    }
    return cached[text] = text
        .replace(CSS_COMMENTS_REGEX, '')
        .replace(HOST_REGEX, (fullMatch, mod) => `${scope}${mod ? mod.slice(1, -1) : ''}`)
        .replace(CSS_SELECTORS_REGEX, (match) => {
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
