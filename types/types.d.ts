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
export declare type ClassDescriptor = {
    kind: 'class';
    elements: ClassElement[];
    finisher?: <T>(constructor: {
        new (): T;
    }) => void | {
        new (): T;
    };
};
/**
 * Constructor type helper.
 */
export declare type Constructor<T> = {
    new (...args: any[]): T;
    prototype: T;
};
/**
 * Replace a type in union.
 */
export declare type Replace<T, E, N> = IfEqual<T, Exclude<T, E>, T, N | Exclude<T, E>>;
/**
 * A list of valid tag names.
 */
export declare type TagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap;
/**
 * A Node.prototype.childNodes like interface.
 */
export declare type IterableNodeList = Node[] & {
    item(index: number): Node | null;
};
/**
 * If/else statement for type comparison.
 */
export declare type IfEqual<Left, Right, Then, Else = void> = (<A>() => A extends Left ? 1 : 2) extends (<A>() => A extends Right ? 1 : 2) ? Then : Else;
/**
 * Get all method keys of a type.
 */
export declare type MethodsOf<T> = {
    [P in keyof T]: T[P] extends Function ? IfEqual<{
        [Q in P]: T[P];
    }, {
        [Q in P]-?: T[P];
    }, P, never> : never;
}[keyof T];
/**
 * Get all field keys of a type.
 */
export declare type FieldsOf<T> = Exclude<keyof T, MethodsOf<T> | undefined>;
/**
 * Get all writable field keys of a type.
 */
export declare type WritableOf<T> = Exclude<{
    [P in keyof T]: IfEqual<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P, never>;
}[FieldsOf<T>], undefined>;
/**
 * Remove readonly properties from a type.
 */
export declare type Writable<T> = Pick<T, WritableOf<T>>;
