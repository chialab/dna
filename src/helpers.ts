/**
 * Constructor type helper.
 */
export type Constructor<T> = {
    new (...args: any[]): T;
    prototype: T;
};

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
export const setPrototypeOf =
    Object.setPrototypeOf ||
    ((object, prototype) => {
        object.__proto__ = prototype;
    });

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
 * Check if the target is a Node instance.
 * @param target The target to check.
 * @returns The target is a Node instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNode = (target: any): target is Node => target instanceof Node;

/**
 * Check if a node is a Document instance.
 * @param node The node to check.
 * @returns The node is a Document instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isDocument = (node: any): node is Document => node && node.nodeType === Node.DOCUMENT_NODE;

/**
 * Check if a node is a Text instance.
 * @param node The node to check.
 * @returns The node is a Text instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isText = (node: any): node is Text => node && node.nodeType === Node.TEXT_NODE;

/**
 * Check if a node is an Element instance.
 * @param node The node to check.
 * @returns The node is an Element instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isElement = <T extends Element>(node: any): node is T => node && node.nodeType === Node.ELEMENT_NODE;

/**
 * Check if an object is an Event instance.
 * @param event The target to check.
 * @returns The object is an Event instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEvent = (event: any): event is Event => event instanceof window.Event;

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
