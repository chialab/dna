import { h, type FunctionComponent, type Template } from './JSX';
import { getThenableState } from './Thenable';

/**
 * The parser function.
 * @param props The properties of the component.
 * @param hooks The hooks.
 * @param hooks.useMemo The hook to create a memoized value.
 * @returns The parsed DOM nodes.
 */
const ParseFunction: FunctionComponent<{ source: string }> = (props, { useMemo }) =>
    useMemo<ChildNode[] | null>(() => {
        const parser = new DOMParser();
        const fragment = parser.parseFromString(props.source, 'text/html').body;
        customElements.upgrade(fragment);

        return Array.from(fragment.childNodes);
    }, [props.source]);

/**
 * Convert an HTML string to DOM nodes.
 * @param string The HTML string to conver.
 * @returns The virtual DOM template function.
 */
export const $parse = (string: string): Template => h(ParseFunction, { source: string });

/**
 * Render a promise when it is resolved.
 * @param thenable The Promise-like object.
 * @returns The virtual DOM template function.
 */
export const $await = (thenable: Promise<unknown>) =>
    h(
        ((props, { useState, useMemo }) => {
            const state = getThenableState(thenable);
            return useMemo(() => {
                const [result, setResult] = useState<Template | null>(state.result);
                if (state.pending) {
                    thenable
                        .catch(() => 1)
                        .then(() => {
                            setResult(state.result);
                        });
                }
                return result as Template;
            }, [thenable, state.pending]);
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
