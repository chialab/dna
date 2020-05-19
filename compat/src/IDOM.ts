import { h, render, Template } from '@chialab/dna';
import { convert } from './template';

export { h };

export function patch(root: HTMLElement, template: Template, data?: any) {
    return render(root, convert.call(null, template, data));
}

export function text(text: string) {
    return text;
}
