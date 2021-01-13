import { ComponentConstructorInterface } from './Interfaces';
import { window } from './window';
import { createElementImpl } from './helpers';

/**
 * The attribute for the host element.
 */
export const HOST_ATTRIBUTE = ':host';

/**
 * The attribute for scoped elements.
 */
export const SCOPE_ATTRIBUTE = ':scope';

/**
 * The attribute for defined elements.
 */
export const DEFINED_ATTRIBUTE = ':defined';

/**
 * A cache for scoped CSS.
 */
const CACHE: {
    [key: string]: {
        [key: string]: string;
    };
} = {};

/**
 * Match all `:host` selectors in a CSS string.
 */
const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/;

/**
 * Match all comments in a CSS string.
 */
const CSS_COMMENTS_REGEX = /\s*\/\*[^*]*\*+([^/*][^*]*\*+)*\/\s*/g;

/**
 * Match all css selectors in a CSS string.
 */
const CSS_SELECTORS_REGEX = /(#|\*|\.|@|\[|:|[a-zA-Z])([^{;}]*){/g;

/**
 * Scope a CSS string, adding a compnent-specific trailing selector to all rules.
 * It also converts `:host` selectors for cross browser compatibility.
 *
 * @param name The component definition name.
 * @param cssText The CSS string.
 * @return A scoped CSS string.
 */
export const css = (name: string, cssText: string): string => {
    if (typeof name !== 'string') {
        throw new TypeError('The provided name must be a string');
    }
    if (typeof cssText !== 'string') {
        throw new TypeError('The provided CSS text must be a string');
    }

    let cached = CACHE[name] = CACHE[name] || {};
    if (cssText in cached) {
        return cached[cssText];
    }
    return cached[cssText] = cssText
        .replace(/:defined/g, `[\\${DEFINED_ATTRIBUTE}]`)
        .replace(CSS_COMMENTS_REGEX, '\n')
        .replace(CSS_SELECTORS_REGEX, (match) => {
            match = match.trim();

            if (match[0] === '@') {
                return match;
            }

            let selectors = match
                .replace(/\s*\{$/, '')
                .split(',')
                .map((selector) => {
                    selector = selector.trim();

                    let hostMatch = selector.match(HOST_REGEX);
                    if (hostMatch) {
                        return `[\\${HOST_ATTRIBUTE}='${name}']${hostMatch[2] || ''}`;
                    }

                    return selector.split(/([>+])/)
                        .map((selector, index) => {
                            if (index % 2 === 1) {
                                return selector;
                            }

                            return selector.trim()
                                .split(/\s+/)
                                .map((selector) => {
                                    let chunks = selector.trim().split(':');
                                    selector = `${chunks.shift()}[\\${SCOPE_ATTRIBUTE}='${name}']`;
                                    if (chunks.length) {
                                        selector += `:${chunks.join(':')}`;
                                    }
                                    return selector;
                                })
                                .join(' ');
                        })
                        .join(' ');
                })
                .join(',');

            return `${selectors} {`;
        });
};

/**
 * Load constructed CSSStyleSheets.
 * Convert CSS data to scoped CSS and load them into a style.
 * @param constructor The Custom Element construcotor.
 */
export const loadStyleSheets = (constructor: ComponentConstructorInterface<HTMLElement>) => {
    let is = constructor.prototype.is;
    let styles = constructor.adoptedStyleSheets || [];
    styles.forEach((style) => {
        let text = '';
        for (let i = 0; i < style.cssRules.length; i++) {
            text += style.cssRules[i].cssText;
        }

        let element = createElementImpl('style');
        element.textContent = css(is, text);
        window.document.head.appendChild(element);
    });
};
