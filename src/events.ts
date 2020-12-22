import { createSymbolKey } from './symbols';
import { HTMLElement, isElement, isEvent, matchesImpl, createEventImpl, hasOwnProperty } from './helpers';
import { ComponentConstructorInterface } from './Interfaces';
import { getOwnPropertyDescriptor } from './helpers';

/**
 * A Symbol which contains all Node delegation.
 */
const EVENT_CALLBACKS_SYMBOL: unique symbol = createSymbolKey() as any;

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
 * A collector for event delegations.
 */
type DelegationList = {
    /**
     * A list of delegation descriptors.
     */
    descriptors: {
        /**
         * The name of the delegated event.
         */
        event: string;
        /**
         * The selector for the delegated event.
         */
        selector: string | null;
        /**
         * The callback for the delegated event.
         */
        callback?: DelegatedEventCallback;
    }[];

    /**
     * The real event listener.
     */
    listener: EventListenerOrEventListenerObject;
}

/**
 * An object with event delegations.
 */
type WithEventDelegations = {
    [EVENT_CALLBACKS_SYMBOL]?: {
        [key: string]: DelegationList;
    };
}

const assertNode = (element: unknown) => {
    if (!isElement(element)) {
        throw new TypeError('The provided element must be a Node');
    }
};

const assertEvent = (event: unknown) => {
    if (!isEvent(event)) {
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
export const delegateEventListener = (element: Element, eventName: string, selector: string|null, callback: DelegatedEventCallback, options?: AddEventListenerOptions) => {
    let delegatedElement: Node & WithEventDelegations = element;

    assertNode(element);
    assertEventName(eventName);
    assertEventSelector(selector);
    assertEventCallback(callback);

    // get all delegations
    let delegations = delegatedElement[EVENT_CALLBACKS_SYMBOL] = delegatedElement[EVENT_CALLBACKS_SYMBOL] || {};
    // initialize the delegation list
    let callbacks: DelegationList = delegations[eventName] = delegations[eventName] || {
        descriptors: [],
    };
    let descriptors = callbacks.descriptors;
    // check if the event has already been delegated
    if (!callbacks.listener) {
        // setup the listener
        callbacks.listener = (event) => {
            if (!event.target) {
                return;
            }
            let eventTarget = event.target as Node;
            // wrap the Event's stopPropagation in order to prevent other delegations from the same root
            let stopped = false;
            let stoppedImmediated = false;
            let originalStopPropagation = event.stopPropagation;
            let originalImmediatePropagation = event.stopImmediatePropagation;
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
            let filtered: { target: Node; callback: DelegatedEventCallback }[] = [];
            for (let i = 0; i < descriptors.length; i++) {
                let { selector, callback } = descriptors[i];
                let selectorTarget;
                if (selector) {
                    let target = eventTarget;
                    while (target && target !== element) {
                        if (isElement(target) && matchesImpl.call(target, selector)) {
                            selectorTarget = target;
                            break;
                        }
                        target = target.parentNode as Node;
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

        element.addEventListener(eventName, callbacks.listener, options);
    }

    // add the delegation to the list
    descriptors.push({ event: eventName, callback, selector });
};

/**
 * Remove an Event delegation.
 *
 * @param element The root element of the delegation
 * @param eventName The Event name to undelegate
 * @param selector The selector to undelegate
 * @param callback The callback to remove
 */
export const undelegateEventListener = (element: Element, eventName: string, selector: string | null, callback: DelegatedEventCallback) => {
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
    const { descriptors, listener } = delegations[eventName];
    // get the list of delegations
    // find the index of the callback to remove in the list
    for (let i = 0; i < descriptors.length; i++) {
        let descriptor = descriptors[i];
        if (descriptor.selector === selector && descriptor.callback === callback) {
            descriptors.splice(i, 1);
            if (descriptors.length === 0) {
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
 */
function initEvent(event: Event | string, detail?: CustomEventInit, bubbles?: boolean, cancelable?: boolean, composed?: boolean) {
    if (typeof event !== 'string') {
        assertEvent(event);
        return event;
    }

    assertEventBubbles(bubbles);
    assertEventCancelable(cancelable);
    assertEventComposed(composed);

    return createEventImpl(event, {
        detail,
        bubbles,
        cancelable,
        composed,
    });
}

/**
 * Dispatch a custom Event.
 *
 * @param element The dispatcher node.
 * @param event The event to dispatch or the name of the synthetic event to create.
 * @param detail Detail object of the event.
 * @param bubbles Should the event bubble.
 * @param cancelable Should the event be cancelable.
 * @param composed Is the event composed.
 */
export const dispatchEvent = (element: Element, event: Event | string, detail?: CustomEventInit, bubbles: boolean = true, cancelable: boolean = true, composed: boolean = false): boolean => {
    assertNode(element);
    event = initEvent(event, detail, bubbles, cancelable, composed);
    return HTMLElement.prototype.dispatchEvent.call(element, event);
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
 */
export const dispatchAsyncEvent = async (element: Element, event: Event | string, detail?: CustomEventInit, bubbles: boolean = true, cancelable: boolean = true, composed: boolean = false): Promise<unknown[]> => {
    let asyncEvent = initEvent(event, detail, bubbles, cancelable, composed) as unknown as AsyncEvent;
    let promises: unknown[] = [];
    asyncEvent.respondWith = function(callback) {
        promises.push(callback());
    };
    if (!dispatchEvent(element, asyncEvent)) {
        throw new Error('Event has been canceled');
    }
    return await Promise.all(promises);
};

/**
 * A Symbol which contains all listeners instances of a component constructor.
 * @private
 */
const LISTENERS_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * Retrieve all listeners descriptors.
 * @param constructor The component constructor.
 * @return A list of listeners.
 */
export const getListeners = (constructor: ComponentConstructorInterface<HTMLElement>) => {
    if (!hasOwnProperty.call(constructor, LISTENERS_SYMBOL)) {
        return [];
    }

    return (constructor as any)[LISTENERS_SYMBOL] as {
        event: string;
        selector: string | null;
        callback: DelegatedEventCallback;
        options?: AddEventListenerOptions;
    }[];
};

/**
 * Define component constructor listeners.
 * @param constructor The component constructor.
 */
export const defineListeners = (constructor: ComponentConstructorInterface<HTMLElement>) => {
    let ctr = constructor;
    let listeners = (constructor as any)[LISTENERS_SYMBOL] = getListeners(constructor);
    while (ctr && ctr !== HTMLElement) {
        let listenersDescriptor = getOwnPropertyDescriptor(ctr, 'listeners');
        let listenersGetter = listenersDescriptor && listenersDescriptor.get;
        if (listenersGetter) {
            let listenerDescriptors = (listenersGetter.call(constructor) || {}) as {
                [key: string]: DelegatedEventCallback | DelegatedEventDescriptor;
            };
            // register listeners
            for (let eventPath in listenerDescriptors) {
                let paths = eventPath.trim().split(' ');
                let descriptor = listenerDescriptors[eventPath];
                if (typeof descriptor === 'function') {
                    listeners.push({
                        event: paths.shift() as string,
                        selector: paths.join(' '),
                        callback: descriptor,
                    });
                } else {
                    listeners.push({
                        event: paths.shift() as string,
                        selector: paths.join(' '),
                        callback: descriptor.callback,
                        options: {
                            capture: descriptor.capture,
                            once: descriptor.once,
                            passive: descriptor.passive,
                        },
                    });
                }
            }
        }
        ctr = Object.getPrototypeOf(ctr);
    }
};
