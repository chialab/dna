import { window, extend, Template, customElements, DOM, render } from '@chialab/dna';
import haunted, { GenericRenderer } from 'haunted';

/**
 * The haunted Component factory.
 */
const { component } = haunted({
    render(what, where) {
        render(what as Template, where as Node);
    },
});

/**
 * Create a hook component.
 * @param name The name of the custom element.
 * @param hookFunction The hook function.
 * @return A defined hook component.
 */
export function hook(name: string, hookFunction: GenericRenderer) {
    const BaseElement = extend(window.HTMLDivElement);
    const HookElement = component(hookFunction, {
        baseElement: BaseElement,
        useShadowDOM: false,
    }) as typeof HTMLElement;

    const HookComponent = class extends HookElement {
        connectedCallback() {
            DOM.setAttribute(this, 'is', name);
            (HookElement.prototype as any).connectedCallback.call(this);
        }
    };

    customElements.define(name, HookComponent, { extends: 'div' });
    return HookComponent;
}
