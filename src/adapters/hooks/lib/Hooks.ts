import { render, Template, customElements } from '@chialab/dna';
import haunted, { GenericRenderer } from 'haunted';

const { component } = haunted({
    render(what, where) {
        render(where as HTMLElement, what as Template);
    },
});

export function hook(name : string, hookFunction: GenericRenderer) {
    const constructor = component(hookFunction);
    customElements.define(name, constructor as typeof HTMLElement, { extends: 'div'});
}
