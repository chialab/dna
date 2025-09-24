import type { ComponentConstructor, ComponentInstance } from './Component';
import { HTMLElement } from './Elements';
import { type ClassElement, type Constructor, getOwnPropertyDescriptor, hasOwn, isElement } from './helpers';

/**
 * A Symbol which contains all Node delegation.
 */
const EVENT_CALLBACKS_SYMBOL: unique symbol = Symbol();

/**
 * A map of all listeners of a Component.
 */
const LISTENERS_REGISTRY: Map<string, Listener[]> = new Map();

/**
 * WeakMap containing all listeners metadata.
 */
const LISTENERS_METADATA = new WeakMap<object, Set<[PropertyKey, string, string | null, AddEventListenerOptions]>>();

/**
 * WeakMap containing all events metadata.
 */
const EVENTS_METADATA = new WeakMap<object, Set<[PropertyKey, string]>>();

/**
 * Async event interface.
 */
export type AsyncEvent = Event & {
    respondWith(callback: () => Promise<unknown>): void;
};

/**
 * Describe the signature of a delegated event callback.
 * @param event The original DOM event.
 * @param target The matched delegated element.
 */
export type DelegatedEventCallback = (event: Event, target?: Node) => unknown;

/**
 * A descriptor for an event delegation.
 */
export type DelegatedEventDescriptor = AddEventListenerOptions & {
    callback: DelegatedEventCallback;
};

/**
 * Property configuration for properties accessor.
 */
export type ListenerConfig = DelegatedEventCallback | DelegatedEventDescriptor;

/**
 * A collector for event delegations.
 */
type DelegationList = [[string, string | null, DelegatedEventCallback?][], EventListenerOrEventListenerObject | null];

/**
 * An object with event delegations.
 */
type WithEventDelegations = {
    [EVENT_CALLBACKS_SYMBOL]?: {
        [key: string]: DelegationList;
    };
};

/**
 * The listener interface.
 */
type Listener = [string, string | null, DelegatedEventCallback, AddEventListenerOptions?];

const assertNode = (element: unknown) => {
    if (!isElement(element)) {
        throw new TypeError('The provided element must be a Node');
    }
};

const assertEvent = (event: unknown) => {
    if (!(event instanceof Event)) {
        throw new TypeError('The provided object must be an Event');
    }
};

const assertEventName = (eventName: unknown) => {
    if (typeof eventName !== 'string') {
        throw new TypeError('The provided event name must be a string');
    }
};

const assertEventSelector = (selector: unknown) => {
    if (selector !== null && typeof selector !== 'string') {
        throw new TypeError('The provided selector must be a string or null');
    }
};

const assertEventCallback = (callback: unknown) => {
    if (typeof callback !== 'function') {
        throw new TypeError('The provided callback must be a function');
    }
};

const assertEventBubbles = (bubbles: unknown) => {
    if (typeof bubbles !== 'boolean') {
        throw new TypeError('The provided bubbles option must be a boolean');
    }
};

const assertEventCancelable = (cancelable: unknown) => {
    if (typeof cancelable !== 'boolean') {
        throw new TypeError('The provided cancelable option must be a boolean');
    }
};

const assertEventComposed = (composed: unknown) => {
    if (typeof composed !== 'undefined' && typeof composed !== 'boolean') {
        throw new TypeError('The provided composed option must be a boolean');
    }
};

/**
 * Delegate an Event listener.
 *
 * @param element The root element for the delegation
 * @param eventName The event name to listen
 * @param selector The selector to delegate
 * @param callback The callback to trigger when an Event matches the delegation
 * @param options An options object that specifies characteristics about the event listener. @see [MDN]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener}
 */
