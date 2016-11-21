import { DOM } from '@dnajs/core/src/library-helpers.js';
import {
    patchInner as originalPatchInner,
    patchOuter as originalPatchOuter,
    skip,
    elementOpen as originalElementOpen,
    elementOpenEnd as originalElementOpenEnd,
} from 'incremental-dom/index.js';

let scope;

function wrapOpen(originalFn) {
    return (...args) => {
        let res = originalFn(...args);
        if (!scope) {
            scope = res;
        } else {
            if (DOM.getComponent(res)) {
                skip();
            }
        }
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

export const elementOpen = wrapOpen(originalElementOpen);
export const elementOpenEnd = wrapOpen(originalElementOpenEnd);
export const patchOuter = wrapPatch(originalPatchOuter);
export const patchInner = wrapPatch(originalPatchInner);
export const patch = patchInner;

export {
    currentElement,
    currentPointer,
    skip,
    skipNode,
    elementVoid,
    elementOpenStart,
    elementClose,
    text,
    attr,
    symbols,
    attributes,
    applyAttr,
    applyProp,
    notifications,
    importNode,
} from 'incremental-dom/index.js';
