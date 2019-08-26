import { createSymbolKey } from './symbols';
import { isCustomElement } from './CustomElement';
import { REGISTRY } from './registry';
import { shim } from './shim';

/**
 * The global namespace.
 */
const GLOBAL_NS = (() => {
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    return {};
})() as {
    document?: Document,
    Node?: typeof Node,
    Text?: typeof Text,
    Element?: typeof Element,
    Event?: typeof Event,
    CustomEvent?: typeof CustomEvent,
} & {
    [key: string]: typeof HTMLElement;
};

/**
 * Collect native HTMLElement constructors.
 */
const CONSTRUCTORS: { [key: string]: typeof HTMLElement } = {};

/**
 * Collect proxied HTMLElement constructors.
 */
const PROXIES: { [key: string]: typeof HTMLElement } = {};

/**
 * A Symbol which contains all Node delegation.
 */
const EVENT_CALLBACKS_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * Describe the signature of a delegated event callback.
 * @param event The original DOM event.
 * @param target The matched delegated element.
 */
export type DelegatedEventCallback = (event: Event, target?: Node) => any;

/**
 * A descriptor for an event delegation.
 */
type DelegatedEventDescriptor = {
    /**
     * The name of the delegated event.
     */
    event: string;
    /**
     * The callback for the delegated event.
     */
    callback: DelegatedEventCallback;
    /**
     * The selector for the delegated event.
     */
    selector: string;
};

/**
 * A collector for event delegations.
 */
type DelegationList = {
    /**
     * A list of delegation descriptors.
     */
    descriptors: DelegatedEventDescriptor[],
    /**
     * The real event listener.
     */
    listener: EventListenerOrEventListenerObject;
}

/**
 * An object with event delegations.
 */
