import { createSymbolKey } from './symbols';

/**
 * The scope symbol.
 */
const SCOPE_SYMBOL = createSymbolKey();

export type ScopeValues = { [key: string]: any };

/**
 * A scope interface.
 */
export type Scope = HTMLElement & ScopeValues;

/**
 * Create a scope with an initial prototype.
 * @param prototype The initial prototype object for the scope.
 * @return An scope object with prototype.
 */
export const createScope = (prototype: any, values: ScopeValues = {}): Scope => {
    const scope = Object.create(prototype);
    for (let propertyKey in values) {
        scope[propertyKey] = values[propertyKey];
    }
    return scope as Scope;
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
export const setScope = (target: any, scope: Scope): Scope => target[SCOPE_SYMBOL] = scope;
