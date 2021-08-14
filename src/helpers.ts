import type { IterableNodeList } from './types';
import type { ComponentInstance } from './Component';
import { window } from './window';

let symbols = 0;

/**
 * Create a symbolic key.
 * When native Symbol is not defined, compute an unique string key.
 * @return An unique key.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createSymbol = (description?: string | number): any => {
    /* c8 ignore start */
    if (typeof Symbol !== 'undefined') {
        return Symbol(description);
    }
    return `__dna${symbols++}`;
    /* c8 ignore stop */
};

export const {
    Node: NodeConstructor,
    HTMLElement: HTMLElementConstructor,
    Event: EventConstructor,
    CustomEvent: CustomEventConstructor,
    document,
} = window;
export const { DOCUMENT_NODE, TEXT_NODE, COMMENT_NODE, ELEMENT_NODE } = NodeConstructor;

/**
 * Alias to Array.isArray.
 */
export const isArray = Array.isArray;

/**
 * Alias Array.prototype.indexOf.
 */
export const indexOf = Array.prototype.indexOf;

/**
 * Alias to Object.getOwnPropertyDescriptor.
 */
export const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

/**
 * Like Object.getOwnPropertyDescriptor, but for all the property chain.
 */
export const getPropertyDescriptor = (...args: Parameters<typeof getOwnPropertyDescriptor>): ReturnType<typeof getOwnPropertyDescriptor> => {
    if (!args[0]) {
        return;
    }
    return getOwnPropertyDescriptor(...args) || getPropertyDescriptor(getPrototypeOf(args[0]), args[1]);
};

/**
 * Alias to Object.setPrototypeOf.
 */
export const getPrototypeOf = Object.getPrototypeOf;

/**
 * Alias to Object.setPrototypeOf.
 */
export const setPrototypeOf = Object.setPrototypeOf || ((obj, proto) => { obj.__proto__ = proto; });

/**
 * Alias to Object.prototype.toString.
 */
export const toString = Object.prototype.toString;

/**
 * Alias to Object.prototype.hasOwnProperty.
 */
export const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Alias to Object.defineProperty.
 */
export const defineProperty = Object.defineProperty;

/**
 * Alias to Node.prototype.appendChild.
 */
export const appendChildImpl = NodeConstructor.prototype.appendChild;

/**
 * Alias to Node.prototype.removeChild.
 */
export const removeChildImpl = NodeConstructor.prototype.removeChild;

/**
 * Alias to Node.prototype.insertBefore.
 */
export const insertBeforeImpl = NodeConstructor.prototype.insertBefore;

/**
 * Alias to Node.prototype.replaceChild.
 */
export const replaceChildImpl = NodeConstructor.prototype.replaceChild;

/**
 * Alias to HTMLElement.prototype.insertAdjacentElement.
 */
export const insertAdjacentElementImpl = HTMLElementConstructor.prototype.insertAdjacentElement;

/**
 * Alias to Node.prototype.isConnected.
 */
export const isConnectedImpl = getOwnPropertyDescriptor(NodeConstructor.prototype, 'isConnected');

/**
 * Alias to HTMLElement.prototype.getAttribute.
 */
export const getAttributeImpl = HTMLElementConstructor.prototype.getAttribute;

/**
 * Alias to HTMLElement.prototype.hasAttribute.
 */
export const hasAttributeImpl = HTMLElementConstructor.prototype.hasAttribute;

/**
 * Alias to HTMLElement.prototype.setAttribute.
 */
export const setAttributeImpl = HTMLElementConstructor.prototype.setAttribute;

/**
 * Alias to HTMLElement.prototype.removeAttribute.
 */
export const removeAttributeImpl = HTMLElementConstructor.prototype.removeAttribute;

/**
 * Alias to HTMLElement.prototype.matches.
 */
export const matchesImpl = HTMLElementConstructor.prototype.matches ||
    HTMLElementConstructor.prototype.webkitMatchesSelector ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (HTMLElementConstructor.prototype as any).msMatchesSelector;

/**
 * Alias to document.createDocumentFragment.
 */
export const createDocumentFragmentImpl = document.createDocumentFragment.bind(document);

/**
 * Alias to document.createElement.
 */
export const createElementImpl = document.createElement.bind(document);

/**
 * Alias to document.createElementNS.
 */
