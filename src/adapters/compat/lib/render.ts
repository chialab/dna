import { Properties } from '../../../lib/Component';
import { render as coreRender } from '../../../lib/render';
import { CustomElement } from '../../../lib/CustomElement';

export function render(root: HTMLElement, Component: CustomElement, props: Properties) {
    return coreRender(root, new Component(props));
}
