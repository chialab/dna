import { shouldEmulateLifeCycle } from './CustomElement';
import { registry } from './CustomElementRegistry';

/**
 * Make a readonly copy of the child nodes collection.
 * @param node The parent node.
 * @return A frozen list of child nodes.
 */
export const cloneChildNodes = (node: Node): ReadonlyArray<Node> => [].slice.call(node.childNodes || [], 0) as ReadonlyArray<Node>;

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
 * Check if a Node is connected.
 *
 * @param node The target element to check.
 * @return A truthy value for connected targets.
 */
export const isConnected = (node: Node | null): boolean => {
    if (isElement(node) || isText(node)) {
        return isConnected(node.parentNode);
    }
    if (isDocument(node)) {
        return true;
    }

    return false;
};

/**
 * Invoke `connectedCallback` method of a Node (and its descendents).
 * It does nothing if life cycle is disabled.
 *
 * @param node The connected node.
 */
export const connect = (node: Node) => {
    if (!isElement(node)) {
        return;
    }
    let children = cloneChildNodes(node);
    if (shouldEmulateLifeCycle(node)) {
        node.connectedCallback();
        children = cloneChildNodes(node);
    }
    if (children) {
        for (let i = 0, len = children.length; i < len; i++) {
            connect(children[i]);
        }
    }
};

/**
 * Invoke `disconnectedCallback` method of a Node (and its descendents).
 * It does nothing if life cycle is disabled.
 *
 * @param node The disconnected node.
 */
export const disconnect = (node: Node) => {
    if (!isElement(node)) {
        return;
    }
    let children = cloneChildNodes(node);
    if (shouldEmulateLifeCycle(node)) {
        node.disconnectedCallback();
        children = cloneChildNodes(node);
    }
    if (children) {
        for (let i = 0, len = children.length; i < len; i++) {
            disconnect(children[i]);
        }
    }
};

/**
 * DOM is a singleton that components uses to access DOM methods.
 * By default, it uses browsers' DOM implementation, but it can be set to use a different one.
 * For example, in a Node context it is possibile to use DNA via the `jsdom` package and updating `this.Text` and `this.Element` references.
 * It also handle element life cycle for custom elements unless otherwise specified.
 */
