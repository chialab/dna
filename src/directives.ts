import { customElements, document } from '$env';
import { type FunctionComponent } from './FunctionComponent';
import { cloneChildNodes } from './helpers';
import { h, type Template } from './JSX';
import { getThenableState } from './Thenable';

/**
 * A dom parser function component.
 * @param props The props of the parser.
 * @param context The render context.
 * @returns A list of nodes to render.
 */
const DOMParse: FunctionComponent<{ source: string }> = (props, context) => {
    const source = props.source;
    const store = context.store;

    if (store.get('source') === source) {
        return store.get('dom') as Node[];
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = source;
    customElements.upgrade(wrapper);
    const dom = cloneChildNodes(wrapper.childNodes);
    store.set('source', source);
    store.set('dom', dom);
    return dom;
};

/**
 * Convert an HTML string to DOM nodes.
 * @param string The HTML string to conver.
 * @returns The virtual DOM template function.
 */
export const parseDOM = (string: string): Template => h(DOMParse, { source: string });

/**
 * It renders the template when then provided Thenable is in pending status.
 * @param thenable The Promise-like object.
 * @param template The template to render.
 * @returns A promise which resolves the template while the Thenable is in pending status.
 */
export const until = (thenable: Promise<unknown>, template: Template) => {
    const original = getThenableState(thenable);
    const wrapper = thenable.then(() => false).catch(() => false);
    const state = getThenableState(wrapper);
    state.result = original.pending && template;
    return wrapper;
};
