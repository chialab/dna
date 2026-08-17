import { type FunctionComponent, h, type Template } from './JSX';
import type { ReadonlySignal } from './Signal';
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
 * The signal renderer.
 * It subscribes to the signal and re-renders its own fragment (and only that) on change.
 * @param props The properties of the component.
 * @returns The current value of the signal.
 */
const SignalFunction: FunctionComponent<{ signal: ReadonlySignal }> = ({ signal }, { useSignalValue }) =>
    useSignalValue(signal) as Template;

/**
 * Render the value of a signal and keep it up to date.
 * Signals interpolated in a template are wrapped by this directive automatically.
 * @param signal The signal to render.
 * @returns The virtual DOM template function.
 */
export const $signal = (signal: ReadonlySignal): Template => h(SignalFunction, { signal });

/**
 * Render a promise when it is resolved.
 * @param thenable The Promise-like object.
 * @returns The virtual DOM template function.
 */
export const $await = (thenable: Promise<unknown>): Template =>
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
export const $until = (thenable: Promise<unknown>, template: Template): Template => {
    const original = getThenableState(thenable);
    const wrapper = thenable.then(() => false).catch(() => false);
    const state = getThenableState(wrapper);
    state.result = original.pending && template;
    return $await(wrapper);
};
