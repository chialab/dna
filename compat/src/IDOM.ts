import { h, render, Template } from '@chialab/dna';
import { convert } from './template';

export { h };

export function patch(root: HTMLElement, template: Template, data?: any) {
    return render(convert.call(null, template, data), root);
}

export function text(text: string) {
    return text;
}
