import { Template } from '../../../lib/Template';
import { render } from '../../../lib/render';
export { h } from '../../../lib/HyperNode';
import { convert } from './template';

export function patch(root: HTMLElement, template: Template, data?: any) {
    return render(root, convert.call(null, template, data));
}

export function text(text: string) {
    return text;
}
