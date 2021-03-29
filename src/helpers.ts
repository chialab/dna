import type { ComponentInterface } from './Interfaces';
import { window } from './window';
import { createSymbolKey } from './symbols';
import { cloneChildNodes } from './NodeList';

export const { Node, HTMLElement, Event, CustomEvent, document } = window;
export const { DOCUMENT_NODE, TEXT_NODE, COMMENT_NODE, ELEMENT_NODE } = Node;

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
export const appendChildImpl = Node.prototype.appendChild;

/**
 * Alias to Node.prototype.removeChild.
 */
export const removeChildImpl = Node.prototype.removeChild;

/**
 * Alias to Node.prototype.insertBefore.
 */
export const insertBeforeImpl = Node.prototype.insertBefore;

/**
 * Alias to Node.prototype.replaceChild.
 */
export const replaceChildImpl = Node.prototype.replaceChild;

/**
 * Alias to Node.prototype.isConnected.
 */
export const isConnectedImpl = getOwnPropertyDescriptor(Node.prototype, 'isConnected');

/**
 * Alias to HTMLElement.prototype.getAttribute.
 */
export const getAttributeImpl = HTMLElement.prototype.getAttribute;

/**
 * Alias to HTMLElement.prototype.hasAttribute.
 */
export const hasAttributeImpl = HTMLElement.prototype.hasAttribute;

/**
 * Alias to HTMLElement.prototype.setAttribute.
 */
export const setAttributeImpl = HTMLElement.prototype.setAttribute;

/**
 * Alias to HTMLElement.prototype.removeAttribute.
 */
export const removeAttributeImpl = HTMLElement.prototype.removeAttribute;

/**
 * Alias to HTMLElement.prototype.matches.
 */
export const matchesImpl = HTMLElement.prototype.matches || HTMLElement.prototype.webkitMatchesSelector || (HTMLElement.prototype as any).msMatchesSelector as typeof Element.prototype.matches;

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
        event = new CustomEvent(typeArg, eventInitDict);
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
export const isNode = (target: unknown): target is Node => target instanceof Node;

/**
 * Check if a node is a Document instance.
 * @param node The node to check.
 * @return The node is a Document instance.
 */
export const isDocument = (node: any): node is Document => node && node.nodeType === DOCUMENT_NODE;

/**
 * Check if a node is a Text instance.
 * @param node The node to check.
 * @return The node is a Text instance.
 */
export const isText = (node: any): node is Text => node && node.nodeType === TEXT_NODE;

/**
 * Check if a node is an Element instance.
 * @param node The node to check.
 * @return The node is an Element instance.
 */
export const isElement = (node: any): node is HTMLElement => node && node.nodeType === ELEMENT_NODE;

/**
 * Check if a node is a Comment instance.
 * @param node The node to check.
 * @return The node is a Text instance.
 */
export const isComment = (node: any): node is Comment => node && node.nodeType === COMMENT_NODE;

/**
 * Check if an object is an Event instance.
 * @param node The node to check.
 * @return The object is an Event instance.
 */
export const isEvent = (event: unknown): event is Event => event instanceof Event;

/**
 * Check if a Node is connected.
 *
 * @return A truthy value for connected targets.
 */
export const isConnected: (this: Node | void) => boolean = isConnectedImpl ? (isConnectedImpl as any).get : function(this: Node | void): boolean {
    if (isElement(this) || isText(this)) {
        return isConnected.call(this.parentNode as Node);
    }
    if (isDocument(this)) {
        return true;
    }

    return false;
};

/**
 * A symbol which identify emulated components.
 */
const EMULATE_LIFECYCLE_SYMBOL = createSymbolKey();

/**
 * Check if a node require emulated life cycle.
 * @param node The node to check.
 */
export const shouldEmulateLifeCycle = (node: Node): node is ComponentInterface<HTMLElement> => (node as any)[EMULATE_LIFECYCLE_SYMBOL];

/**
 * Invoke `connectedCallback` method of a Node (and its descendents).
 * It does nothing if life cycle is disabled.
 *
 * @param node The connected node.
 */
export const connect = (node: Node, force = false) => {
    if (!isElement(node)) {
        return;
    }
    if (force || shouldEmulateLifeCycle(node)) {
        (node as ComponentInterface<HTMLElement>).connectedCallback();
    }
    let children = cloneChildNodes(node.childNodes);
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
        node.disconnectedCallback();
    }
    let children = cloneChildNodes(node.childNodes);
    for (let i = 0, len = children.length; i < len; i++) {
        disconnect(children[i]);
    }
};

/**
 * Should emulate life cycle.
 */
let lifeCycleEmulation = typeof customElements === 'undefined';

/**
 * Flag the element for life cycle emulation.
 */
export const emulateLifeCycle = (node: HTMLElement) => {
    lifeCycleEmulation = true;
    (node as any)[EMULATE_LIFECYCLE_SYMBOL] = true;
};

/**
 * Life cycle emulation status.
 */
export const emulatingLifeCycle = () => lifeCycleEmulation;
