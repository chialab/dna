import type { HyperNode, TemplateItem, TemplateItems, TemplateFunction } from '@chialab/dna';
import { h, Fragment } from '@chialab/dna';

export * from '@chialab/dna';
export const jsx = (tagOrComponent: string | typeof HTMLElement | typeof Fragment | TemplateFunction, props: { [key: string]: unknown; children?: TemplateItems|TemplateItem }): HyperNode => {
    let children: TemplateItems = [];
    let properties: { [key: string]: unknown } = {};
    for (let key in props) {
        if (key === 'children') {
            if (Array.isArray(props[key])) {
                children = props[key] as TemplateItems;
            } else if (props[key]) {
                children = [props[key] as TemplateItem];
            }
        } else {
            properties[key] = props[key];
        }
    }

    return h(tagOrComponent, properties, ...children);
};
export const jsxs = jsx;
