import type { Template } from './JSX';
import { cloneChildNodes } from './helpers';
import { DOM } from './DOM';
import { h } from './JSX';
import { customElements } from './CustomElementRegistry';
import { getThenableState } from './Thenable';

/**
 * Convert an HTML string to DOM nodes.
 * @param string The HTML string to conver.
 * @return The virtual DOM template function.
 */
export const parseDOM = (string: string): Template => {
    const source = string;
    return h((props, { store }) => {
        if (store.get('source') === source) {
            return store.get('dom') as Node[];
        }

        const wrapper = DOM.createElement('div');
        wrapper.innerHTML = source;
        customElements.upgrade(wrapper);
        const dom = cloneChildNodes(wrapper.childNodes);
        store.set('source', source);
        store.set('dom', dom);
        return dom;
    }, null);
};

/**
 * It renders the template when then provided Thenable is in pending status.
 * @param thenable The Promise-like object.
 * @param template The template to render.
 * @return A promise which resolves the template while the Thenable is in pending status.
 */
export const until = (thenable: Promise<unknown>, template: Template) => {
    const original = getThenableState(thenable);
    const wrapper = thenable.then(() => false).catch(() => false);
    const state = getThenableState(wrapper);
    state.result = original.pending && template;
    return wrapper;
};
