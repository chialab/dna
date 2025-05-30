import type { Constructor } from './helpers';

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
