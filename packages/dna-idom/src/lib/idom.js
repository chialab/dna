import { DOM } from '@dnajs/core/src/library-helpers.js';
import {
    currentElement,
    currentPointer,
    skip,
    skipNode,
    elementClose,
    text,
    attr,
    symbols,
    attributes,
    applyAttr,
    applyProp,
    notifications,
    importNode,
    patchInner as originalPatchInner,
    patchOuter as originalPatchOuter,
    elementOpenStart as originalElementOpenStart,
    elementOpen as originalElementOpen,
    elementOpenEnd as originalElementOpenEnd,
} from 'incremental-dom/index.js';

let scope;
let currentOpen;

function wrapOpen(originalFn) {
    return (tag, key, statics, ...props) => {
        let filteredProps = [];
        for (let i = 0, len = props.length - 1; i < len; i += 2) {
            let key = props[i];
            let value = props[i + 1];
            if (value !== false && value !== null && value !== undefined) {
                filteredProps.push(key, value);
            }
        }
        let res = originalFn(tag, key, statics, ...filteredProps) || currentOpen;
        if (!scope) {
            scope = res;
        } else {
            if (DOM.getComponent(res)) {
                skip();
            }
        }
        currentOpen = null;
        return res;
    };
}

function wrapPatch(originalFn) {
    return (...args) => {
        let old = scope;
        scope = null;
        let res = originalFn(...args);
        scope = old;
        return res;
    };
}

const patchInner = wrapPatch(originalPatchInner);

export const IDOM = {
    currentElement,
    currentPointer,
    skip,
    skipNode,
    elementClose,
    text,
    attr,
    symbols,
    attributes,
    applyAttr,
    applyProp,
    notifications,
    importNode,
    elementOpenStart(...args) {
        let res = originalElementOpenStart(...args);
        currentOpen = res;
        return res;
    },
    elementOpen: wrapOpen(originalElementOpen),
    elementOpenEnd: wrapOpen(originalElementOpenEnd),
    patchOuter: wrapPatch(originalPatchOuter),
    patchInner,
    patch: patchInner,
    elementVoid(...args) {
        let res = this.elementOpen(...args);
        this.elementClose(args[0]);
        return res;
    },
};
