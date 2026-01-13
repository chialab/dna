import { type ComponentConstructor, type ComponentInstance, isComponentConstructor, isInitialized } from './Component';
import { decoratedEvents, decoratedListeners, defineListener, type EventHandler, staticListeners } from './events';
import { defineProperty as _defineProperty, type ClassDescriptor, getPrototypeOf, hasOwn, isBrowser } from './helpers';
import {
    decoratedObservers,
    decoratedPropertiesDeclarations,
    defineObserver,
    defineProperty,
    type PropertyDeclaration,
    staticPropertiesDeclarations,
} from './property';

/**
 * Finalize a component constructor.
 * @param name The name of the custom element.
 * @param ctr The component class to define.
 * @param options The custom element options.
 * @returns The decorated component class.
 * @throws If the name has already been registered.
 * @throws An error if the component is already defined.
 */
function finalize<T extends ComponentInstance, C extends ComponentConstructor<T>>(
    name: string,
    ctr: C,
    options?: ElementDefinitionOptions
) {
    class Component extends (ctr as ComponentConstructor) {
        constructor(node?: HTMLElement) {
            super(node);
            if (new.target === Component && !isInitialized(this)) {
                this.initialize();
            }
        }
    }

    try {
        if (ctr.name) {
            _defineProperty(Component, 'name', {
                writable: false,
                configurable: false,
                value: ctr.name,
            });
        }
        if (hasOwn.call(ctr, Symbol.metadata)) {
            // ensure metadata is inherited
            _defineProperty(Component, Symbol.metadata, {
                writable: false,
                configurable: true,
                value: ctr[Symbol.metadata],
            });
        }
        _defineProperty(Component, 'tagName', {
            writable: false,
            configurable: false,
            value: options?.extends || name,
        });
        _defineProperty(Component.prototype, 'is', {
            configurable: false,
            get: () => name,
            set: () => {
                // do nothing, the is property is read-only, but no errors will be thrown
            },
        });
    } catch {
        throw new Error(
            'The registry already contains an entry with the constructor (or is otherwise already defined)'
        );
    }

    return Component as C;
}

/**
 * Define a component class.
 * @param name The name of the custom element.
 * @param ctr The component class to define.
 * @param options The custom element options.
 * @returns The decorated component class.
 * @throws If the name has already been registered.
 * @throws An error if the component is already defined.
 */
export function define<T extends ComponentInstance, C extends ComponentConstructor<T>>(
    name: string,
    ctr: C,
    options?: ElementDefinitionOptions,
    finalizeConstructor = true
) {
    const handled = new Set<string>();
    const Component = finalizeConstructor ? finalize(name, ctr, options) : ctr;
    const prototype = Component.prototype as T;
    let currentCtr = Component;
    while (isComponentConstructor(currentCtr)) {
        for (const [propertyKey, declaration] of staticPropertiesDeclarations(currentCtr)) {
            if (handled.has(propertyKey)) {
                continue;
            }
            defineProperty(
                prototype,
                propertyKey,
                declaration as PropertyDeclaration<T[typeof propertyKey]>,
                undefined,
                true
            );
            handled.add(propertyKey);
        }

        for (const [propertyKey, declaration] of decoratedPropertiesDeclarations(currentCtr)) {
            if (handled.has(propertyKey)) {
                continue;
            }
            defineProperty(prototype, propertyKey, declaration as PropertyDeclaration<T[typeof propertyKey]>);
            handled.add(propertyKey);
        }

        for (const [propertyKey, eventName] of decoratedEvents(currentCtr)) {
            const key: unique symbol = Symbol();
            _defineProperty(prototype, propertyKey, {
                get(this: Element & { [key]?: EventHandler }) {
                    return this[key] ?? null;
                },
                set(this: Element & { [key]?: EventHandler }, value: EventHandler) {
                    const actualListener = this[key];
                    this[key] = value;
                    if (actualListener) {
                        this.removeEventListener(eventName, actualListener);
                    }
                    if (value) {
                        this.addEventListener(eventName, value);
                    }
                },
            });
        }

        for (const [event, selector, callback, options] of staticListeners(currentCtr)) {
            defineListener(prototype, event, selector, callback, options);
        }

        for (const [event, selector, callback, options] of decoratedListeners(currentCtr)) {
            defineListener(prototype, event, selector, callback, options);
        }

        for (const [propertyKey, observer] of decoratedObservers(currentCtr)) {
            defineObserver(prototype, propertyKey, observer);
        }

        currentCtr = getPrototypeOf(currentCtr);
    }

    if (isBrowser) {
        if (Component.globalStyles) {
            const entries = Array.isArray(Component.globalStyles) ? Component.globalStyles : [Component.globalStyles];
            for (const entry of entries) {
                if (typeof entry === 'string') {
                    const style = document.createElement('style');
                    style.textContent = entry;
                    document.head.appendChild(style);
                } else if (!document.adoptedStyleSheets.includes(entry)) {
                    document.adoptedStyleSheets.push(entry);
                }
            }
        }
        customElements.define(name, Component, options);
    }

    return Component as C;
}

/**
 * Decorate and define a component class.
 * @param name The name of the custom element.
 * @param options The custom element options.
 * @returns The decorated component class.
 */
export const customElement =
    (name: string, options?: ElementDefinitionOptions) =>
    // biome-ignore lint/suspicious/noExplicitAny: TypeScript complains about return type because we handle babel output
    <T extends ComponentConstructor>(classOrDescriptor: T, context?: ClassDecoratorContext): any => {
        if (typeof context === 'object') {
            // standard decorator
            if (context.kind !== 'class') {
                throw new TypeError('The @customElement decorator can be used only on classes');
            }
            const ctr = finalize(name, classOrDescriptor, options);
            context.addInitializer(() => {
                define(name, ctr, options, false);
            });
            return ctr;
        }

        if (typeof classOrDescriptor === 'function') {
            // typescript
            return define(name, classOrDescriptor, options);
        }

        // spec 2
        const { kind, elements } = classOrDescriptor as ClassDescriptor<T, unknown>;
        return {
            kind,
            elements,
            finisher(ctr: T) {
                return define(name, ctr, options);
            },
        };
    };
