import { html, HyperNode, Template, TemplateItems } from '@chialab/dna';
import { warnCode } from './deprecations';

export function convert(this: any, template: Template, data?: any): Template {
    if (typeof template === 'function') {
        warnCode('TEMPLATE_FUNCTIONS');
        return convert((template as Function).call(this, data));
    }
    if (!template) {
        if (template === '' || template === 0) {
            warnCode('TEMPLATE_EMPTY_VALUES');
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
