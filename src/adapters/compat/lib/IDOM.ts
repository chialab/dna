import { Template, TemplateItems } from '../../../lib/Template';
import { HyperNode } from '../../../lib/HyperNode';
import { html } from '../../../lib/html';
import { render } from '../../../lib/render';
export { h } from '../../../lib/HyperNode';

export function convertTemplate(this: any, template: Template, data?: any): Template {
    if (typeof template === 'function') {
        /* eslint-disable-next-line */
        console.warn('function templates has been deprecated in DNA 3.0');
        return convertTemplate((template as Function).call(this, data));
    }
    if (!template) {
        if (template === '' || template === 0) {
            /* eslint-disable-next-line */
            console.warn('Zero and empty string values non-rendering has been deprecated in DNA 3.0');
        }
        return null;
    }
    if (typeof template === 'string') {
        return html(template);
    }
    if (typeof template === 'object' && Array.isArray((template as HyperNode).children)) {
        (template as HyperNode).children = (template as HyperNode).children.map(convertTemplate.bind(this)) as TemplateItems;
    }
    return template;
}

export function patch(root: HTMLElement, template: Template, data?: any) {
    return render(root, convertTemplate.call(null, template, data));
}
