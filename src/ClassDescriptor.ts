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