export const delegateEventListener = (
    element: Element,
    eventName: string,
    selector: string | null,
    callback: DelegatedEventCallback,
    options?: AddEventListenerOptions
): void => {
    const delegatedElement: Node & WithEventDelegations = element;

    assertNode(element);
    assertEventName(eventName);
    assertEventSelector(selector);
    assertEventCallback(callback);

    // get all delegations
    const delegations = delegatedElement[EVENT_CALLBACKS_SYMBOL] || {};
    delegatedElement[EVENT_CALLBACKS_SYMBOL] = delegations;
    // initialize the delegation list
    const callbacks: DelegationList = delegations[eventName] || [[], null];
    delegations[eventName] = callbacks;
    const [descriptors, listener] = callbacks;
    // check if the event has already been delegated
    if (!listener) {
        // setup the listener
        const listener = (event: Event) => {
            if (!event.target) {
                return;
            }
            // wrap the Event's stopPropagation in order to prevent other delegations from the same root
            const originalStopPropagation = event.stopPropagation;
            const originalImmediatePropagation = event.stopImmediatePropagation;
            let stopped = false;
            let stoppedImmediated = false;
            event.stopPropagation = () => {
                stopped = true;
                // exec the real stopPropagation method
                return originalStopPropagation.call(event);
            };
            event.stopImmediatePropagation = () => {
                stopped = true;
                stoppedImmediated = true;
                // exec the real stopPropagation method
                return originalImmediatePropagation.call(event);
            };

            // filter matched selector for the event
            const filtered: { target: Node; callback: DelegatedEventCallback }[] = [];
            for (let i = 0; i < descriptors.length; i++) {
                const [, selector, callback] = descriptors[i];
                let selectorTarget: Node | null = null;
                if (selector) {
                    const path = event.composedPath();
                    let target = path.shift();
                    while (target && target !== element) {
                        if (isElement(target) && target.matches(selector)) {
                            selectorTarget = target;
                            break;
                        }
                        target = path.shift();
                    }
                } else {
                    selectorTarget = element;
                }
                if (selectorTarget) {
                    filtered.push({
                        target: selectorTarget,
                        callback: callback as DelegatedEventCallback,
                    });
                }
            }

            let lastTarget: Node;
            filtered
                // clone the array in order to correctly sort callbacks in old browsers
                .slice(0)
                // reorder targets by position in the dom tree.
                .sort((match1, match2) => {
                    if (match1.target === match2.target) {
                        return filtered.indexOf(match1) - filtered.indexOf(match2);
                    }
                    return match1.target.contains(match2.target) ? filtered.length : -filtered.length;
                })
                // trigger the callback
                .some(({ callback, target }) => {
                    if (stoppedImmediated) {
                        return true;
                    }
                    if (stopped && target !== lastTarget) {
                        return true;
                    }
                    lastTarget = target;
                    return callback.call(element, event, target) === false;
                });
        };

        callbacks[1] = listener;
        element.addEventListener(eventName, listener, options);
    }

    // add the delegation to the list
    descriptors.push([eventName, selector, callback]);
};

/**
 * Remove an Event delegation.
 *
 * @param element The root element of the delegation
 * @param eventName The Event name to undelegate
 * @param selector The selector to undelegate
 * @param callback The callback to remove
 */
export const undelegateEventListener = (
    element: Element,
    eventName: string,
    selector: string | null,
    callback: DelegatedEventCallback
): void => {
    assertNode(element);
    assertEventName(eventName);
    assertEventSelector(selector);
    assertEventCallback(callback);

    const delegatedElement: Node & WithEventDelegations = element;
    // get all delegations
    const delegations = delegatedElement[EVENT_CALLBACKS_SYMBOL];
    if (!delegations) {
        return;
    }
    if (!(eventName in delegations)) {
        return;
    }
    const [descriptors, listener] = delegations[eventName];
    // get the list of delegations
    // find the index of the callback to remove in the list
    for (let i = 0; i < descriptors.length; i++) {
        const [, eventSelector, eventCallback] = descriptors[i];
        if (eventSelector === selector && eventCallback === callback) {
            descriptors.splice(i, 1);
            if (descriptors.length === 0 && listener) {
                element.removeEventListener(eventName, listener);
            }
        }
    }
};

/**
 * Create custom Event.
 *
 * @param event The event to dispatch or the name of the synthetic event to create.
 * @param detail Detail object of the event.
 * @param bubbles Should the event bubble.
 * @param cancelable Should the event be cancelable.
 * @param composed Is the event composed.
 * @returns The custom event.
 */
function initEvent(
    event: Event | string,
    detail?: CustomEventInit,
    bubbles?: boolean,
    cancelable?: boolean,
    composed?: boolean
) {
    if (typeof event !== 'string') {
        assertEvent(event);
        return event;
    }

    assertEventBubbles(bubbles);
    assertEventCancelable(cancelable);
    assertEventComposed(composed);

    return new CustomEvent(event, {
        detail,
        bubbles,
        cancelable,
        composed,
    });
}

/**
 * Dispatch a custom Event.
 * @param element The dispatcher node.
 * @param event The event to dispatch or the name of the synthetic event to create.
 * @param detail Detail object of the event.
 * @param bubbles Should the event bubble.
 * @param cancelable Should the event be cancelable.
 * @param composed Is the event composed.
 * @returns True if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
 */
export const dispatchEvent = (
    element: Element,
    event: Event | string,
    detail?: CustomEventInit['detail'],
    bubbles = true,
    cancelable = true,
    composed = false
): boolean => {
    assertNode(element);
    return HTMLElement.prototype.dispatchEvent.call(element, initEvent(event, detail, bubbles, cancelable, composed));
};

/**
 * Dispatch an async custom Event.
 *
 * @param element The dispatcher node.
 * @param event The event to dispatch or the name of the synthetic event to create.
 * @param detail Detail object of the event.
 * @param bubbles Should the event bubble.
 * @param cancelable Should the event be cancelable.
 * @param composed Is the event composed.
 * @returns A promise that resolves when all the async event's promises are resolved.
 */
