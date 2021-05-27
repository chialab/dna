
import type { ClassElement } from './ClassElement';
import type { Constructor, ComponentConstructor } from './Component';
import { CONSTRUCTED_SYMBOL, isConstructed } from './Component';
import { customElements } from './CustomElementRegistry';

/**
 * The class descriptor interface.
 */
export type ClassDescriptor = {
    kind: 'class';
    elements: ClassElement[];
    finisher?: <T>(constructor: { new(): T }) => undefined | { new(): T };
}

/**
 * Decorate and define component classes.
 * @param name The name of the custom element.
 * @param options The custom element options.
 * @return The decorated component class.
 */
export const customElement = (name: string, options?: ElementDefinitionOptions) =>
    // TypeScript complains about return type because we handle babel output
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (classOrDescriptor: ComponentConstructor<HTMLElement>|ClassDescriptor): any => {
        const upgrade = (constructor: ComponentConstructor<HTMLElement>) => {
            const Component = class extends constructor {
                /**
                 * Store constructor properties.
                 */
                private initProps?: { [key: string]: unknown };

                /**
                 * @inheritdoc
                 */
                constructor(...args: any[]) {
                    // So sorry about this, but I can't get it working otherwise
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    super(...args);
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
            return Component as typeof classOrDescriptor;
        };

        if (typeof classOrDescriptor === 'function') {
            // typescript
            return upgrade(classOrDescriptor);
        }

        // spec 2
        const { kind, elements } = classOrDescriptor;
        return {
            kind,
            elements,
            finisher<T extends HTMLElement>(constructor: Constructor<T>) {
                return upgrade(constructor as ComponentConstructor<T>);
            },
        };
    };
