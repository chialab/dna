import { css } from '../../../dna';

export function scopeStyle(style: HTMLStyleElement, name: string) {
    style.textContent = css(name, style.textContent || '');
}
