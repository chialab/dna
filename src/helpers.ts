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
export const getPropertyDescriptor = (object: object, propertyKey: PropertyKey): PropertyDescriptor | undefined => {
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
export const hasOwn: (typeof Object)['hasOwnProperty'] = Object.prototype.hasOwnProperty;

/**
 * Alias to Object.defineProperty.
 */
export const defineProperty: (typeof Object)['defineProperty'] = Object.defineProperty;

/**
 * Check if a node is an Element.
 * @param node The node to check.
 * @returns True if the node is an Element.
 */
export const isElement = (node: unknown): node is Element => (node as Node)?.nodeType === Node.ELEMENT_NODE;

/**
 * Check if runtime has DOM specs.
 */
export const isBrowser: boolean = typeof HTMLElement !== 'undefined';

declare global {
    interface SymbolConstructor {
        readonly metadata: unique symbol;
    }
}

if (!hasOwn.call(Symbol, 'metadata')) {
    defineProperty(Symbol, 'metadata', {
        value: Symbol('Symbol.metadata'),
        enumerable: false,
        configurable: false,
        writable: false,
    });
}

/**
 * Constructor type helper.
 */
export interface Constructor<T> {
    readonly [Symbol.metadata]?: object;

    // biome-ignore lint/suspicious/noExplicitAny: This is a generic type definition.
    new (...args: any[]): T;
    prototype: T;
}

/**
 * Decorator class element descriptor.
 */
export interface ClassElement<T, P> {
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
    initializer?: () => P;
    /**
     * The element property descriptor.
     */
    descriptor?: PropertyDescriptor;
    /**
     * The descriptor finisher method.
     */
    finisher?: (ctr: Constructor<T>) => void;
}

/**
 * The class descriptor interface.
 */
export type ClassDescriptor<T, P> = {
    kind: 'class';
    elements: ClassElement<T, P>[];
    finisher?: (ctr: Constructor<T>) => Constructor<T> | undefined;
};
