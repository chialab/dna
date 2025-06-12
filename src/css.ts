/**
 * A cache for scoped CSS.
 */
const CACHE: Map<string, Map<string, string>> = new Map();

/**
 * Match all `:host` selectors in a CSS string.
 */
const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/g;

/**
 * Match all comments in a CSS string.
 */
const CSS_COMMENTS_REGEX = /\s*\/\*[^*]*\*+([^/*][^*]*\*+)*\/\s*/g;

/**
 * Match all css selectors in a CSS string.
 */
const CSS_SELECTORS_REGEX = /(#|\*|\.|@|\[|[a-zA-Z])([^{;}]*){/g;

/**
 * Scope a CSS string, adding a compnent-specific trailing selector to all rules.
 * It also converts `:host` selectors for cross browser compatibility.
 * @param name The component definition name.
 * @param cssText The CSS string.
 * @returns A scoped CSS string.
 * @throws If the scope name is not a string.
 * @throws If the CSS value is not a string.
 */
export const css = (name: string, cssText: string): string => {
    if (typeof name !== 'string') {
        throw new TypeError('The provided name must be a string');
    }
    if (typeof cssText !== 'string') {
        throw new TypeError('The provided CSS text must be a string');
    }

    const cached = CACHE.get(name) || new Map();
    CACHE.set(name, cached);
    const scope = `[:scope="${name}"]`;
    if (cached.has(cssText)) {
        return cached.get(cssText) as string;
    }
    const converted = cssText
        .replace(CSS_COMMENTS_REGEX, '\n')
        .replace(
            HOST_REGEX,
            (fullMatch, mod) => `${scope}${mod ? mod.slice(1, -1).replace(':defined', '[:defined]') : ''}`
        )
        .replace(CSS_SELECTORS_REGEX, (match) => {
            const multiSelector = match.trim();
            if (multiSelector[0] === '@') {
                return multiSelector;
            }
            return multiSelector
                .split(',')
                .map((selector) => {
                    const trimmedSelector = selector.trim();
                    if (trimmedSelector.indexOf(scope) === 0) {
                        return trimmedSelector;
                    }
                    return `${scope} ${trimmedSelector}`;
                })
                .join(',');
        });

    cached.set(cssText, converted);

    return converted;
};
