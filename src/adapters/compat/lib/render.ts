import { render as _render, CustomElement, Properties } from '@chialab/dna';
import { warnCode } from './deprecations';

export function render(root: HTMLElement, Component: CustomElement, props: Properties) {
    warnCode('RENDER_HELPER');
    return _render(root, new Component(props));
}
