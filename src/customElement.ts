import { ComponentConstructorInterface, CONSTRUCTED_SYMBOL, isConstructed } from './Interfaces';
import { customElements } from './CustomElementRegistry';

/**
 * Decorate and define component classes.
 * @param name The name of the custom element.
 * @param options The custom element options.
 * @return The decorated component class.
 */
export const customElement = (name: string, options?: ElementDefinitionOptions) =>
    (constructor: ComponentConstructorInterface<HTMLElement>) => {
        const Component = class extends constructor {
            private initProps?: { [key: string]: unknown };

            /**
             * @inheritdoc
             */
            constructor(node?: HTMLElement | { [key: string]: unknown }, properties?: { [key: string]: unknown }) {
                super(node as HTMLElement, properties as { [key: string]: unknown });
                this[CONSTRUCTED_SYMBOL] = true;
                this.initialize(this.initProps);
            }

            /**
             * @inheritdoc
             */
            initialize(props?: { [key: string]: unknown }) {
                if (!isConstructed(this)) {
                    this.initProps = props;
                    return;
                }
                return super.initialize(props);
            }
        };

        customElements.define(name, Component, options);
        return Component;
    };
