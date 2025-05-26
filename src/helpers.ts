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
export const isArray: (typeof Array)['isArray'] = Array.isArray;

/**
 * Alias to Object.getOwnPropertyDescriptor.
 */
export const getOwnPropertyDescriptor: (typeof Object)['getOwnPropertyDescriptor'] = Object.getOwnPropertyDescriptor;

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
export const getPrototypeOf: (typeof Object)['getPrototypeOf'] = Object.getPrototypeOf;

/**
 * Alias to Object.setPrototypeOf.
 */
export const setPrototypeOf: (typeof Object)['setPrototypeOf'] = Object.setPrototypeOf;

/**
 * Alias to Object.prototype.hasOwnProperty.
 */
export const hasOwnProperty: (typeof Object)['hasOwnProperty'] = Object.prototype.hasOwnProperty;

/**
 * Alias to Object.defineProperty.
 */
export const defineProperty: (typeof Object)['defineProperty'] = Object.defineProperty;

/**
 * Alias to Object.create.
 */
export const createObject: (typeof Object)['create'] = Object.create;

/**
 * Check if runtime has DOM specs.
 */
export const isBrowser: boolean = typeof HTMLElement !== 'undefined';
