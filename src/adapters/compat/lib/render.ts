import { render as _render, CustomElement, Properties } from '@chialab/dna';

export function render(root: HTMLElement, Component: CustomElement, props: Properties) {
    /* eslint-disable-next-line */
    console.warn('render signature has changed in DNA 3.0');
    return _render(root, new Component(props));
}
