import { window } from './window';

/**
 * Decorator class element descriptor.
 */
export interface ClassElement {
    /**
     * The kind of the class element.
     */
    kind: 'field' | 'method';
    /**
     * The name of the element.
     */
    key: PropertyKey;
    /**
     * The type of the element.
     */
    placement: 'static' | 'prototype' | 'own';
    /**
     * An initializer function.
     */
    initializer?: Function;
    /**
     * The element property descriptor.
     */
    descriptor?: PropertyDescriptor;
    /**
     * The descriptor finisher method.
     */
    finisher?: (constructor: Function) => void;
}

/**
 * The class descriptor interface.
 */
export type ClassDescriptor = {
    kind: 'class';
    elements: ClassElement[];
    finisher?: <T>(constructor: { new(): T }) => void | { new(): T };
};

/**
 * Constructor type helper.
 */
export type Constructor<T> = {
    new(...args: any[]): T;
    prototype: T;
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
 * Alias to Object.getOwnPropertyDescriptor.
 */
export const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

/**
 * Like Object.getOwnPropertyDescriptor, but for all the property chain.
 * @param object The object to get the descriptor from.
 * @param propertyKey The property key.
 * @returns A prototyped property descriptor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPropertyDescriptor = (object: any, propertyKey: PropertyKey): PropertyDescriptor | undefined => {
    if (!object) {
        return;
    }
    return getOwnPropertyDescriptor(object, propertyKey) || getPropertyDescriptor(getPrototypeOf(object), propertyKey);
};

/**
 * Alias to Object.setPrototypeOf.
 */
export const getPrototypeOf = Object.getPrototypeOf;

/**
 * Alias to Object.setPrototypeOf.
 * @param object The object to set the prototype of.
 * @param prototype The prototype to set.
 */
export const setPrototypeOf = Object.setPrototypeOf || ((object, prototype) => { object.__proto__ = prototype; });

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
 * @returns The constructed Custom Event.
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
 * @returns The target is a Node instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNode = (target: any): target is Node => target instanceof NodeConstructor;

/**
 * Check if a node is a Document instance.
 * @param node The node to check.
 * @returns The node is a Document instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isDocument = (node: any): node is Document => node && node.nodeType === DOCUMENT_NODE;

/**
 * Check if a node is a Text instance.
 * @param node The node to check.
 * @returns The node is a Text instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isText = (node: any): node is Text => node && node.nodeType === TEXT_NODE;

/**
 * Check if a node is an Element instance.
 * @param node The node to check.
 * @returns The node is an Element instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isElement = <T extends Element>(node: any): node is T => node && node.nodeType === ELEMENT_NODE;

/**
 * Check if an object is an Event instance.
 * @param event The target to check.
 * @returns The object is an Event instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEvent = (event: any): event is Event => event instanceof EventConstructor;

/**
 * Check if a Node is connected.
 * @param this The Node to check.
 * @returns A truthy value for connected targets.
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
 * The native custom elements registry.
 */
export const nativeCustomElements = window.customElements;

/**
 * Clone an array like instance.
 * @param arr The array to convert.
 * @returns A shallow clone of the array.
 */
export const cloneChildNodes = (arr: NodeList) => {
    const result: Node[] = [];
    for (let i = arr.length; i--; result.unshift(arr.item(i) as Node));
    return result;
};
