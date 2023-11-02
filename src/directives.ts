import { h, type FunctionComponent, type Template } from './JSX';
import { getObservableState, type Observable } from './Observable';
import { getThenableState } from './Thenable';

/**
 * Convert an HTML string to DOM nodes.
 * @param string The HTML string to conver.
 * @returns The virtual DOM template function.
 */
export const $parse = (string: string): Template =>
    h(
        (props, context) => {
            const source = props.source;
            const store = context.store;

            if (store.get('source') === source) {
                return store.get('dom') as Node[];
            }

            const parser = new DOMParser();
            const fragment = parser.parseFromString(source, 'text/html').body;
            customElements.upgrade(fragment);
            const dom = Array.from(fragment.childNodes);
            store.set('source', source);
            store.set('dom', dom);
            return dom;
        },
        { source: string }
    );

/**
 * Render a promise when it is resolved.
 * @param thenable The Promise-like object.
 * @returns The virtual DOM template function.
 */
export const $await = (thenable: Promise<unknown>) =>
    h(
        ((props, context) => {
            const state = getThenableState(thenable);
            if (state.pending) {
                thenable
                    .catch(() => 1)
                    .then(() => {
                        context.requestUpdate();
                    });
            }
            return state.result as Template;
        }) as FunctionComponent,
        null
    );

/**
 * It renders the template when then provided Thenable is in pending status.
 * @param thenable The Promise-like object.
 * @param template The template to render.
 * @returns A promise which resolves the template while the Thenable is in pending status.
 */
export const $until = (thenable: Promise<unknown>, template: Template) => {
    const original = getThenableState(thenable);
    const wrapper = thenable.then(() => false).catch(() => false);
    const state = getThenableState(wrapper);
    state.result = original.pending && template;
    return $await(wrapper);
};

/**
 * Pipe observable value to the template.
 * @param observable The observable to pipe.
 * @returns The virtual DOM template function.
 */
export const $pipe = (observable: Observable<unknown>) =>
    h((props, context) => {
        const status = getObservableState(observable);
        if (!status.complete) {
            const subscription = observable.subscribe(
                () => {
                    if (!context.requestUpdate()) {
                        subscription.unsubscribe();
                    }
                },
                () => {
                    if (!context.requestUpdate()) {
                        subscription.unsubscribe();
                    }
                },
                () => {
                    subscription.unsubscribe();
                }
            );
        }
        return status.current as Template;
    }, null);
