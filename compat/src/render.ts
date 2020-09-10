import { render as _render, Component } from '@chialab/dna';
import { warnCode } from './deprecations';

export function render(root: HTMLElement, constructor: typeof Component, props: { [key: string]: any; }) {
    warnCode('RENDER_HELPER');
    return _render(new constructor(props), root);
}
