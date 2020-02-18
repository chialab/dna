import { createSymbolKey } from './symbols';

/**
 * The scope symbol.
 */
const SCOPE_SYMBOL = createSymbolKey();

/**
 * The Scope object set up a chain of scopes for templates in a render context.
 * It is possibile to assign properties only to a Component's scope,
 * or create a child scope which inherits properties from the current scope.
 */
export type Scope = HTMLElement & {
    [key: string]: any;
    /**
     * Assign values to the Scope.
     *
     * @param values A set of values to set to the Scope
     */
    $assign(values: { [key: string]: any }): void;

    /**
     * Create a child Scope.
     */
    $child(): Scope;
};

/**
 * Create a Scope with an initial prototype.
 * @param prototype The initial prototype object for the Scope.
 * @return An object with the Scope interface.
 */
export const createScope = (prototype: HTMLElement) => {
    const scope = {} as Scope;
    scope.__proto__ = {
        $assign(this: Scope, values: { [key: string]: any }) {
            for (let propertyKey in values) {
                this[propertyKey] = values[propertyKey];
            }
        },

        $child() {
            // create a new Scope inheriting properties from the current one
            return Object.create(this);
        },

        __proto__: prototype,
    };

    return scope;
};

/**
 * Get the Scope attached to an object.
 * @param target The scoped object.
 * @return The Scope object (if it exists).
 */
export const getScope = (target: any): Scope | undefined => target[SCOPE_SYMBOL];

/**
 * Attach a Scope to an object.
 * @param target The object to scope.
 * @param scope The Scope to set.
 */
export const setScope = (target: any, scope: Scope): void => {
    target[SCOPE_SYMBOL] = scope;
};
