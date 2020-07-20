import { document, CustomEvent, Node, HTMLElement, Event } from './window';
const { DOCUMENT_NODE, TEXT_NODE, ELEMENT_NODE } = Node;


/**
 * Alias to Array.isArray.
 */
export const isArray = Array.isArray;

/**
 * Alias to Object.getOwnPropertyDescriptor.
 */
export const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

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
 * Alias to HTMLElement.prototype.matches.
 */
export const matchesImpl = HTMLElement.prototype.matches || HTMLElement.prototype.webkitMatchesSelector || (HTMLElement.prototype as any).msMatchesSelector as typeof Element.prototype.matches;

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
 * Check if an object is an Event instance.
 * @param node The node to check.
 * @return The object is an Event instance.
 */
export const isEvent = (event: any): event is Event => event instanceof Event;