export const dispatchAsyncEvent = async (
    element: Element,
    event: Event | string,
    detail?: CustomEventInit['detail'],
    bubbles = true,
    cancelable = true,
    composed = false
): Promise<unknown[]> => {
    const asyncEvent = initEvent(event, detail, bubbles, cancelable, composed) as unknown as AsyncEvent;
    const promises: unknown[] = [];
    asyncEvent.respondWith = (callback) => {
        promises.push(callback());
    };
    if (!dispatchEvent(element, asyncEvent)) {
        if (promises.length === 0) {
            throw new Error('Event has been canceled');
        }
    }
    return await Promise.all(promises);
};

/**
 * Retrieve all listeners descriptors.
 * @param prototype The component prototype.
 * @returns A list of listeners.
 * @throws If the component has not been finalized.
 */
export const getListeners = <T extends ComponentInstance>(prototype: T): Listener[] => {
    if (!prototype.is) {
        throw new Error('Component has not been finalized');
    }
    if (!LISTENERS_REGISTRY.has(prototype.is)) {
        LISTENERS_REGISTRY.set(prototype.is, []);
    }
    return LISTENERS_REGISTRY.get(prototype.is) as Listener[];
};

/**
 * Add an event listener to the prototype.
 * @param prototype The component prototype.
 * @param eventName The name of the event to listen.
 * @param selector The selector event target of the listener.
 * @param callback The event callback.
 * @param options The event listener options.
 */
export const defineListener = <T extends ComponentInstance>(
    prototype: T,
    eventName: string,
    selector: string | null,
    callback: DelegatedEventCallback,
    options: AddEventListenerOptions = {}
): void => {
    getListeners(prototype).push([eventName, selector, callback, options]);
};

/**
 * Retrieve all static listeners from a component constructor.
 * @param ctr The component constructor.
 * @yields A tuple containing event name, selector, callback and options.
 */
export function* staticListeners<T extends ComponentInstance, C extends ComponentConstructor<T>>(
    ctr: C
): Iterable<[string, string | null, DelegatedEventCallback, AddEventListenerOptions?]> {
    const listenersDescriptor = getOwnPropertyDescriptor(ctr, 'listeners');
    const listenersGetter = listenersDescriptor?.get;
    if (listenersGetter) {
        const listenerDescriptors = (listenersGetter.call(ctr) || {}) as {
            [key: string]: ListenerConfig;
        };
        for (const eventPath in listenerDescriptors) {
            const paths = eventPath.trim().split(' ');
            const eventName = paths.shift() as string;
            const selector = paths.length ? paths.join(' ') : null;
            const descriptor = listenerDescriptors[eventPath];
            const { callback, ...options } = typeof descriptor === 'object' ? descriptor : { callback: descriptor };
            yield [eventName, selector, callback as DelegatedEventCallback, options];
        }
    }
}

/**
 * Retrieve all decorated listeners from a component constructor.
 * @param ctr The component constructor.
 * @yields A tuple containing event name, selector, callback and options.
 */
export function* decoratedListeners<T extends ComponentInstance, C extends ComponentConstructor<T>>(
    ctr: C
): Iterable<[string, string | null, DelegatedEventCallback, AddEventListenerOptions]> {
    const listenersMeta = hasOwn.call(ctr, Symbol.metadata)
        ? LISTENERS_METADATA.get(ctr[Symbol.metadata] as object)
        : LISTENERS_METADATA.get(ctr);
    if (listenersMeta) {
        const prototype = ctr.prototype as T;
        for (const [name, event, selector, options] of listenersMeta) {
            yield [event, selector, prototype[name as keyof T] as unknown as DelegatedEventCallback, options];
        }
    }
}

/**
 * Retrieve all decorated events from a component constructor.
 * @param ctr The component constructor.
 * @yields A tuple containing property key and event name.
 */
export function* decoratedEvents<T extends ComponentInstance, C extends ComponentConstructor<T>>(
    ctr: C
): Iterable<[keyof T, string]> {
    const eventsMeta = hasOwn.call(ctr, Symbol.metadata)
        ? EVENTS_METADATA.get(ctr[Symbol.metadata] as object)
        : EVENTS_METADATA.get(ctr);
    if (eventsMeta) {
        for (const [name, eventName] of eventsMeta) {
            yield [name as keyof T, eventName];
        }
    }
}

/**
 * Add event metadata to a target object.
 * @param key The decorator symbol context.
 * @param propertyKey The property name.
 * @param eventName The event name.
 * @param selector The event selector.
 * @param options The event listener options.
 */
