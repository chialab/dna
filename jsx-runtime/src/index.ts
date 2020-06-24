import { h, Fragment, TemplateItem, TemplateItems, TemplateFunction } from '@chialab/dna';
export * from '@chialab/dna';
export const jsx = (tagOrComponent: string | typeof HTMLElement | typeof Fragment | TemplateFunction, props: { [key: string]: any, children?: TemplateItems|TemplateItem }) => {
    let children: TemplateItems = [];
    let properties: any = {};
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
