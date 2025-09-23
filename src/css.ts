/**
 * A cache for scoped CSS.
 */
const CACHE: Map<string, string> = new Map();

/**
 * Match all `:host` selectors in a CSS string.
 */
const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/g;

/**
 * Convert a CSS selector to a scoped selector.
 * It replaces `:host` with the provided scope and adds the scope to other selectors.
 * @param selector The CSS selector to convert.
 * @param scope The scope to apply to the selector.
 * @returns The converted CSS selector.
 */
const convertSelector = (selector: string, scope: string): string => {
    return selector
        .split(',')
        .map((selectorPart) => {
            const trimmed = selectorPart.trim();
            if (trimmed.startsWith(':host')) {
                return trimmed.replace(HOST_REGEX, (fullMatch, mod) => {
                    return `${scope}${mod ? mod.slice(1, -1).replace(':defined', '[:defined]') : ''}`;
                });
            }
            return `${scope} ${trimmed}`;
        })
        .join(',');
};

/**
 * Convert a CSS rule to a scoped rule.
 * It handles both style rules and grouping rules.
 * @param rule The CSS rule to convert.
 * @param scope The scope to apply to the rule.
 * @returns The converted CSS rule as a string.
 */
const convertRule = (rule: CSSRule, scope: string): string => {
    if (rule instanceof CSSStyleRule) {
        return `${convertSelector(rule.selectorText, scope)} { ${rule.style.cssText} }`;
    }

    if (rule instanceof CSSGroupingRule) {
        for (let i = rule.cssRules.length - 1; i >= 0; i--) {
            rule.insertRule(convertRule(rule.cssRules[i], scope), i);
            rule.deleteRule(i + 1);
        }
    }

    return rule.cssText;
};

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

    const id = `${name}-${cssText}`;
    const scope = `[\\:scope="${name}"]`;
    if (CACHE.has(id)) {
        return CACHE.get(id) as string;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString('<!DOCTYPE html><html lang="en"><body></body></html>', 'text/html');
    const style = doc.createElement('style');
    doc.head.appendChild(style);
    style.appendChild(doc.createTextNode(cssText));

    const sheet = style.sheet;
    if (!sheet) {
        throw new Error('The provided CSS text is not valid');
    }

    const chunks: string[] = [];
    for (let i = 0; i < sheet.cssRules.length; i++) {
        chunks.push(convertRule(sheet.cssRules[i], scope));
    }
    const converted = chunks.join('\n');
    CACHE.set(id, converted);

    return converted;
};
