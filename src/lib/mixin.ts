import { DNACustomElement, CE_SYMBOL } from './CustomElement';
import { REGISTRY } from './registry';
import { DelegatedEventCallback, DOM } from './DOM';
import { createScope, getScope, setScope } from './Scope';
import { Template, TemplateItems } from './Template';
import { getSlotted, setSlotted } from './Slotted';
import { render } from './render';
import { defineProperty, AccessorDescriptor, AccessorObserver, getProperties } from './property';
import { html } from './html';

/**
 * Check if a Node is connected.
 *
 * @param target The target element to check.
 * @return A truthy value for connected targets.
 */
function isConnected(target: Node | null): boolean {
    if (!target || !target.nodeType) {
        return false;
    }
    const { ELEMENT_NODE, TEXT_NODE, DOCUMENT_FRAGMENT_NODE, DOCUMENT_NODE } = DOM.Node;

    let nodeType = target.nodeType;
    if (nodeType === ELEMENT_NODE || nodeType === TEXT_NODE) {
        return isConnected(target.parentNode);
    } else if (nodeType === DOCUMENT_FRAGMENT_NODE || nodeType === DOCUMENT_NODE) {
        return true;
    }

    return false;
}

/**
 * Create a base Component class which extends a native constructor.
 * @
 */
