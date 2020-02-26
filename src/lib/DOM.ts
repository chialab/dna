import { CustomElement } from './CustomElement';
import { registry } from './CustomElementRegistry';

type GlobalNamespace = Window & typeof globalThis;

/**
 * Make a readonly copy of the child nodes collection.
 * @param node The parent node.
 * @return A frozen list of child nodes.
 */
export const cloneChildNodes = (node: Node): ReadonlyArray<Node> => {
    const children = node.childNodes || [];
    return [].map.call(children, (child) => child) as ReadonlyArray<Node>;
};

/**
 * Check if a node is a Document instance.
 * @param node The node to check.
 * @return The node is a Document instance.
 */
export const isDocument = (node: any): node is Document => node && node.nodeType === DOM.Node.DOCUMENT_NODE;

/**
 * Check if a node is a Text instance.
 * @param node The node to check.
 * @return The node is a Text instance.
 */
export const isText = (node: any): node is Text => node && node.nodeType === DOM.Node.TEXT_NODE;

/**
 * Check if a node is an Element instance.
 * @param node The node to check.
 * @return The node is an Element instance.
 */
export const isElement = (node: any): node is HTMLElement => node && node.nodeType === DOM.Node.ELEMENT_NODE;

/**
 * Check if an object is an Event instance.
 * @param node The node to check.
 * @return The object is an Event instance.
 */
export const isEvent = (event: any): event is Event => event instanceof DOM.Event;

/**
 * DOM is a singleton that components uses to access DOM methods.
 * By default, it uses browsers' DOM implementation, but it can be set to use a different one.
 * For example, in a Node context it is possibile to use DNA via the `jsdom` package and updating `this.Text` and `this.Element` references.
 * It also handle element life cycle for custom elements unless otherwise specified.
 */