type WithEventDelegations = {
    [EVENT_CALLBACKS_SYMBOL]?: {
        [key: string]: DelegationList;
    };
}

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
    document: GLOBAL_NS.document as Document,

    /**
     * The base Node constructor.
     */
    Node: GLOBAL_NS.Node as typeof Node,

    /**
     * The base Text constructor.
     */
    Text: GLOBAL_NS.Text as typeof Text,

    /**
     * The base Element constructor.
     */
    Element: GLOBAL_NS.Element as typeof Element,

    /**
     * The base Event constructor.
     */
    Event: GLOBAL_NS.Event as typeof Event,

    /**
     * The base CustomEvent constructor.
     */
    CustomEvent: (() => {
        if (!GLOBAL_NS.CustomEvent) {
            return;
        }
        try {
            new GLOBAL_NS.CustomEvent('test');
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
     * Check if a node is an Element instance.
     * @param node The node to check.
     * @return The node is an Element instance.
     */
    isElement(node: any): node is Element {
        return node && node instanceof this.Element;
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
        if (refChild && refChild.previousSibling === newChild) {
            return newChild;
        }
        if (newChild.parentNode) {
            this.removeChild(newChild.parentNode as Element, newChild);
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
        if (oldChild === newChild) {
            return oldChild;
        }
        if (newChild.parentNode) {
            this.removeChild(newChild.parentNode as Element, newChild);
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
        return this.Element.prototype.getAttribute.call(element, qualifiedName);
    },

    /**
     * Check if an element has an attribute.
     *
     * @param element The node element to check.
     * @param qualifiedName The attribute name to check.
     */
    hasAttribute(element: Element, qualifiedName: string): boolean {
        return this.Element.prototype.hasAttribute.call(element, qualifiedName);
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
        this.Element.prototype.setAttribute.call(element, qualifiedName, value);
        if (isCustomElement(element)) {
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
        this.Element.prototype.removeAttribute.call(element, qualifiedName);
        if (isCustomElement(element)) {
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
        let previousNodes = this.getChildNodes(node) || [];
        if (isCustomElement(node)) {
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
        let previousNodes = this.getChildNodes(node) || [];
        if (isCustomElement(node)) {
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

    /**
     * Get a native HTMLElement constructor by its name.
     * @param name The name of the constructor (eg. "HTMLAnchorElement").
     * @return A proxy that extends the native constructor (if available).
     */
    get(name: string): typeof HTMLElement {
        if (PROXIES[name]) {
            return PROXIES[name];
        }
        if (!CONSTRUCTORS[name]) {
            if (GLOBAL_NS[name]) {
                CONSTRUCTORS[name] = shim(GLOBAL_NS[name]);
            } else {
                CONSTRUCTORS[name] = class { } as typeof HTMLElement;
            }
        }
        PROXIES[name] = class extends CONSTRUCTORS[name] { };
        return PROXIES[name];
    },

    /**
     * Define a native HTMLElement constructor. It also update already getted proxy classes prototype.
     * @param name The name of the constructor (eg. "HTMLAnchorElement").
     * @param constructor The constructor function reference.
     * @return A proxy that extends the native constructor (if available).
     */
    define<T extends typeof HTMLElement = typeof HTMLElement>(name: string, constructor: T): T {
        constructor = CONSTRUCTORS[name] = shim(constructor);
        if (PROXIES[name]) {
            Object.setPrototypeOf(
                Object.getPrototypeOf(PROXIES[name]).prototype,
                constructor.prototype
            );
        }
        return constructor;
    },

    /**
     * Delegate an Event listener.
     *
     * @param element The root element for the delegation
     * @param eventName The event name to listen
     * @param selector The selector to delegate
     * @param callback The callback to trigger when an Event matches the delegation
     * @param options An options object that specifies characteristics about the event listener. @see [MDN]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener}
     */
    delegateEventListener(element: Node, eventName: string, selector: string, callback: DelegatedEventCallback, options?: AddEventListenerOptions) {
        const delegatedElement: Node & WithEventDelegations = element;
        if (!(element instanceof this.Node)) {
            throw new TypeError('The provided element is not a Node');
        }
        if (typeof eventName !== 'string') {
            throw new TypeError('The provided event name is not a string');
        }
        if (typeof selector !== 'string') {
            throw new TypeError('The provided selector is not a string');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('The provided callback is not a function');
        }
        // get all delegations
        const delegations = delegatedElement[EVENT_CALLBACKS_SYMBOL] = delegatedElement[EVENT_CALLBACKS_SYMBOL] || {};
        // initialize the delegation list
        const callbacks: DelegationList = delegations[eventName] = delegations[eventName] || {
            descriptors: [],
        };
        const descriptors = callbacks.descriptors;
        // check if the event has already been delegated
        if (!callbacks.listener) {
            // setup the listener
            callbacks.listener = (ev) => {
                if (!ev.target) {
                    return;
                }
                const PROTOTYPE = this.Element.prototype;
                const ELEMENT_NODE = this.Node.ELEMENT_NODE;
                const MATCH = PROTOTYPE.matches ||
                    PROTOTYPE.webkitMatchesSelector ||
                    (PROTOTYPE as any).msMatchesSelector as typeof HTMLElement.prototype.matches;
                const eventTarget = ev.target as Node;
                // wrap the Event's stopPropagation in order to prevent other delegations from the same root
                let stopped = false;
                ev.stopPropagation = () => {
                    stopped = true;
                    // exec the real stopPropagation method
                    return Event.prototype.stopPropagation.call(ev);
                };
                ev.stopImmediatePropagation = () => {
                    stopped = true;
                    // exec the real stopPropagation method
                    return Event.prototype.stopImmediatePropagation.call(ev);
                };

                // filter matched selector for the event
                let filtered: { target: Node; callback: DelegatedEventCallback; }[] = [];
                for (let i = 0; i < descriptors.length; i++) {
                    let { selector, callback } = descriptors[i];
                    let selectorTarget;
                    if (selector) {
                        let target = eventTarget;
                        while (target && target !== element) {
                            if (target.nodeType === ELEMENT_NODE && MATCH.call(target, selector)) {
                                selectorTarget = target;
                                break;
                            }
                            target = target.parentNode as Node;
                        }
                    } else {
                        selectorTarget = element;
                    }
                    if (selectorTarget) {
                        filtered.push({
                            target: selectorTarget,
                            callback,
                        });
                    }
                }

                filtered
                    // reorder targets by position in the dom tree.
                    .sort(({ target: target1 }, { target: target2 }) => (target1.contains(target2) ? 1 : -1))
                    // trigger the callback
                    .forEach(({ callback, target }) => {
                        if (!stopped) {
                            callback.call(element, ev, target);
                        }
                    });
            };
            element.addEventListener(eventName, callbacks.listener, options);
        }
        // add the delegation to the list
        descriptors.push({ event: eventName, callback, selector });
    },

    /**
     * Remove an Event delegation.
     *
     * @param element The root element of the delegation
     * @param eventName The Event name to undelegate
     * @param selector The selector to undelegate
     * @param callback The callback to remove
     */
    undelegateEventListener(element: Node, eventName: string, selector: string, callback: DelegatedEventCallback) {
        if (!(element instanceof this.Node)) {
            throw new TypeError('The provided element is not a Node');
        }
        if (typeof eventName !== 'string') {
            throw new TypeError('The provided event name is not a string');
        }
        if (typeof selector !== 'string') {
            throw new TypeError('The provided selector is not a string');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('The provided callback is not a function');
        }

        const delegatedElement: Node & WithEventDelegations = element;
        // get all delegations
        const delegations = delegatedElement[EVENT_CALLBACKS_SYMBOL];
        if (!delegations) {
            return;
        }
        if (!(eventName in delegations)) {
            return;
        }
        const { descriptors, listener } = delegations[eventName];
        // get the list of delegations
        // find the index of the callback to remove in the list
        for (let i = 0; i < descriptors.length; i++) {
            let descriptor = descriptors[i];
            if (descriptor.selector === selector && descriptor.callback === callback) {
                descriptors.splice(i, 1);
                if (descriptors.length === 0) {
                    element.removeEventListener(eventName, listener);
                }
            }
        }
    },

    /**
     * Remove all event delegations.
     * @param element The root element of the delegation
     */
    undelegateAllEventListeners(element: Node) {
        if (!(element instanceof this.Node)) {
            throw new TypeError('The provided element is not a Node');
        }

        const delegatedElement: Node & WithEventDelegations = element;
        // get all delegations
        const delegations = delegatedElement[EVENT_CALLBACKS_SYMBOL];

        if (!delegations) {
            return;
        }
        for (let eventName in delegations) {
            const { descriptors } = delegations[eventName];
            descriptors.slice(0).forEach((descriptor) => {
                this.undelegateEventListener(element, eventName, descriptor.selector, descriptor.callback);
            });
        }
    },

    /**
     * Dispatch a custom Event.
     *
     * @param event The event to dispatch or the name of the synthetic event to create.
     * @param detail Detail object of the event.
     * @param bubbles Should the event bubble.
     * @param cancelable Should the event be cancelable.
     * @param composed Is the event composed.
     */
    dispatchEvent(element: Node, event: Event | string, detail?: CustomEventInit, bubbles: boolean = true, cancelable: boolean = true, composed?: boolean): boolean {
        if (!(element instanceof this.Node)) {
            throw new TypeError('The provided element is not a Node');
        }

        if (typeof event === 'string') {
            if (typeof bubbles !== 'boolean') {
                throw new TypeError('The provided bubbles option is not a boolean');
            }
            if (typeof cancelable !== 'boolean') {
                throw new TypeError('The provided cancelable option is not a boolean');
            }
            if (typeof composed !== 'undefined' && typeof composed !== 'boolean') {
                throw new TypeError('The provided composed option is not a boolean');
            }

            event = new this.CustomEvent(event, {
                detail,
                bubbles,
                cancelable,
                composed,
            });
        } else if (!(event instanceof DOM.Event)) {
            throw new TypeError('The provided event is not an Event');
        }

        return this.Node.prototype.dispatchEvent.call(element, event);
    },
};
