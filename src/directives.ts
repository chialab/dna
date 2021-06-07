import type { Template } from './render';
import { getThenableState } from './Thenable';

/**
 * It renders the template when then provided Thenable is in pending status.
 * @param thenable The Promise-like object.
 * @param template The template to render.
 * @return A promise which resolves the template while the Thenable is in pending status.
 */
export const until = (thenable: Promise<unknown>, template: Template) => {
    let original = getThenableState(thenable);
    let wrapper = thenable.then(() => false).catch(() => false);
    let state = getThenableState(wrapper);
    state.result = original.pending && template;
    return wrapper;
};
