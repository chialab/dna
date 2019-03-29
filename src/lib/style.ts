const SCOPED_CSS_SYMBOL = Symbol();

const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/g;

const CSS_COMMENTS_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

const CSS_RULES_REGEX = /(#|\*|\.|@|\[|[a-zA-Z])([^{;}]*){/g;

export function scopeCSS(element: HTMLStyleElement, name: string, css: string): string {
    const scope = `[is="${name}"]`;
    const scopedElement: HTMLStyleElement & { [SCOPED_CSS_SYMBOL]?: string } = element;
    const scoped = scopedElement[SCOPED_CSS_SYMBOL] || '';
    if (scoped === css) {
        return scopedElement.textContent || '';
    }
    scopedElement[SCOPED_CSS_SYMBOL] = css;
    return element.textContent = css
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