export const DOM = {
    /**
     * Should emulate life cycle.
     */
    emulateLifeCycle: typeof customElements === 'undefined',
    /**
     * The window instance.
     */
    window: (typeof window !== 'undefined' ? window : undefined) as Window & typeof globalThis,

    /**
     * The document instance.
     */
    document: (typeof document !== 'undefined' ? document : undefined) as Document,

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
        const node = DOM.document.createElement(tagName);
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
        return DOM.document.createElementNS(namespaceURI, tagName);
    },

    /**
     * Create a new DOM text node from the specified value.
     *
     * @param data The specified value.
     * @return The new DOM text instance.
     */
    createTextNode(data: string): Text {
        return DOM.document.createTextNode(data);
    },

    /**
     * Instantiate an Event.
     * @param typeArg The name of the event.
     * @param eventInitDict A set of options for the event, such as detail and bubbling.
     */
    createEvent(typeArg: string, eventInitDict: CustomEventInit<unknown> = {}): CustomEvent<unknown> {
        let event;
        try {
            event = new DOM.CustomEvent(typeArg, eventInitDict);
        } catch {
            event = DOM.document.createEvent('CustomEvent');
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
        const appendChild = DOM.Node.prototype.appendChild;
        if (!DOM.emulateLifeCycle) {
            return appendChild.call(parent, newChild) as T;
        }
        if (newChild.parentNode) {
            DOM.removeChild(newChild.parentNode as Element, newChild);
        }
        appendChild.call(parent, newChild);
        connect(newChild);
        return newChild;
    },

    /**
     * Remove a child from an element.
     *
     * @param parent The parent element.
     * @param oldChild The child to remove.
     */
    removeChild<T extends Node>(parent: Element, oldChild: T): T {
        const removeChild = DOM.Node.prototype.removeChild;
        if (!DOM.emulateLifeCycle) {
            return removeChild.call(parent, oldChild) as T;
        }
        removeChild.call(parent, oldChild);
        disconnect(oldChild);
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
        const insertBefore = DOM.Node.prototype.insertBefore;
        if (!DOM.emulateLifeCycle) {
            return insertBefore.call(parent, newChild, refChild) as T;
        }
        if (newChild.parentNode) {
            DOM.removeChild(newChild.parentNode as Element, newChild);
        }
        insertBefore.call(parent, newChild, refChild);
        connect(newChild);
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
        const replaceChild = DOM.Node.prototype.replaceChild;
        if (!DOM.emulateLifeCycle) {
            return replaceChild.call(parent, newChild, oldChild) as T;
        }
        if (newChild.parentNode && newChild !== oldChild && newChild.parentNode !== parent) {
            DOM.removeChild(newChild.parentNode as Element, newChild);
        }
        replaceChild.call(parent, newChild, oldChild);
        disconnect(oldChild);
        connect(newChild);
        return oldChild;
    },

    /**
     * Get a Component attribute.
     *
     * @param element The node element
     * @param qualifiedName The attribute name
     */
    getAttribute(element: Element, qualifiedName: string): string | null {
        return DOM.HTMLElement.prototype.getAttribute.call(element, qualifiedName);
    },

    /**
     * Check if an element has an attribute.
     *
     * @param element The node element to check.
     * @param qualifiedName The attribute name to check.
     */
    hasAttribute(element: Element, qualifiedName: string): boolean {
        return DOM.HTMLElement.prototype.hasAttribute.call(element, qualifiedName);
    },

    /**
     * Add/set an attribute to an element.
     *
     * @param element The element node to update.
     * @param qualifiedName The attribute name to add/set.
     * @param value The value to set.
     */
    setAttribute(element: Element, qualifiedName: string, value: string): void {
        const setAttribute = DOM.HTMLElement.prototype.setAttribute;
        if (shouldEmulateLifeCycle(element)) {
            const constructor = element.constructor;
            const observed = (constructor as any).observedAttributes.indexOf(qualifiedName) !== -1;
            if (!observed) {
                return setAttribute.call(element, qualifiedName, value);
            }

            const oldValue = DOM.getAttribute(element, qualifiedName);
            setAttribute.call(element, qualifiedName, value);
            element.attributeChangedCallback(qualifiedName, oldValue as string, value);
            return;
        }
        return setAttribute.call(element, qualifiedName, value);
    },

    /**
     * Remove an element's attribute.
     *
     * @param element The element node to update.
     * @param qualifiedName The attribute name to remove.
     */
    removeAttribute(element: Element, qualifiedName: string) {
        const removeAttribute = DOM.HTMLElement.prototype.removeAttribute;
        if (shouldEmulateLifeCycle(element)) {
            const constructor = element.constructor;
            const observed = (constructor as any).observedAttributes.indexOf(qualifiedName) !== -1;
            if (!observed) {
                return removeAttribute.call(element, qualifiedName);
            }

            const oldValue = DOM.getAttribute(element, qualifiedName);
            removeAttribute.call(element, qualifiedName);
            element.attributeChangedCallback(qualifiedName, oldValue as string, null);
        }
        return removeAttribute.call(element, qualifiedName);
    },

    /**
     * The method checks to see if the Element would be selected by the provided selectorString.
     * @param selectorString The selector to match.
     */
    matches(element: Element, selectorString: string): boolean {
        const match = DOM.HTMLElement.prototype.matches || DOM.HTMLElement.prototype.webkitMatchesSelector || (DOM.HTMLElement.prototype as any).msMatchesSelector as typeof Element.prototype.matches;
        return match.call(element, selectorString);
    },
};
