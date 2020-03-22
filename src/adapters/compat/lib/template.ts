import { html, HyperNode, Template, TemplateItems } from '@chialab/dna';

export function convert(this: any, template: Template, data?: any): Template {
    if (typeof template === 'function') {
        /* eslint-disable-next-line */
        console.warn('function templates have been deprecated in DNA 3.0');
        return convert((template as Function).call(this, data));
    }
    if (!template) {
        if (template === '' || template === 0) {
            /* eslint-disable-next-line */
            console.warn('zero and empty string values non-rendering has been deprecated in DNA 3.0');
            return null;
        }
        return template;
    }
    if (typeof template === 'string') {
        return html(template);
    }
    if (typeof template === 'object' && Array.isArray((template as HyperNode).children)) {
        (template as HyperNode).children = (template as HyperNode).children.map(convert.bind(this)) as TemplateItems;
    }
    if (Array.isArray(template)) {
        template = template.map((tpl) => convert.call(this, tpl, data)) as TemplateItems;
    }
    return template;
}
