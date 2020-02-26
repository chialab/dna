import { createSymbolKey } from './symbols';
import { ClassElement } from './ClassElement';
import { DOM, isElement, isEvent } from './DOM';
import { CustomElement } from './CustomElement';

/**
 * A Symbol which contains all Node delegation.
 */
const EVENT_CALLBACKS_SYMBOL: unique symbol = createSymbolKey() as any;

export type AsyncEvent = Event & {
    respondWith(callback: () => Promise<any>): void;
};

/**
 * Describe the signature of a delegated event callback.
 * @param event The original DOM event.
 * @param target The matched delegated element.
 */
export type DelegatedEventCallback = (event: Event, target?: Node) => any;

/**
 * A descriptor for an event delegation.
 */
type DelegatedEventDescriptor = {
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
};

/**
 * A collector for event delegations.
 */
type DelegationList = {
    /**
     * A list of delegation descriptors.
     */
    descriptors: DelegatedEventDescriptor[],
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
    const delegatedElement: Node & WithEventDelegations = element;

    assertNode(element);
    assertEventName(eventName);
    assertEventSelector(selector);
    assertEventCallback(callback);

    // get all delegations
    const delegations = delegatedElement[EVENT_CALLBACKS_SYMBOL] = delegatedElement[EVENT_CALLBACKS_SYMBOL] || {};
    // initialize the delegation list
    const callbacks: DelegationList = delegations[eventName] = delegations[eventName] || {
        descriptors: [],
    };
    const descriptors = callbacks.descriptors;
    // check if the event has already been delegated
    if (!callbacks.listener) {
        // setup the listener
        callbacks.listener = (event) => {
            if (!event.target) {
                return;
            }
            const eventTarget = event.target as Node;
            // wrap the Event's stopPropagation in order to prevent other delegations from the same root
            let stopped = false;
            let stoppedImmediated = false;
            const originalStopPropagation = event.stopPropagation;
            const originalImmediatePropagation = event.stopImmediatePropagation;
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
            const filtered: { target: Node; callback: DelegatedEventCallback; }[] = [];
            for (let i = 0; i < descriptors.length; i++) {
                let { selector, callback } = descriptors[i];
                let selectorTarget;
                if (selector) {
                    let target = eventTarget;
                    while (target && target !== element) {
                        if (isElement(target) && DOM.matches(target, selector)) {
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

const assertNode = (element: any) => {
    if (!isElement(element)) {
        throw new TypeError('The provided element must be a Node');
    }
};

const assertEvent = (event: any) => {
    if (!isEvent(event)) {
        throw new TypeError('The provided object must be an Event');
    }
};

const assertEventName = (eventName: any) => {
    if (typeof eventName !== 'string') {
        throw new TypeError('The provided event name must be a string');
    }
};

const assertEventSelector = (selector: any) => {
    if (selector !== null && typeof selector !== 'string') {
        throw new TypeError('The provided selector must be a string or null');
    }
};

const assertEventCallback = (callback: any) => {
    if (typeof callback !== 'function') {
        throw new TypeError('The provided callback must be a function');
    }
};

const assertEventBubbles = (bubbles: any) => {
    if (typeof bubbles !== 'boolean') {
        throw new TypeError('The provided bubbles option must be a boolean');
    }
};

const assertEventCancelable = (cancelable: any) => {
    if (typeof cancelable !== 'boolean') {
        throw new TypeError('The provided cancelable option must be a boolean');
    }
};

const assertEventComposed = (composed: any) => {
    if (typeof composed !== 'undefined' && typeof composed !== 'boolean') {
        throw new TypeError('The provided composed option must be a boolean');
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

    return DOM.createEvent(event, {
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
    return DOM.HTMLElement.prototype.dispatchEvent.call(element, event);
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
export const dispatchAsyncEvent = async (element: Element, event: Event | string, detail?: CustomEventInit, bubbles: boolean = true, cancelable: boolean = true, composed: boolean = false): Promise<any[]> => {
    const asyncEvent = initEvent(event, detail, bubbles, cancelable, composed) as unknown as AsyncEvent;
    const promises: any[] = [];
    asyncEvent.respondWith = function(callback) {
        promises.push(callback());
    };
    if (!dispatchEvent(element, asyncEvent)) {
        throw new Error('event has been canceled');
    }
    return await Promise.all(promises);
};

/**
 * Add a listener to the listeners accessor.
 * @param constructor The element constructor.
 * @param methodKey The name of the method to invoke.
 * @param descriptor The event descriptor.
 */
const addListener = (constructor: Function, methodKey: PropertyKey, descriptor: DelegatedEventDescriptor) => {
    const prototype = constructor.prototype;
    const listeners = prototype.listeners || {};
    listeners[`${descriptor.event} ${descriptor.selector || ''}`] = prototype[methodKey];
    Object.defineProperty(prototype, 'listeners', {
        value: listeners,
        configurable: true,
        writable: false,
    });
};

/**
 * Bind a method to an event listener.
 *
 * @param descriptor The listener description.
 * @return The decorator initializer.
 */
export const listener = (descriptor: DelegatedEventDescriptor) =>
    ((targetOrClassElement: CustomElement, methodKey: string) => {
        if (methodKey !== undefined) {
            // decorators spec 1
            addListener(targetOrClassElement.constructor, methodKey, descriptor);
            return targetOrClassElement;
        }

        // decorators spec 2
        const element = targetOrClassElement as unknown as ClassElement;
        if (element.kind === 'method' && element.placement === 'prototype') {
            element.finisher = (constructor: Function) => {
                addListener(constructor, element.key, descriptor);
            };
        }

        return element;
    }) as any;
