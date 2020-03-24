import { render as _render, IComponent, Properties } from '@chialab/dna';
import { warnCode } from './deprecations';

export function render(root: HTMLElement, Component: IComponent, props: Properties) {
    warnCode('RENDER_HELPER');
    return _render(root, new Component(props));
}