export const DOM = {
    /**
     * The window instance.
     */
    window: (typeof window !== 'undefined' ? window : undefined) as GlobalNamespace,

    /**
     * The document instance.
     */
    document: (typeof document !== 'undefined' ? document : undefined) as Document,

    /**
     * Check if the environment should emulate Custom Elements life cycle.
     */
    emulate: typeof customElements === 'undefined',

    /**
     * The adapter Document constructor.
     */
    Document: (typeof Document !== 'undefined' ? Document : undefined) as typeof Document,

    /**
     * The adapter Node constructor.
     */
    Node: (typeof Node !== 'undefined' ? Node : undefined) as typeof Node,

    /**
     * The adapter Text constructor.
     */
    Text: (typeof Text !== 'undefined' ? Text : undefined) as typeof Text,

    /**
     * The adapter HTMLElement constructor.
     */
    HTMLElement: (typeof HTMLElement !== 'undefined' ? HTMLElement : undefined) as typeof HTMLElement,

    /**
     * The adapter Event constructor.
     */
    Event: (typeof Event !== 'undefined' ? Event : undefined) as typeof Event,

    /**
     * The adapter CustomEvent constructor.
     */
    CustomEvent: (typeof CustomEvent !== 'undefined' ? CustomEvent : undefined) as typeof CustomEvent,

    /**
     * Create a new DOM element node for the specified tag.
     *
     * @param tagName The specified tag.
     * @return The new DOM element instance.
     */
    createElement(tagName: string, options?: ElementCreationOptions): Element {
        const is = options && options.is;
        const name = is || tagName.toLowerCase();
        const node = this.document.createElement(tagName);
        const constructor = registry.get(name);
        if (constructor && !(node instanceof constructor)) {
            new constructor(node);
        }
        return node;
    },

    /**
     * Create a new DOM element node for the specified tag using a namespace.
     *
     * @param namespaceURI The namespace of the tag.
     * @param tagName The specified tag.
     * @return The new DOM element instance.
     */
    createElementNS(namespaceURI: string, tagName: string): Element {
        return this.document.createElementNS(namespaceURI, tagName);
    },

    /**
     * Create a new DOM text node from the specified value.
     *
     * @param data The specified value.
     * @return The new DOM text instance.
     */
    createTextNode(data: string): Text {
        return this.document.createTextNode(data);
    },

    /**
     * Instantiate an Event.
     * @param typeArg The name of the event.
     * @param eventInitDict A set of options for the event, such as detail and bubbling.
     */
    createEvent(typeArg: string, eventInitDict: CustomEventInit<unknown> = {}): CustomEvent<unknown> {
        let event;
        try {
            event = new this.CustomEvent(typeArg, eventInitDict);
        } catch {
            event = this.document.createEvent('CustomEvent');
            event.initCustomEvent(typeArg, eventInitDict.bubbles || false, eventInitDict.cancelable || false, eventInitDict.detail);
        }
        return event;
    },

    /**
     * Append a child to an element.
     *
     * @param parent The parent element.
     * @param newChild The child to add.
     */
    appendChild<T extends Node>(parent: Element, newChild: T): T {
        if (this.emulate) {
            if (newChild.parentNode) {
                this.removeChild(newChild.parentNode as Element, newChild);
            }
        }
        this.Node.prototype.appendChild.call(parent, newChild);
        this.connect(newChild);
        return newChild;
    },

    /**
     * Remove a child from an element.
     *
     * @param parent The parent element.
     * @param oldChild The child to remove.
     */
    removeChild<T extends Node>(parent: Element, oldChild: T): T {
        this.Node.prototype.removeChild.call(parent, oldChild);
        this.disconnect(oldChild);
        return oldChild;
    },

    /**
     * Insert a child before another in an element.
     *
     * @param parent The parent element.
     * @param newChild The child to insert.
     * @param refChild The referred node.
     */
    insertBefore<T extends Node>(parent: Element, newChild: T, refChild: Node | null): T {
        if (this.emulate) {
            if (newChild.parentNode) {
                this.removeChild(newChild.parentNode as Element, newChild);
            }
        }
        this.Node.prototype.insertBefore.call(parent, newChild, refChild);
        this.connect(newChild);
        return newChild;
    },

    /**
     * Replace a child with another in an element.
     *
     * @param parent The parent element.
     * @param newChild The child to insert.
     * @param oldChild The node to replace.
     */
    replaceChild<T extends Node>(parent: Element, newChild: Node, oldChild: T): T {
        if (this.emulate) {
            if (newChild.parentNode && newChild !== oldChild && newChild.parentNode !== parent) {
                this.removeChild(newChild.parentNode as Element, newChild);
            }
        }
        this.Node.prototype.replaceChild.call(parent, newChild, oldChild);
        this.disconnect(oldChild);
        this.connect(newChild);
        return oldChild;
    },

    /**
     * Get a Component attribute.
     *
     * @param element The node element
     * @param qualifiedName The attribute name
     */
    getAttribute(element: Element, qualifiedName: string): string | null {
        return this.HTMLElement.prototype.getAttribute.call(element, qualifiedName);
    },

    /**
     * Check if an element has an attribute.
     *
     * @param element The node element to check.
     * @param qualifiedName The attribute name to check.
     */
    hasAttribute(element: Element, qualifiedName: string): boolean {
        return this.HTMLElement.prototype.hasAttribute.call(element, qualifiedName);
    },

    /**
     * Add/set an attribute to an element.
     *
     * @param element The element node to update.
     * @param qualifiedName The attribute name to add/set.
     * @param value The value to set.
     */
    setAttribute(element: Element, qualifiedName: string, value: string): void {
        const emulate = this.emulate &&
            typeof (element as CustomElement).attributeChangedCallback === 'function' &&
            (element.constructor as any).observedAttributes.indexOf(qualifiedName) !== -1;
        const oldValue = emulate && this.getAttribute(element, qualifiedName);
        this.HTMLElement.prototype.setAttribute.call(element, qualifiedName, value);

        if (emulate) {
            (element as CustomElement).attributeChangedCallback(qualifiedName, oldValue as string, value);
        }
    },

    /**
     * Remove an element's attribute.
     *
     * @param element The element node to update.
     * @param qualifiedName The attribute name to remove.
     */
    removeAttribute(element: Element, qualifiedName: string) {
        const emulate = this.emulate &&
            typeof (element as CustomElement).attributeChangedCallback === 'function' &&
            (element.constructor as any).observedAttributes.indexOf(qualifiedName) !== -1;
        const oldValue = emulate && this.getAttribute(element, qualifiedName);
        this.HTMLElement.prototype.removeAttribute.call(element, qualifiedName);

        if (emulate) {
            (element as CustomElement).attributeChangedCallback(qualifiedName, oldValue as string, null);
        }
    },

    /**
     * The method checks to see if the Element would be selected by the provided selectorString.
     * @param selectorString The selector to match.
     */
    matches(element: Element, selectorString: string): boolean {
        const match = this.HTMLElement.prototype.matches || this.HTMLElement.prototype.webkitMatchesSelector || (this.HTMLElement.prototype as any).msMatchesSelector as typeof Element.prototype.matches;
        return match.call(element, selectorString);
    },

    /**
     * Check if a Node is connected.
     *
     * @param target The target element to check.
     * @return A truthy value for connected targets.
     */
    isConnected(target: Node | null): boolean {
        if (isElement(target) || isText(target)) {
            return this.isConnected(target.parentNode);
        }
        if (isDocument(target)) {
            return true;
        }

        return false;
    },

    /**
     * Invoke `connectedCallback` method of a Node (and its descendents).
     * It does nothing if life cycle is disabled.
     *
     * @param node The connected node.
     */
    connect(node: Node) {
        if (!this.emulate) {
            return;
        }
        const previousNodes = cloneChildNodes(node) || [];
        if (typeof (node as CustomElement).connectedCallback === 'function') {
            (node as CustomElement).connectedCallback();
        }
        const children = cloneChildNodes(node);
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                let child = children[i];
                if (previousNodes.indexOf(child) !== -1) {
                    this.connect(child);
                }
            }
        }
    },

    /**
     * Invoke `disconnectedCallback` method of a Node (and its descendents).
     * It does nothing if life cycle is disabled.
     *
     * @param node The disconnected node.
     */
    disconnect(node: Node) {
        if (!this.emulate) {
            return;
        }
        const previousNodes = cloneChildNodes(node) || [];
        if (typeof (node as CustomElement).disconnectedCallback === 'function') {
            (node as CustomElement).disconnectedCallback();
        }
        const children = cloneChildNodes(node);
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                let child = children[i];
                if (previousNodes.indexOf(child) !== -1) {
                    this.disconnect(child);
                }
            }
        }
    },
};
