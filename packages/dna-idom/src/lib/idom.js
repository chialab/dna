import { isFalsy, isObject, isFunction, isArray } from '@dnajs/core/src/core.js';
import { registry } from '@dnajs/core/src/lib/registry.js';
import {
    skip,
    text,
    attr,
    elementClose,
    elementOpenStart,
    elementOpenEnd,
    patch as originalPatch,
} from 'incremental-dom/index.js';

function handleChildren(children) {
    children.forEach((child) => {
        if (isFunction(child)) {
            child();
        } else if (isArray(child)) {
            handleChildren(child);
        } else if (child) {
            text(child);
        }
    });
}

function interpolate(template, data) {
    if (isFunction(template)) {
        let res = template.call(this, data);
        interpolate.call(this, res);
    } else if (isArray(template)) {
        template.forEach((chunk) => {
            interpolate.call(this, chunk);
        });
    }
}


export function h(element, props, ...children) {
    return () => {
        elementOpenStart(element);

        if (!isObject(props)) {
            if (props) {
                children.unshift(props);
            }
            props = {};
        }

        for (let k in props) {
            if (!isFalsy(props[k])) {
                attr(k, props[k]);
            }
        }

        const node = elementOpenEnd(element);
        const isComponent = !!registry.get(
            node.getAttribute('is') || node.tagName
        );

        if (isComponent) {
            skip();
        } else {
            handleChildren(children);
        }
        elementClose(element);
        return node;
    };
}

export function patch(scope, fn, data) {
    return originalPatch(scope, interpolate.bind(this, fn, data));
}

export { text };
