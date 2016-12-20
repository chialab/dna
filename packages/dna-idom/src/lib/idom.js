import { isFalsy, isObject, isFunction, isArray } from '@dnajs/core/src/lib/typeof.js';
import { DOM } from '@dnajs/core/src/core.js';
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
        if (!isObject(props)) {
            if (props) {
                children.unshift(props);
            }
            props = {};
        }
        let key = props.key;
        delete props.key;

        elementOpenStart(element, key);

        const Component = registry.get(element);
        const observedAttributes = Component && (Component.observedAttributes || []);

        for (let k in props) {
            if (!isFalsy(props[k])) {
                if (!observedAttributes ||
                    observedAttributes.indexOf(k) !== -1) {
                    attr(k, props[k]);
                    delete props[k];
                }
            }
        }

        const node = elementOpenEnd(element);
        const component = DOM.getNodeComponent(node);

        if (component) {
            for (let k in props) {
                component[k] = props[k];
            }
        }

        if (component && children.length === 0) {
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
