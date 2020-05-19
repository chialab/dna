import { createSymbolKey } from './symbols';
import { Subscription } from './Observable';

/**
 * The ontext symbol.
 */
const CONTEXT_SYMBOL = createSymbolKey();

/**
 * A ontext interface.
 */
export type Context = {
    promises?: Promise<unknown>[];
    subscriptions?: Subscription[];
    [key: string]: any;
};

/**
 * Create a context with an initial prototype.
 * @param prototype The initial prototype object for the context.
 * @return An context object with prototype.
 */
export const createContext = (prototype: any, values: { [key: string]: any } = {}): Context => {
    const context = Object.create(prototype, {
        promises: {
            writable: true,
        },
        subscriptions: {
            writable: true,
        },
    });
    for (let propertyKey in values) {
        context[propertyKey] = values[propertyKey];
    }
    return context as Context;
};

/**
 * Get the context attached to an object.
 * @param target The context object.
 * @return The context object (if it exists).
 */
export const getContext = (target: any): Context | undefined => target[CONTEXT_SYMBOL];

/**
 * Attach a context to an object.
 * @param target The object to context.
 * @param context The context to set.
 */
export const setContext = (target: any, context: Context): Context => target[CONTEXT_SYMBOL] = context;
