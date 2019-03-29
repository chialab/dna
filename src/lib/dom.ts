import { shim } from './shim';
import { CustomElement } from './CustomElement';

let Element = shim(HTMLElement);
let Prototype = Element.prototype;
let lifeCycle = true;

/**
 * The abstact HTMLElement that Component extends.
 * It proxies the DOM.Element class.
 * @private
 */
export const AbstractElement = class extends Element { };

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
        Object.setPrototypeOf(AbstractElement, Prototype);
    },

    useLifeCycle(use = true) {
        lifeCycle = !!use;
    },

    isElement(node: any): node is HTMLElement {
        return node instanceof this.Element;
    },

    isText(node: any): node is Text {
        return node instanceof this.Text;
    },

    isCustomElement(node: any): node is CustomElement {
        return node instanceof AbstractElement;
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
        if (lifeCycle && this.isCustomElement(newChild)) {
            newChild.connectedCallback();
        }
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
        if (lifeCycle && this.isCustomElement(oldChild)) {
            oldChild.disconnectedCallback();
        }
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
        if (lifeCycle && this.isCustomElement(newChild)) {
            newChild.connectedCallback();
        }
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
        if (lifeCycle) {
            if (this.isCustomElement(oldChild)) {
                oldChild.disconnectedCallback();
            }
            if (this.isCustomElement(newChild)) {
                newChild.connectedCallback();
            }
        }
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
};