const addListenerMetadata = (
    key: object,
    propertyKey: PropertyKey,
    eventName: string,
    selector: string | null,
    options: AddEventListenerOptions
) => {
    const listeners = LISTENERS_METADATA.get(key) ?? new Set();
    LISTENERS_METADATA.set(key, listeners);
    listeners.add([propertyKey, eventName, selector, options]);
};

function listen(
    eventName: string,
    options?: AddEventListenerOptions
    // biome-ignore lint/suspicious/noExplicitAny: In order to support both TS and Babel decorators, we need to allow any type here.
): any;
function listen(
    eventName: string,
    selector: string,
    options?: AddEventListenerOptions
    // biome-ignore lint/suspicious/noExplicitAny: In order to support both TS and Babel decorators, we need to allow any type here.
): any;
/**
 * A decorator for listening DOM events.
 * @param eventName The name of the event to listen.
 * @param target The event target for the listener.
 * @param options Options to pass to addEventListener.
 * @returns The decorator initializer.
 */
function listen(
    eventName: string,
    target?: string | AddEventListenerOptions,
    options?: AddEventListenerOptions
    // biome-ignore lint/suspicious/noExplicitAny: In order to support both TS and Babel decorators, we need to allow any type here.
): any {
    return <T extends ComponentInstance, P extends keyof T>(targetOrClassElement: T, methodKey: P) => {
        const selector = typeof target === 'string' ? target : null;
        const opts = (typeof target !== 'string' ? target : options) || {};

        if (typeof methodKey === 'object') {
            const context = methodKey as ClassMethodDecoratorContext<T>;
            addListenerMetadata(context.metadata, context.name, eventName, selector, opts);
            return;
        }

        if (methodKey !== undefined) {
            addListenerMetadata(targetOrClassElement.constructor, methodKey, eventName, selector, opts);
            return;
        }

        const element = targetOrClassElement as unknown as ClassElement<T, P>;
        return {
            ...element,
            finisher(ctr: Constructor<T>) {
                addListenerMetadata(ctr, element.key, eventName, selector, opts);
            },
        };
    };
}

export { listen };

/**
 * A type for custom event properties.
 */
export type EventHandler<
    T extends Event = Event,
    OverrideNative extends boolean = false,
    OverrideOnError extends boolean = false,
> = // biome-ignore lint/suspicious/noExplicitAny: Event handlers can return any type.
| ((event: T | (OverrideNative extends true ? Event : never) | (OverrideOnError extends true ? string : never)) => any)
| null;

/**
 * Extract event type from handler property.
 */
export type EventType<T extends ComponentInstance, P extends keyof T, Strict extends boolean = false> = Exclude<
    T[P],
    undefined
> extends EventHandler<infer E, infer OverrideNative, infer OverrideOnError>
    ?
          | E
          | (Strict extends false
                ? (OverrideNative extends true ? Event : never) | (OverrideOnError extends true ? string : never)
                : never)
    : never;

/**
 * Extract the event name from a property key.
 * @param propertyKey The property key to extract the event name from.
 * @returns The extracted event name.
 * @throws If the property key does not start with "on".
 */
const extractEventName = (propertyKey: PropertyKey): string => {
    if (typeof propertyKey !== 'string' || !propertyKey.startsWith('on')) {
        throw new TypeError(
            `The property key "${propertyKey as string}" must start with "on" to be used with @fires decorator.`
        );
    }
    return propertyKey.slice(2).toLowerCase();
};

/**
 * Add event metadata to a target object.
 * @param key The decorator symbol context.
 * @param propertyKey The property name.
 * @param eventName The event name.
 */
const addEventMetadata = (key: object, propertyKey: PropertyKey, eventName: string) => {
    const events = EVENTS_METADATA.get(key) ?? new Set();
    EVENTS_METADATA.set(key, events);
    events.add([propertyKey, eventName]);
};

/**
 * Create `on{event}` properties.
 * @param eventName The name of the event to create a property for.
 * @returns A decorator for creating event properties.
 */
// biome-ignore lint/suspicious/noExplicitAny: In order to support both TS and Babel decorators, we need to allow any type here.
export function fires(eventName?: string): any {
    return <T extends ComponentInstance, P extends keyof T>(targetOrClassElement: T, propertyKey?: P) => {
        if (typeof propertyKey === 'object') {
            const context = propertyKey as ClassFieldDecoratorContext<T>;
            addEventMetadata(context.metadata, context.name, eventName || extractEventName(context.name));
            return;
        }

        if (propertyKey !== undefined) {
            addEventMetadata(targetOrClassElement.constructor, propertyKey, eventName || extractEventName(propertyKey));
            return;
        }

        const classElement = targetOrClassElement as unknown as ClassElement<T, T[P]>;
        return {
            ...classElement,
            finisher(ctr: Constructor<T>) {
                addEventMetadata(ctr, classElement.key, eventName || extractEventName(classElement.key));
            },
        };
    };
}
