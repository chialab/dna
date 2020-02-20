import { CustomElement, CE_SYMBOL, checkNativeSupport } from './CustomElement';
import { registry } from './CustomElementRegistry';
import { setPrototypeOf } from './shim';
import { DOM, cloneChildNodes } from './DOM';
import { DelegatedEventCallback, delegateEventListener, undelegateEventListener, undelegateAllEventListeners } from './listener';
import { createScope, getScope, setScope } from './scope';
import { Template, TemplateItems } from './Template';
import { getSlotted, setSlotted } from './Slotted';
import { render } from './render';
import { defineProperty, initProperty, ClassFieldDescriptor, ClassFieldObserver, getProperties } from './property';

export type Properties = { [key: string]: any; };

/**
 * Create a base Component class which extends a native constructor.
 * @param constructor The base HTMLElement constructor to extend.
 * @return The extend class.
 */
export const mixin = <T extends HTMLElement = HTMLElement>(constructor: { new(): T, prototype: T }): { new(): CustomElement<T>, prototype: CustomElement<T> } =>
    class Component extends (constructor as typeof HTMLElement) {
        /**
         * An array containing the names of the attributes to observe.
         */
        static readonly observedAttributes: string[] = [];

        /**
         * An unique symbol for DNA Custom elements.
         * @ignore
         */
        get [CE_SYMBOL]() {
            return true;
        }

        /**
         * The tag name used for Component definition.
         */
        get is(): string {
            return '';
        }

        /**
         * A set of properties to define to the node.
         */
        readonly properties?: {
            [key: string]: ClassFieldDescriptor;
        };

        /**
         * A set of delegated events to bind to the node.
         */
        readonly listeners?: {
            [key: string]: DelegatedEventCallback;
        };

        /**
         * A set of delegated events to bind to the node.
         */
        readonly template?: HTMLTemplateElement;

        /**
         * A list of CSSStyleSheet to apply to the component.
         */
        adoptedStyleSheets?: CSSStyleSheet[];

        /**
         * A flag with the connected value of the node.
         */
        get isConnected(): boolean {
            return DOM.isConnected(this);
        }

        /**
         * The render scope reference of the node.
         */
        get $() {
            return getScope(this);
        }

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        constructor(node?: HTMLElement | Properties, properties: Properties = {}) {
            super();
            const NATIVE_SUPPORT = checkNativeSupport();
            const is = this.is;

            if (!is) {
                throw new TypeError('Illegal constructor');
            }

            let element: CustomElement<T> = node as CustomElement<T>;
            let props: Properties = properties as Properties;

            if (!DOM.isElement(element)) {
                props = node || {};
                const constructor = registry.get(is);
                const extend = constructor.prototype.extends;
                if (NATIVE_SUPPORT && !extend) {
                    element = this as unknown as CustomElement<T>;
                } else {
                    element = DOM.createElement(extend || is, {
                        is,
                        plain: true,
                    }) as CustomElement<T>;
                    DOM.setAttribute(element, 'is', is);
                }
            } else {
                DOM.setAttribute(element, 'is', is);
            }

            setPrototypeOf(element, this.constructor.prototype);
            setScope(element, createScope(element));
            setSlotted(element, cloneChildNodes(element) as TemplateItems);

            const propertyDescriptors = this.properties;
            if (propertyDescriptors) {
                for (let propertyKey in propertyDescriptors) {
                    const descriptor = propertyDescriptors[propertyKey];
                    const symbol = defineProperty(element as HTMLElement, propertyKey, descriptor);
                    if (!(propertyKey in props)) {
                        initProperty(element, symbol, descriptor);
                    }
                }
            }

            // setup Component properties
            for (let propertyKey in props) {
                (element as any)[propertyKey] = props[propertyKey];
            }

            if (element.isConnected && !NATIVE_SUPPORT) {
                DOM.connect(element);
            }

            return element as unknown as this;
        }

        /**
         * Invoked each time the Component is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback() {
            // register events
            undelegateAllEventListeners(this);
            const listenerDescriptors = this.listeners;
            if (listenerDescriptors) {
                for (let eventPath in listenerDescriptors) {
                    let match = eventPath.match(/([^\s]+)(?:\s+(.*))?/);
                    if (match) {
                        this.delegateEventListener(match[1], match[2], listenerDescriptors[eventPath]);
                    }
                }
            }

            // trigger a re-render when the Node is connected
            this.forceUpdate();
        }

        /**
         * Invoked each time the Component is disconnected from the document's DOM.
         */
        disconnectedCallback() {
            //
        }

        /**
         * Invoked each time one of the Component's attributes is added, removed, or changed.
         *
         * @param attributeName The name of the updated attribute.
         * @param oldValue The previous value of the attribute.
         * @param newValue The new value for the attribute (null if removed).
         */
        attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: string | null) {
            const properties = getProperties(this.constructor);

            let property: ClassFieldDescriptor | undefined;
            for (let propertyKey in properties) {
                let prop = properties[propertyKey];
                if (prop.attribute) {
                    if (prop.attribute === attributeName) {
                        property = prop;
                        break;
                    }
                    continue;
                } else if ((prop.name as string) === attributeName) {
                    property = prop;
                    break;
                }
            }

            if (!property) {
                return;
            }

            const types = property.types as Function[];
            let value: any;
            if (types.indexOf(Boolean) !== -1 && (!newValue || newValue === attributeName)) {
                if (newValue === '' || newValue === attributeName) {
                    // if the attribute value is empty or it is equal to the attribute name consider it as a boolean
                    value = true;
                } else {
                    value = false;
                }
            } else if (newValue) {
                try {
                    value = JSON.parse(newValue as string);
                } catch {
                    value = newValue;
                }
            } else {
                value = newValue;
            }

            // update the Component Property value
            (this as any)[property.name as string] = value;
        }

        /**
         * Invoked each time one of the Component's properties is added, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        propertyChangedCallback(propertyName: string, oldValue: any, newValue: any) {
            const constructor = this.constructor as typeof Component;
            const observedAttributes = constructor.observedAttributes;
            const falsy = newValue == null || newValue === false;
            const property = getProperties(constructor)[propertyName];

            const propAttribute = property.attribute || observedAttributes.indexOf(property.name as string) !== -1;
            if (!propAttribute) {
                return;
            }

            const computedAttribute = (propAttribute === true ? property.name : propAttribute) as string;
            // update the bound attribute
            if (falsy) {
                // a falsy value should remove the attribute
                this.removeAttribute(computedAttribute);
            } else if (typeof newValue !== 'object') {
                // if the value is `true` should set an empty attribute, otherwise just set the value
                this.setAttribute(computedAttribute, newValue === true ? '' : newValue);
            }
        }

        /**
         * Observe a Component Property.
         *
         * @param propertyName The name of the Property to observe
         * @param callback The callback function
         */
        observe(propertyName: string, callback: ClassFieldObserver) {
            const property = getProperties(this.constructor)[propertyName];
            if (!property) {
                throw new Error(`missing property ${propertyName}`);
            }
            const observers = property.observers as Function[];
            observers.push(callback);
        }

        /**
         * Unobserve a Component Property.
         *
         * @param propertyName The name of the Property to unobserve
         * @param callback The callback function to remove
         */
        unobserve(propertyName: string, callback: ClassFieldObserver) {
            const property = getProperties(this.constructor)[propertyName];
            if (!property) {
                throw new Error(`missing property ${propertyName}`);
            }
            const observers = property.observers as Function[];
            const io = observers.indexOf(callback);
            if (io !== -1) {
                observers.splice(io, 1);
            }
        }

        /**
         * Dispatch a custom Event.
         *
         * @param event The event to dispatch or the name of the synthetic event to create.
         * @param detail Detail object of the event.
         * @param bubbles Should the event bubble.
         * @param cancelable Should the event be cancelable.
         * @param composed Is the event composed.
         */
        dispatchEvent(event: Event): boolean; /* eslint-disable-line no-dupe-class-members */
        dispatchEvent(event: string, detail?: CustomEventInit, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean; /* eslint-disable-line no-dupe-class-members */
        dispatchEvent(event: Event | string, detail?: CustomEventInit, bubbles?: boolean, cancelable?: boolean, composed?: boolean) { /* eslint-disable-line no-dupe-class-members */
            return DOM.dispatchEvent(this, event as string, detail, bubbles, cancelable, composed);
        }

        /**
         * Delegate an Event listener.
         *
         * @param eventName The event name to listen
         * @param selector The selector to delegate
         * @param callback The callback to trigger when an Event matches the delegation
         */
        delegateEventListener(event: string, selector: string, callback: DelegatedEventCallback) {
            return delegateEventListener(this, event, selector, callback);
        }

        /**
         * Remove an Event delegation.
         *
         * @param eventName The Event name to undelegate
         * @param selector The selector to undelegate
         * @param callback The callback to remove
         */
        undelegateEventListener(event: string, selector: string, callback: DelegatedEventCallback) {
            return undelegateEventListener(this, event, selector, callback);
        }

        /**
         * Render method of the Component.
         *
         * @return The instances of the rendered Components and/or Nodes
         */
        render(): Template {
            // if no children are provided use the Component template or its slotted Nodes using the upper scope
            return this.template || getSlotted(this);
        }

        /**
         * Force an element to re-render.
         */
        forceUpdate() {
            render(this, this.render());
        }

        /**
         * Append a child to the Component.
         *
         * @param newChild The child to add
         */
        appendChild<T extends Node>(newChild: T): T {
            return DOM.appendChild(this, newChild);
        }

        /**
         * Remove a child from the Component.
         *
         * @param {Node} oldChild The child to remove
         */
        removeChild<T extends Node>(oldChild: T): T {
            return DOM.removeChild(this, oldChild);
        }

        /**
         * Insert a child before another in the Component.
         *
         * @param newChild The child to insert
         * @param refChild The referred Node
         */
        insertBefore<T extends Node>(newChild: T, refChild: Node | null): T {
            return DOM.insertBefore(this, newChild, refChild);
        }

        /**
         * Replace a child with another in the Component.
         *
         * @param newChild The child to insert
         * @param oldChild The Node to replace
         */
        replaceChild<T extends Node>(newChild: Node, oldChild: T): T {
            return DOM.replaceChild(this, newChild, oldChild);
        }

        /**
         * Set a Component attribute.
         *
         * @param ualifiedName The attribute name
         * @param value The value to set
         */
        setAttribute(qualifiedName: string, value: string) {
            return DOM.setAttribute(this, qualifiedName, value);
        }

        /**
         * Remove a Component attribute.
         *
         * @param qualifiedName The attribute name
         */
        removeAttribute(qualifiedName: string) {
            return DOM.removeAttribute(this, qualifiedName);
        }
    } as unknown as { new(): CustomElement<T>, prototype: CustomElement<T> };


/**
 * The DNA base Component constructor, a Custom Element constructor with
 * declarative properties and event delegations, custom template and
 * a complete life cycle implementation.
 * All DNA components **must** extends this class.
 */
export const Component = mixin(DOM.get('HTMLElement'));
