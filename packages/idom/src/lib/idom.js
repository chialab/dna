import { isFalsy, isObject, isFunction, isArray, isString, has } from '@chialab/proteins';
import { DOM, registry, bootstrap } from '@dnajs/core';
import { TrustedData, TRUSTED_SYM } from './trust.js';
import {
    skip,
    text,
    attr,
    elementClose,
    elementOpenStart,
    elementOpenEnd,
    patch as originalPatch,
    skipNode,
    currentPointer,
} from 'incremental-dom/index.js';

function handleChildren(children, parentNode) {
    if (!children) {
        return true;
    }

    if (children instanceof DOM.Node) {
        return true;
    }

    if (isArray(children)) {
        for (let i = 0, len = children.length; i < len; i++) {
            let child = children[i];
            if (!handleChildren(child, parentNode)) {
                return false;
            }
        }
        return true;
    }

    if (isFunction(children)) {
        return handleChildren(children(), parentNode);
    }

    if (children instanceof TrustedData) {
        let html = children.toString();
        if (parentNode[TRUSTED_SYM] !== html) {
            parentNode[TRUSTED_SYM] = parentNode.innerHTML = children.toString();
            bootstrap(parentNode);
        }
        skip();
        return false;
    }

    if (parentNode.__dnaTextContent !== children) {
        text(children);
        parentNode.__dnaTextContent = children;
    } else {
        skip();
    }

    return true;
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

        if (children.length === 0 && !node.__dnaHadChildren) {
            skip();
        } else {
            node.__dnaHadChildren = true;
            handleChildren(children, node);
        }
        if (!node.__dnaCreated) {
            while (currentPointer()) {
                skipNode();
            }
        }
        elementClose(element);
        node.__dnaCreated = true;

        if (component && isObject(component.properties)) {
            patch.current.after(() => {
                let componentProperties = component.properties;
                for (let k in props) {
                    if (has(componentProperties, k)) {
                        component[k] = props[k];
                    }
                }
                component.requestRender();
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
        let prev = patch.current;
        let current = patch.current = new Patch();
        originalPatch(scope, interpolate.bind(this, fn, data));
        patch.current = prev;
        current.flush();
    }
    if (patch.current) {
        patch.current.after(patch.bind(this, scope, fn, data));
    } else {
        exec();
    }
}

export { text };
