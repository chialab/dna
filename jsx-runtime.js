import { h, Fragment } from './dist/esm/dna.js';

export { h, Fragment };
export const jsx = (tagOrComponent, props) => {
    const properties = {};
    const children = [];
    for (const key in props) {
        if (key === 'children') {
            if (Array.isArray(props[key])) {
                children.push(...props[key]);
            } else if (props[key]) {
                children.push(props[key]);
            }
        } else {
            properties[key] = props[key];
        }
    }

    return h(tagOrComponent, properties, ...children);
};
export const jsxs = jsx;
