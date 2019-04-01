import * as registry from './lib/registry';
import { AbstractElement, DOM } from './lib/dom';
import { Template, render, getScope, setScope, createScope, getSlotted, setSlotted, TemplateItem } from './lib/render';
import { AccessorDescriptors, defineProperty, AccessorDescriptor, AccessorObserver, getProperties } from './lib/property';
import { html } from './lib/html';
import { EventCallback, EventDescriptors, delegate, undelegate } from './lib/events';

const { ELEMENT_NODE, TEXT_NODE, DOCUMENT_FRAGMENT_NODE, DOCUMENT_NODE } = Node;

function isConnected(element: Node | null): boolean {
    if (!element || !element.nodeType) {
        return false;
    }
    let nodeType = element.nodeType;
    if (nodeType === ELEMENT_NODE || nodeType === TEXT_NODE) {
        return isConnected(element.parentNode);
    } else if (nodeType === DOCUMENT_FRAGMENT_NODE || nodeType === DOCUMENT_NODE) {
        return true;
    }

    return false;
}

export class Component extends AbstractElement {
    readonly properties?: AccessorDescriptors;
    readonly events?: EventDescriptors;
    readonly is: string | undefined;

    get isConnected(): boolean {
        return isConnected(this);
    }

    get template(): Template | undefined {
        // try to detect the template searching for template tags named with the component name
        let templateElement = document.querySelector(`template[name="${this.is}"]`) as HTMLTemplateElement;
        if (!templateElement) {
            return undefined;
        }
        return html(templateElement);
    }

    get $scope() {
        return getScope(this);
    }

    constructor(nodeOrProperties?: HTMLElement | { [key: string]: any; }, properties?: { [key: string]: any; }) {
        super();

        if (!this.is) {
            throw new Error('Component has not been defined.');
        }

        let node: HTMLElement;
        if (!DOM.isElement(nodeOrProperties)) {
            properties = nodeOrProperties;
            const definition = registry.get(this.is as string);
            node = DOM.createElement(definition.extends || definition.name) as HTMLElement;
        } else {
            node = nodeOrProperties as HTMLElement;
        }

        Object.setPrototypeOf(node, Object.getPrototypeOf(this));

        setScope(node, createScope(node));

        let propertyDescriptors = this.properties;
        if (propertyDescriptors) {
            for (let propertyKey in propertyDescriptors) {
                defineProperty(node, propertyKey, propertyDescriptors[propertyKey]);
            }
        }

        if (properties) {
            // setup Component properties
            for (let propertyKey in properties) {
                (node as any)[propertyKey] = properties[propertyKey];
            }
        }

        DOM.setAttribute(node, 'is', this.is);

        setSlotted(node, DOM.getChildNodes(node) as TemplateItem[]);

        return node as Component;
    }

    connectedCallback() {
        // register events
        this.undelegate();
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

    disconnectedCallback() {
        // empty the Node content when disconnected
        this.render([]);
    }

    attributeChangedCallback(attributeName: string, oldValue: null | string, newValue: null | string) {
        let property: AccessorDescriptor | undefined;
        let properties = getProperties(this);
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

    delegate(event: string, selector: string, callback: EventCallback) {
        return delegate(this, event, selector, callback);
    }

    undelegate(event?: string, selector?: string, callback?: EventCallback) {
        return undelegate(this, event, selector, callback);
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

