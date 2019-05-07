/**
 * A symbol to access scoped CSS cache for style elements.
 */
const SCOPED_CSS_SYMBOL = Symbol();

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
 * @param styleElement The `<style>` element to update.
 * @param name The component definition name.
 * @param css The CSS string.
 * @return A scoped CSS string.
 */
export function scopeCSS(styleElement: HTMLStyleElement, name: string, css: string): string {
    const scope = `[is="${name}"]`;
    const scopedElement: HTMLStyleElement & { [SCOPED_CSS_SYMBOL]?: string } = styleElement;
    const scoped = scopedElement[SCOPED_CSS_SYMBOL] || '';
    if (scoped === css) {
        return scopedElement.textContent || '';
    }
    scopedElement[SCOPED_CSS_SYMBOL] = css;
    return styleElement.textContent = css
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
