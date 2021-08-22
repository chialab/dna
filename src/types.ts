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

/**
 * A list of valid tag names.
 */
export type ElementTagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap & {
    'big': HTMLElement;
    'keygen': HTMLElement;
    'menuitem': HTMLElement;
    'noindex': HTMLElement;
    'animate': SVGElement;
    'animateMotion': SVGElement;
    'animateTransform': SVGElement;
    'feDropShadow': SVGElement;
    'mpath': SVGElement;
};

/**
 * A Node.prototype.childNodes like interface.
 */
export type IterableNodeList = Node[] & {
    item(index: number): Node | null;
};

/**
 * Get all method keys of a type.
 */
export type MethodsOf<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
