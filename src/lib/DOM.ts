import { isCustomElement, checkNativeSupport } from './CustomElement';
import { registry } from './CustomElementRegistry';

type GlobalNamespace = Window & typeof globalThis;

/**
 * Collect proxied HTMLElement constructors.
 */
const PROXIES: { [key: string]: typeof HTMLElement } = {};

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
 * Create a shim Constructor for Element constructors, in order to extend and instantiate them programmatically,
 * because using `new HTMLElement()` in browsers throw `Illegal constructor`.
 *
 * @param base The constructor or the class to shim.
 * @return A newable constructor with the same prototype.
 */
export const shim = <T extends typeof HTMLElement>(base: T): T => {
    const shim = function(this: any, ...args: any[]) {
        try {
            if (!(new.target as any).extends) {
                return Reflect.construct(base, args, new.target);
            }
        } catch {
            //
        }

        const constructor = this.constructor;
        const is = this.is;
        const extend = constructor.extends;

        if (!is) {
            throw new TypeError('Illegal constructor');
        }

        const element = DOM.document.createElement(extend || is) as HTMLElement;
        if (extend) {
            element.setAttribute('is', is);
        }
        Object.setPrototypeOf(element, constructor.prototype);
        return element;
    } as any as T;
    shim.prototype = base.prototype;
    return shim;
};


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
     * The adapter Document constructor.
     */
    get Document() {
        return this.window.Document;
    },

    /**
     * The adapter Node constructor.
     */
    get Node() {
        return this.window.Node;
    },

    /**
     * The adapter Text constructor.
     */
    get Text() {
        return this.window.Text;
    },

    /**
     * The adapter HTMLElement constructor.
     */
    get HTMLElement() {
        return this.window.HTMLElement;
    },

    /**
     * The adapter Event constructor.
     */
    get Event() {
        return this.window.Event;
    },

    /**
     * The adapter CustomEvent constructor.
     */
    get CustomEvent() {
        return this.window.CustomEvent;
    },

    /**
     * Check if a node is a Document instance.
     * @param node The node to check.
     * @return The node is a Document instance.
     */
    isDocument(node: any): node is Document {
        return node && node instanceof this.Document;
    },

    /**
     * Check if a node is a Node instance.
     * @param node The node to check.
     * @return The node is a Node instance.
     */
    isNode(node: any): node is Node {
        return node && node instanceof this.Node;
    },

    /**
     * Check if a node is a Text instance.
     * @param node The node to check.
     * @return The node is a Text instance.
     */
    isText(node: any): node is Text {
        return node && node instanceof this.Text;
    },

    /**
     * Check if a node is an Element instance.
     * @param node The node to check.
     * @return The node is an Element instance.
     */
    isElement(node: any): node is HTMLElement {
        return node && node instanceof this.HTMLElement;
    },

    /**
     * Check if an object is an Event instance.
     * @param node The node to check.
     * @return The object is an Event instance.
     */
    isEvent(event: any): event is Event {
        return event && event instanceof this.Event;
    },

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
        const NATIVE_SUPPORT = checkNativeSupport();
        if (!NATIVE_SUPPORT) {
            if (newChild.parentNode) {
                this.removeChild(newChild.parentNode as Element, newChild);
            }
        }
        this.Node.prototype.appendChild.call(parent, newChild);
        if (!NATIVE_SUPPORT) {
            this.connect(newChild);
        }
        return newChild;
    },

    /**
     * Remove a child from an element.
     *
     * @param parent The parent element.
     * @param oldChild The child to remove.
     */
    removeChild<T extends Node>(parent: Element, oldChild: T): T {
        const NATIVE_SUPPORT = checkNativeSupport();
        this.Node.prototype.removeChild.call(parent, oldChild);
        if (!NATIVE_SUPPORT) {
            this.disconnect(oldChild);
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
    insertBefore<T extends Node>(parent: Element, newChild: T, refChild: Node | null): T {
        const NATIVE_SUPPORT = checkNativeSupport();
        if (!NATIVE_SUPPORT) {
            if (newChild.parentNode) {
                this.removeChild(newChild.parentNode as Element, newChild);
            }
        }
        this.Node.prototype.insertBefore.call(parent, newChild, refChild);
        if (!NATIVE_SUPPORT) {
            this.connect(newChild);
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
    replaceChild<T extends Node>(parent: Element, newChild: Node, oldChild: T): T {
        const NATIVE_SUPPORT = checkNativeSupport();
        if (!NATIVE_SUPPORT) {
            if (newChild.parentNode && newChild !== oldChild && newChild.parentNode !== parent) {
                this.removeChild(newChild.parentNode as Element, newChild);
            }
        }
        this.Node.prototype.replaceChild.call(parent, newChild, oldChild);
        if (!NATIVE_SUPPORT) {
            this.disconnect(oldChild);
            this.connect(newChild);
        }
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
        const oldValue = this.getAttribute(element, qualifiedName);
        this.HTMLElement.prototype.setAttribute.call(element, qualifiedName, value);

        const observedAttributes = (element.constructor as Function & { observedAttributes?: string[] }).observedAttributes || [];
        if (isCustomElement(element) &&
            !checkNativeSupport() &&
            observedAttributes.indexOf(qualifiedName) !== -1) {
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
        const oldValue = this.getAttribute(element, qualifiedName);
        this.HTMLElement.prototype.removeAttribute.call(element, qualifiedName);

        const observedAttributes = (element.constructor as Function & { observedAttributes?: string[] }).observedAttributes || [];
        if (isCustomElement(element) &&
            !checkNativeSupport() &&
            observedAttributes.indexOf(qualifiedName) !== -1) {
            element.attributeChangedCallback(qualifiedName, oldValue, null);
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
        if (this.isElement(target) || this.isText(target)) {
            return this.isConnected(target.parentNode);
        }
        if (this.isDocument(target)) {
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
        if (checkNativeSupport()) {
            return;
        }
        const previousNodes = cloneChildNodes(node) || [];
        if (isCustomElement(node)) {
            node.connectedCallback();
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
        if (checkNativeSupport()) {
            return;
        }
        const previousNodes = cloneChildNodes(node) || [];
        if (isCustomElement(node)) {
            node.disconnectedCallback();
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

    /**
     * Get a native HTMLElement constructor by its name.
     * @param name The name of the constructor (eg. "HTMLAnchorElement").
     * @return A proxy that extends the native constructor (if available).
     */
    get(name: 'HTMLElement'): typeof HTMLElement {
        if (PROXIES[name]) {
            return PROXIES[name];
        }
        const constructor = this.window[name];
        return PROXIES[name] = class extends shim(constructor) {};
    },
};
