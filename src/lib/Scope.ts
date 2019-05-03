/**
 * The scope symbol.
 */
const SCOPE_SYMBOL = Symbol();

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
 * A Scoped object has a Scope instance attached, in order to use it in a render context.
 */
export type Scoped = { [SCOPE_SYMBOL]?: Scope };

/**
 * Create a Scope with an initial prototype.
 * @param prototype The initial prototype object for the Scope.
 * @return An object with the Scope interface.
 */
export function createScope(prototype: HTMLElement) {
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
}

/**
 * Get the Scope attached to an object.
 * @param target The scoped object.
 * @return The Scope object (if it exists).
 */
export function getScope(target: any): Scope | undefined {
    const scopedPrototype: Scoped = target;
    return scopedPrototype[SCOPE_SYMBOL];
}

/**
 * Attach a Scope to an object.
 * @param target The object to scope.
 * @param scope The Scope to set.
 */
export function setScope(target: any, scope: Scope): void {
    const scopedTarget: Scoped = target;
    scopedTarget[SCOPE_SYMBOL] = scope;
}
