import { shim } from './shim';
import { CustomElement } from './CustomElement';

/**
 * Create a shimmed HTMLElement.
 * (in some browsers, HTMLElement construction throw errors when not shimmed).
 */
let Element = shim(HTMLElement);

/**
 * Store the base Element prototype.
 */
let Prototype = Element.prototype;

/**
 * Invoke life cycle methods by default.
 */
let lifeCycle = true;

/**
 * The abstact HTMLElement that Component extends.
 * It proxies the DOM.Element class.
 */
export class BaseElement extends Element { };

/**
 * DOM is a singleton that components uses to access DOM methods.
 * By default, it uses browsers' DOM implementation, but it can be set to use a different one.
 * For example, in a Node context it is possibile to use DNA via the `jsdom` package and updating `DOM.Text` and `DOM.Element` references.
 * It also handle element life cycle for custom elements unless otherwise specified.
 */
export const DOM = {
    /**
     * The base Text constructor.
     */
    Text,

    /**
     * The base Element constructor.
     */
    get Element() {
        return Element;
    },
    set Element(constructor) {
        Element = constructor;
        Prototype = Element.prototype;
        Object.setPrototypeOf(BaseElement, Prototype);
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
     * Check if a node is a HTMLElement instance.
     * @param node The node to check.
     * @return The node is a HTMLElement instance.
     */
    isElement(node: any): node is HTMLElement {
        return node instanceof this.Element;
    },

    /**
     * Check if a node is a Text instance.
     * @param node The node to check.
     * @return The node is a Text instance.
     */
    isText(node: any): node is Text {
        return node instanceof this.Text;
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
    createElement(tagName: string): HTMLElement {
        return document.createElement(tagName);
    },


    /**
     * Create a new DOM text node from the specified value.
     *
     * @param data The specified value.
     * @return The new DOM text instance.
     */
    createTextNode(data: string): Text {
        return document.createTextNode(data);
    },

    /**
     * Append a child to an element.
     *
     * @param parent The parent element.
     * @param newChild The child to add.
     */
    appendChild<T extends Node>(parent: HTMLElement, newChild: T): T {
        if (newChild.parentNode) {
            this.removeChild(newChild.parentNode as HTMLElement, newChild);
        }
        Prototype.appendChild.call(parent, newChild);
        this.connect(newChild);
        return newChild;
    },

    /**
     * Remove a child from an element.
     *
     * @param parent The parent element.
     * @param oldChild The child to remove.
     */
    removeChild<T extends Node>(parent: HTMLElement, oldChild: T): T {
        Prototype.removeChild.call(parent, oldChild);
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
    insertBefore<T extends Node>(parent: HTMLElement, newChild: T, refChild: Node | null): T {
        if (refChild && refChild.previousSibling === newChild) {
            return newChild;
        }
        if (newChild.parentNode) {
            this.removeChild(newChild.parentNode as HTMLElement, newChild);
        }
        Prototype.insertBefore.call(parent, newChild, refChild);
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
    replaceChild<T extends Node>(parent: HTMLElement, newChild: Node, oldChild: T): T {
        if (oldChild === newChild) {
            return oldChild;
        }
        if (newChild.parentNode) {
            this.removeChild(newChild.parentNode as HTMLElement, newChild);
        }
        Prototype.replaceChild.call(parent, newChild, oldChild);
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
    getAttribute(element: HTMLElement, qualifiedName: string): string | null {
        return Prototype.getAttribute.call(element, qualifiedName);
    },

    /**
     * Check if an element has an attribute.
     *
     * @param element The node element to check.
     * @param qualifiedName The attribute name to check.
     */
    hasAttribute(element: HTMLElement, qualifiedName: string): boolean {
        return Prototype.hasAttribute.call(element, qualifiedName);
    },

    /**
     * Add/set an attribute to an element.
     *
     * @param element The element node to update.
     * @param qualifiedName The attribute name to add/set.
     * @param value The value to set.
     */
    setAttribute(element: HTMLElement, qualifiedName: string, value: string): void {
        let oldValue = this.getAttribute(element, qualifiedName);
        Prototype.setAttribute.call(element, qualifiedName, value);
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
    removeAttribute(element: HTMLElement, qualifiedName: string) {
        let oldValue = this.getAttribute(element, qualifiedName);
        Prototype.removeAttribute.call(element, qualifiedName);
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
