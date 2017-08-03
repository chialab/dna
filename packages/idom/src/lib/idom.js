import { isFalsy, isObject, isFunction, isArray, isString } from '@dnajs/core/src/lib/typeof.js';
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

        const Component = registry.get(props.is || element);
        elementOpenStart(element, key);

        for (let k in props) {
            let val = props[k];
            if (!isFalsy(val) && (!Component || isString(val) || !isNaN(val) || val === true)) {
                attr(k, val);
            }
        }

        const node = elementOpenEnd(element);
        const component = Component && (DOM.getNodeComponent(node) || new Component(node));

        if (component && children.length === 0) {
            skip();
        } else {
            handleChildren(children);
        }
        elementClose(element);

        if (component && isObject(component.properties)) {
            patch.current.after(() => {
                let componentProperties = component.properties;
                for (let k in props) {
                    if (componentProperties.hasOwnProperty(k)) {
                        component[k] = props[k];
                    }
                }
            });
        }

        return node;
    };
}

class Patch {
    constructor() {
        this.callbacks = [];
    }

    after(fn) {
        this.callbacks.push(fn);
    }

    flush() {
        this.callbacks.forEach((clb) => clb());
    }
}

export function patch(scope, fn, data) {
    function exec() {
        patch.current = new Patch();
        originalPatch(scope, interpolate.bind(this, fn, data));
        patch.current.flush();
        patch.current = null;
    }
    if (patch.current) {
        patch.current.after(exec);
    } else {
        exec();
    }
}

export { text };
