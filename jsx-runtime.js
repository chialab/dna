import { h, Fragment } from './dist/esm/dna.js';

export { h, Fragment };
export const jsx = (tagOrComponent, props) => {
    let properties = {};
    let children = [];
    for (let key in props) {
        if (key === 'children') {
            if (Array.isArray(props[key])) {
                children = props[key];
            } else if (props[key]) {
                children = [props[key]];
            }
        } else {
            properties[key] = props[key];
        }
    }

    return h(tagOrComponent, properties, ...children);
};
export const jsxs = jsx;
