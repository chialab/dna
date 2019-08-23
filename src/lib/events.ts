import { createSymbolKey } from './symbols';
import { DOM } from './dom';

/**
 * A Symbol which contains all Node delegation.
 */
const EVENT_CALLBACKS_SYMBOL: unique symbol = createSymbolKey() as any;

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
     * The callback for the delegated event.
     */
    callback: DelegatedEventCallback;
    /**
     * The selector for the delegated event.
     */
    selector?: string;
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
    listener?: EventListenerOrEventListenerObject;
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
export function delegate(element: Node, eventName: string, selector: string, callback: DelegatedEventCallback, options?: AddEventListenerOptions) {
    const delegatedElement: Node & WithEventDelegations = element;
    if (!(element instanceof DOM.Node)) {
        throw new TypeError('The provided element is not a Node');
    }
    if (typeof eventName !== 'string') {
        throw new TypeError('The provided event name is not a string');
    }
    if (typeof selector !== 'string') {
        throw new TypeError('The provided selector is not a string');
    }
    if (typeof callback !== 'function') {
        throw new TypeError('The provided callback is not a function');
    }
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
        callbacks.listener = (ev) => {
            if (!ev.target) {
                return;
            }
            const PROTOTYPE = DOM.HTMLElement.prototype;
            const ELEMENT_NODE = DOM.Node.ELEMENT_NODE;
            const MATCH = PROTOTYPE.matches ||
                PROTOTYPE.webkitMatchesSelector ||
                (PROTOTYPE as any).msMatchesSelector as typeof DOM.HTMLElement.prototype.matches;
            const eventTarget = ev.target as Node;
            // wrap the Event's stopPropagation in order to prevent other delegations from the same root
            let stopped = false;
            ev.stopPropagation = () => {
                stopped = true;
                // exec the real stopPropagation method
                return Event.prototype.stopPropagation.call(ev);
            };
            ev.stopImmediatePropagation = () => {
                stopped = true;
                // exec the real stopPropagation method
                return Event.prototype.stopImmediatePropagation.call(ev);
            };

            // filter matched selector for the event
            let filtered: { target: Node; callback: DelegatedEventCallback; }[] = [];
            for (let i = 0; i < descriptors.length; i++) {
                let { selector, callback } = descriptors[i];
                let selectorTarget;
                if (selector) {
                    let target = eventTarget;
                    while (target && target !== element) {
                        if (target.nodeType === ELEMENT_NODE && MATCH.call(target, selector)) {
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
                        callback,
                    });
                }
            }

            filtered
                // reorder targets by position in the dom tree.
                .sort(({ target: target1 }, { target: target2 }) => (target1.contains(target2) ? 1 : -1))
                // trigger the callback
                .forEach(({ callback, target }) => {
                    if (!stopped) {
                        callback.call(element, ev, target);
                    }
                });
        };
        element.addEventListener(eventName, callbacks.listener, options);
    }
    // add the delegation to the list
    descriptors.push({ event: eventName, callback, selector });
}

/**
 * Remove an Event delegation.
 *
 * @param element The root element of the delegation
 * @param eventName The Event name to undelegate
 * @param selector The selector to undelegate
 * @param callback The callback to remove
 */
export function undelegate(element: Node, eventName?: string, selector?: string, callback?: DelegatedEventCallback) {
    if (!(element instanceof DOM.Node)) {
        throw new TypeError('The provided element is not a Node');
    }
    if (typeof eventName !== 'undefined' && typeof eventName !== 'string') {
        throw new TypeError('The provided event name is not a string');
    }
    if (typeof selector !== 'undefined' && typeof selector !== 'string') {
        throw new TypeError('The provided selector is not a string');
    }
    if (typeof callback !== 'undefined' && typeof callback !== 'function') {
        throw new TypeError('The provided callback is not a function');
    }

    const delegatedElement: Node & WithEventDelegations = element;
    // get all delegations
    const delegations = delegatedElement[EVENT_CALLBACKS_SYMBOL];
    if (!eventName) {
        if (delegations) {
            for (let eventName in delegations) {
                undelegate(element, eventName);
            }
        }
    } else {
        // check the delegation to remove exists
        if (delegations && (eventName in delegations)) {
            const { descriptors, listener } = delegations[eventName];
            if (!callback) {
                descriptors.slice(0).forEach((descriptor, index) => {
                    undelegate(element, eventName, descriptor.selector, descriptor.callback);
                });
            } else if (listener) {
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
            }
        }
    }
}

/**
 * Dispatch a custom Event.
 *
 * @param event The event to dispatch or the name of the synthetic event to create.
 * @param detail Detail object of the event.
 * @param bubbles Should the event bubble.
 * @param cancelable Should the event be cancelable.
 * @param composed Is the event composed.
 */
export function dispatchEvent(element: Node, event: Event): boolean;
export function dispatchEvent(element: Node, event: string, detail?: CustomEventInit, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean;
export function dispatchEvent(element: Node, event: Event | string, detail?: CustomEventInit, bubbles: boolean = true, cancelable: boolean = true, composed?: boolean): boolean {
    if (!(element instanceof DOM.Node)) {
        throw new TypeError('The provided element is not a Node');
    }

    if (typeof event === 'string') {
        if (typeof bubbles !== 'boolean') {
            throw new TypeError('The provided bubbles option is not a boolean');
        }
        if (typeof cancelable !== 'boolean') {
            throw new TypeError('The provided cancelable option is not a boolean');
        }
        if (typeof composed !== 'undefined' && typeof composed !== 'boolean') {
            throw new TypeError('The provided composed option is not a boolean');
        }

        event = new DOM.CustomEvent(event, {
            detail,
            bubbles,
            cancelable,
            composed,
        });
    } else if (!(event instanceof DOM.Event)) {
        throw new TypeError('The provided event is not an Event');
    }

    return DOM.Node.prototype.dispatchEvent.call(element, event);
}
