import { css } from '@chialab/dna';

export function scopeStyle(style: HTMLStyleElement, name: string) {
    style.textContent = css(name, style.textContent || '');
}