export function mixin<T extends HTMLElement = HTMLElement>(constructor: { new(): T, prototype: T }): { new(): DNACustomElement<T>, prototype: DNACustomElement<T> } {
    class Component extends (constructor as typeof HTMLElement) {
        /**
         * An unique symbol for DNA Custom elements.
         * @ignore
         */
        readonly [CE_SYMBOL] = true;

        /**
         * The tag name used for Component definition.
         */
        readonly is: string | undefined;

        /**
         * A set of properties to define to the node.
         */
        readonly properties?: {
            [key: string]: AccessorDescriptor;
        };

        /**
         * A set of delegated events to bind to the node.
         */
        readonly events?: {
            [key: string]: DelegatedEventCallback;
        };

        /**
         * A flag with the connected value of the node.
         */
        get isConnected(): boolean {
            return isConnected(this);
        }

        /**
         * A template for the Component.
         */
        get template(): Template | undefined {
            // try to detect the template searching for template tags named with the component name
            let templateElement = DOM.document.querySelector(`template[name="${this.is}"]`) as HTMLTemplateElement;
            if (!templateElement) {
                return undefined;
            }
            return html(templateElement);
        }

        /**
         * The render scope reference of the node.
         */
        get $scope() {
            return getScope(this);
        }

        /**
         * Create a new Component instance.
         * @param node Instantiate the element using the given node instead of creating a new one.
         * @param properties A set of initial properties for the element.
         */
        constructor(node?: HTMLElement | { [key: string]: any; }, properties?: { [key: string]: any; }) {
            super();

            if (!this.is) {
                throw new Error('Component has not been defined.');
            }

            if (!DOM.isElement(node)) {
                properties = node;
                const definition = REGISTRY[this.is];
                node = DOM.document.createElement(definition.extends || definition.name) as HTMLElement;
            }

            Object.setPrototypeOf(node, Object.getPrototypeOf(this));

            setScope(node, createScope(node as HTMLElement));

            let propertyDescriptors = this.properties;
            if (propertyDescriptors) {
                for (let propertyKey in propertyDescriptors) {
                    defineProperty(node as HTMLElement, propertyKey, propertyDescriptors[propertyKey]);
                }
            }

            if (properties) {
                // setup Component properties
                for (let propertyKey in properties) {
                    (node as any)[propertyKey] = properties[propertyKey];
                }
            }

            DOM.setAttribute(node as HTMLElement, 'is', this.is);

            setSlotted(node as HTMLElement, DOM.getChildNodes(node as HTMLElement) as TemplateItems);

            if (node.isConnected) {
                DOM.connect(node as Node);
            }

            return node as this;
        }

        /**
         * Invoked each time the Component is appended into a document-connected element.
         * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
         */
        connectedCallback() {
            // register events
            DOM.undelegateAllEventListeners(this);
            let eventDescriptors = this.events;
            if (eventDescriptors) {
                for (let eventPath in eventDescriptors) {
                    let match = eventPath.match(/([^\s]+)(?:\s+(.*))?/);
                    if (match) {
                        this.delegate(match[1], match[2], eventDescriptors[eventPath]);
                    }
                }
            }

            // trigger a re-render when the Node is connected
            this.render();
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
        attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: null | string) {
            const properties = getProperties(this);
            let property: AccessorDescriptor | undefined;
            for (let propertyKey in properties) {
                let prop = properties[propertyKey];
                if (prop.attribute === attributeName) {
                    property = prop;
                    break;
                }
            }
            if (property) {
                const propName = property.name as string;
                // if the attribute value is empty or it is equal to the attribute name
                // consider it as a positive boolean
                let value = (newValue === '' || newValue === attributeName) ? true : newValue;
                if ((this as any)[propName] != value) {
                    // update the Component Property value
                    (this as any)[propName] = value;
                }
            }
        }

        /**
         * Invoked each time one of the Component's properties is added, removed, or changed.
         *
         * @param propertyName The name of the changed property.
         * @param oldValue The previous value of the property.
         * @param newValue The new value for the property (undefined if removed).
         */
        propertyChangedCallback(propertyName: string, oldValue: any, newValue: any) {
            let property = getProperties(this)[propertyName];
            let attribute = property.attribute as string;
            if (attribute) {
                if (newValue == null || newValue === false) {
                    // if the Property value is falsy, remove the related attribute
                    this.removeAttribute(attribute);
                } else if (typeof newValue !== 'object') {
                    // update the related attribute value
                    this.setAttribute(attribute, newValue);
                }
            }
            if (property.observers) {
                property.observers.forEach((observer) => observer(oldValue, newValue));
            }
            this.render();
        }

        /**
         * Observe a Component Property.
         *
         * @param propertyName The name of the Property to observe
         * @param callback The callback function
         */
        observe(propertyName: string, callback: AccessorObserver) {
            let property = getProperties(this)[propertyName];
            if (!property) {
                throw new Error(`missing property ${propertyName}`);
            }
            property.observers = property.observers || [];
            property.observers.push(callback);
        }

        /**
         * Unobserve a Component Property.
         * @memberof PropertiesMixin
         *
         * @param propertyName The name of the Property to unobserve
         * @param callback The callback function to remove
         */
        unobserve(propertyName: string, callback ?: AccessorObserver) {
            let property = getProperties(this)[propertyName];
            if (!property) {
                throw new Error(`missing property ${propertyName}`);
            }
            if (callback && property.observers) {
                let io = property.observers.indexOf(callback);
                if (io !== -1) {
                    property.observers.splice(io, 1);
                }
            } else {
                property.observers = [];
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
        delegate(event: string, selector: string, callback: DelegatedEventCallback) {
            return DOM.delegateEventListener(this, event, selector, callback);
        }

        /**
         * Remove an Event delegation.
         *
         * @param eventName The Event name to undelegate
         * @param selector The selector to undelegate
         * @param callback The callback to remove
         */
        undelegate(event: string, selector: string, callback: DelegatedEventCallback) {
            return DOM.undelegateEventListener(this, event, selector, callback);
        }

        /**
         * Render method of the Component.
         *
         * @param children The children to render into the Component
         * @return The instances of the rendered Components and/or Nodes
         */
        render(children?: Template) {
            // if no children are provided use the Component template or its slotted Nodes using the upper scope
            children = children || this.template || getSlotted(this);
            if (children) {
                // trigger the Virtual DOM render
                render(this, children);
            }
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
         * @param nullVal The value to use as null value
         */
        removeAttribute(qualifiedName: string) {
            return DOM.removeAttribute(this, qualifiedName);
        }
    }

    return Component as unknown as { new(): DNACustomElement<T>, prototype: DNACustomElement<T> };
}
