/**
 * Scope a CSS string, adding a compnent-specific trailing selector to all rules.
 * It also converts `:host` selectors for cross browser compatibility.
 *
 * @param name The component definition name.
 * @param cssText The CSS string.
 * @param extend The builtin element.
 * @return A scoped CSS string.
 */
export declare const css: (name: string, cssText: string, extend?: string | undefined) => string;
