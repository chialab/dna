import { css } from '@chialab/dna';

/**
 * Add a scope to sheet selectors.
 * @deprecated since version 3.0
 * @param style The style sheet to convert.
 * @param name The scope name to use.
 */
export function scopeStyle(style: HTMLStyleElement, name: string) {
    style.textContent = css(name, style.textContent || '');
}
