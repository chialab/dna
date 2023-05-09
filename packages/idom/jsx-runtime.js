import { h } from '@dnajs/idom';

export function jsx(tagOrComponent, properties = null, key) {
    const props = {
        ...(properties || {}),
    };
    if (key) {
        props.key = key;
    }

    const children = props.children == null ? [] : Array.isArray(props.children) ? props.children : [props.children];
    delete props.children;

    return h(tagOrComponent, props, ...children);
}

export const jsxs = jsx;
export const jsxDEV = jsx;