export const createElementNSImpl = document.createElementNS.bind(document);

/**
 * Alias to document.createTextNode.
 */
export const createTextNodeImpl = document.createTextNode.bind(document);

/**
 * Alias to document.createComment.
 */
export const createCommentImpl = document.createComment.bind(document);

/**
 * Create a Custom Event.
 * @param typeArg The name of the event.
 * @param eventInitDict The options of the event.
 * @return The constructed Custom Event.
 */
export const createEventImpl = (typeArg: string, eventInitDict: CustomEventInit<unknown> = {}): CustomEvent<unknown> => {
    let event;
    try {
        event = new CustomEventConstructor(typeArg, eventInitDict);
    } catch {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(typeArg, eventInitDict.bubbles || false, eventInitDict.cancelable || false, eventInitDict.detail);
    }
    return event;
};

/**
 * Check if the target is a Node instance.
 * @param target The target to check.
 * @return The target is a Node instance.
 */
export const isNode = (target: unknown): target is Node => target instanceof NodeConstructor;

/**
 * Check if a node is a Document instance.
 * @param node The node to check.
 * @return The node is a Document instance.
 */
export const isDocument = (node: Node): node is Document => node && node.nodeType === DOCUMENT_NODE;

/**
 * Check if a node is a Text instance.
 * @param node The node to check.
 * @return The node is a Text instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isText = (node: any): node is Text => node && node.nodeType === TEXT_NODE;

/**
 * Check if a node is an Element instance.
 * @param node The node to check.
 * @return The node is an Element instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isElement = <T extends Element>(node: any): node is T => node && node.nodeType === ELEMENT_NODE;

/**
 * Check if an object is an Event instance.
 * @param node The node to check.
 * @return The object is an Event instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEvent = (event: any): event is Event => event instanceof EventConstructor;

/**
 * Check if a Node is connected.
 *
 * @return A truthy value for connected targets.
 */
export const isConnected: (this: Node) => boolean = isConnectedImpl ?
    (isConnectedImpl.get as (this: Node) => boolean) :
    function(this: Node): boolean {
        if (isElement(this) || isText(this)) {
            const parent = this.parentNode;
            if (!parent) {
                return false;
            }
            return isConnected.call(parent);
        }
        if (isDocument(this)) {
            return true;
        }

        return false;
    };

/**
 * A symbol which identify emulated components.
 */
const EMULATE_LIFECYCLE_SYMBOL: unique symbol = createSymbol();

type WithEmulatedLifecycle<T extends Element> = T & {
    [EMULATE_LIFECYCLE_SYMBOL]?: boolean;
};

/**
 * Check if a node require emulated life cycle.
 * @param node The node to check.
 */
export const shouldEmulateLifeCycle = (node: WithEmulatedLifecycle<Element>) => !!node[EMULATE_LIFECYCLE_SYMBOL];

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
    if (shouldEmulateLifeCycle(node)) {
        (node as ComponentInstance<HTMLElement>).connectedCallback();
    }
    const children = cloneChildNodes(node.childNodes);
    for (let i = 0, len = children.length; i < len; i++) {
        connect(children[i]);
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
    if (shouldEmulateLifeCycle(node)) {
        (node as ComponentInstance<HTMLElement>).disconnectedCallback();
    }
    const children = cloneChildNodes(node.childNodes);
    for (let i = 0, len = children.length; i < len; i++) {
        disconnect(children[i]);
    }
};

/**
 * Should emulate life cycle.
 */
let lifeCycleEmulation = typeof window.customElements === 'undefined';

/**
 * Flag the element for life cycle emulation.
 */
export const emulateLifeCycle = (node: WithEmulatedLifecycle<HTMLElement>) => {
    lifeCycleEmulation = true;
    node[EMULATE_LIFECYCLE_SYMBOL] = true;
};

/**
 * Life cycle emulation status.
 */
export const emulatingLifeCycle = () => lifeCycleEmulation;

/**
 * Clone an array like instance.
 * @param arr The array to convert.
 * @return A shallow clone of the array.
 */
export const cloneChildNodes = (arr: NodeList|IterableNodeList) => {
    const result = [] as unknown as IterableNodeList;
    result.item = (index) => result[index];
    for (let i = arr.length; i--; result.unshift(arr.item(i) as Node));
    return result;
};
