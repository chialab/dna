import { shim } from './shim';
import { CustomElement } from './CustomElement';
import { REGISTRY } from './registry';

/**
 * Invoke life cycle methods by default.
 */
let lifeCycle = true;

let ShimElement: typeof HTMLElement = (typeof HTMLElement !== 'undefined') ? shim(HTMLElement) : (class {} as typeof HTMLElement);

/**
 * The abstact HTMLElement that Component extends.
 * It proxies the DOM.Element class.
 */
export class BaseElement extends ShimElement { }

/**
 * DOM is a singleton that components uses to access DOM methods.
 * By default, it uses browsers' DOM implementation, but it can be set to use a different one.
 * For example, in a Node context it is possibile to use DNA via the `jsdom` package and updating `DOM.Text` and `DOM.Element` references.
 * It also handle element life cycle for custom elements unless otherwise specified.
 */
export const DOM = {
    /**
     * The document global instance.
     */
    document: (typeof document !== 'undefined' ? document : undefined) as Document,

    /**
     * The base Node constructor.
     */
    Node: (typeof Node !== 'undefined' ? Node : undefined) as typeof Node,

    /**
     * The base Text constructor.
     */
    Text: (typeof Text !== 'undefined' ? Text : undefined) as typeof Text,

    /**
     * The base Event constructor.
     */
    Event: (typeof Event !== 'undefined' ? Event : undefined) as typeof Event,

    /**
     * The base CustomEvent constructor.
     */
    CustomEvent: (() => {
        if (typeof CustomEvent === 'undefined') {
            return;
        }
        try {
            new CustomEvent('test');
            return CustomEvent;
        } catch {
            const CustomEventPolyfill = function(eventName: string, params: CustomEventInit = {}) {
                const event = DOM.document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, params.bubbles || false, params.cancelable || false, params.detail);
                return event;
            };
            CustomEventPolyfill.prototype = CustomEvent.prototype;
            return CustomEventPolyfill;
        }
    })() as typeof CustomEvent,

    /**
     * The base HTMLElement constructor.
     */
    get HTMLElement() {
        return ShimElement;
    },
    set HTMLElement(constructor: typeof HTMLElement) {
        Object.setPrototypeOf(ShimElement.prototype, constructor.prototype);
        ShimElement = constructor;
    },

    /**
     * Set the life cycle mode for DNA.
     * Disable it (`DOM.useLifeCycle(false)`) if you want to use native Custom Element's.
     * @param use Should invoke or not life cycle methods.
     */
    useLifeCycle(use: boolean = true) {
        lifeCycle = !!use;
    },

    /**
     * Check if a node is an Element instance.
     * @param node The node to check.
     * @return The node is an Element instance.
     */
    isElement(node: any): node is Element {
        return node && node.nodeType === this.Node.ELEMENT_NODE;
    },

    /**
     * Check if a node is a Text instance.
     * @param node The node to check.
     * @return The node is a Text instance.
     */
    isText(node: any): node is Text {
        return node && node.nodeType === this.Node.TEXT_NODE;
    },

    /**
     * Check if a node is a Custom Element instance.
     * @param node The node to check.
     * @return The node is a Custom Element instance.
     */
    isCustomElement(node: any): node is CustomElement {
        return node instanceof BaseElement;
    },

    /**
     * Parse a HTML string into a list of DOM nodes.
     *
     * @param source The HTML string to parse.
     * @return The list of generated nodes.
     */
    parse(source: string): NodeList {
        let wrapper = this.createElement('div');
        wrapper.innerHTML = source;
        return wrapper.childNodes;
    },

    /**
     * Create a new DOM element node for the specified tag.
     *
     * @param tagName The specified tag.
     * @return The new DOM element instance.
     */
    createElement(tagName: string): Element {
        const definition = REGISTRY[tagName.toLowerCase()];
        if (!definition) {
            return this.document.createElement(tagName);
        }
        const node = this.document.createElement(definition.extends || definition.name);
        return new definition.constructor(node);
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
     * Append a child to an element.
     *
     * @param parent The parent element.
     * @param newChild The child to add.
     */
    appendChild<T extends Node>(parent: Element, newChild: T): T {
        if (newChild.parentNode) {
            this.removeChild(newChild.parentNode as Element, newChild);
        }
        this.HTMLElement.prototype.appendChild.call(parent, newChild);
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
        this.HTMLElement.prototype.removeChild.call(parent, oldChild);
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
        if (refChild && refChild.previousSibling === newChild) {
            return newChild;
        }
        if (newChild.parentNode) {
            this.removeChild(newChild.parentNode as Element, newChild);
        }
        this.HTMLElement.prototype.insertBefore.call(parent, newChild, refChild);
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
        if (oldChild === newChild) {
            return oldChild;
        }
        if (newChild.parentNode) {
            this.removeChild(newChild.parentNode as Element, newChild);
        }
        this.HTMLElement.prototype.replaceChild.call(parent, newChild, oldChild);
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
        let oldValue = this.getAttribute(element, qualifiedName);
        this.HTMLElement.prototype.setAttribute.call(element, qualifiedName, value);
        if (lifeCycle && this.isCustomElement(element)) {
            element.attributeChangedCallback(qualifiedName, oldValue, value);
        }
    },

    /**
     * Remove an element's attribute.
     *
     * @param element The element node to update.
     * @param qualifiedName The attribute name to remove.
     */
    removeAttribute(element: Element, qualifiedName: string) {
        let oldValue = this.getAttribute(element, qualifiedName);
        this.HTMLElement.prototype.removeAttribute.call(element, qualifiedName);
        if (lifeCycle && this.isCustomElement(element)) {
            element.attributeChangedCallback(qualifiedName, oldValue, null);
        }
    },

    /**
     * Get child nodes for a node.
     *
     * @param node The parent node.
     * @return An array of child nodes (if available).
     */
    getChildNodes(node: Node): ReadonlyArray<Node> | undefined {
        if (!node.childNodes) {
            return undefined;
        }
        let childNodes: Node[] = [];
        for (let i = 0, len = node.childNodes.length; i < len; i++) {
            childNodes.push(node.childNodes[i]);
        }
        return childNodes;
    },

    /**
     * Invoke `connectedCallback` method of a Node (and its descendents).
     * It does nothing if life cycle is disabled.
     *
     * @param node The connected node.
     */
    connect(node: Node) {
        if (!lifeCycle) {
            return;
        }
        let previousNodes = this.getChildNodes(node) || [];
        if (this.isCustomElement(node)) {
            node.connectedCallback();
        }
        let children = this.getChildNodes(node);
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
        if (!lifeCycle) {
            return;
        }
        let previousNodes = this.getChildNodes(node) || [];
        if (this.isCustomElement(node)) {
            node.disconnectedCallback();
        }
        let children = this.getChildNodes(node);
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
