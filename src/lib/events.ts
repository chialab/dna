/**
 * A Symbol which contains all Node delegation.
 */
const EVENT_CALLBACKS_SYMBOL = Symbol();

export type EventCallback = (event: Event, target?: HTMLElement) => any;

export type EventDescriptor = {
    event: string;
    callback: EventCallback;
    selector?: string;
};

export type EventDescriptors = {
    [key: string]: EventCallback;
}

type DelegationList = EventDescriptor[] & { listener: EventCallback }

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
 */
export function delegate(element: HTMLElement, eventName: string, selector: string | undefined, callback: EventCallback) {
    const delegatedElement: HTMLElement & WithEventDelegations = element;
    // get all delegations
    const delegations = delegatedElement[EVENT_CALLBACKS_SYMBOL] = delegatedElement[EVENT_CALLBACKS_SYMBOL] || {};
    // initialize the delegation list
    const callbacks: DelegationList = delegations[eventName] = delegations[eventName] || [];
    // check if the event has already been delegated
    if (!callbacks.length) {
        // setup the listener
        callbacks.listener = (ev) => {
            if (!ev.target) {
                return;
            }
            const eventTarget = ev.target as HTMLElement;
            // wrap the Event's stopPropagation in order to prevent other delegations from the same root
            let stopped = false;
            ev.stopPropagation = () => {
                stopped = true;
                // exec the real stopPropagation method
                return Event.prototype.stopPropagation.call(ev);
            };

            // filter matched selector for the event
            let filtered: { target: HTMLElement; callback: EventCallback; }[] = [];
            for (let i = 0; i < callbacks.length; i++) {
                let { selector, callback } = callbacks[i];
                let target = selector ? eventTarget.closest(selector) as HTMLElement : element;
                if (target) {
                    filtered.push({
                        target,
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
        element.addEventListener(eventName, callbacks.listener);
    }
    // add the delegation to the list
    callbacks.push({ event: eventName, callback, selector });
}

/**
 * Remove an Event delegation.
 *
 * @param element The root element of the delegation
 * @param eventName The Event name to undelegate
 * @param selector The selector to undelegate
 * @param callback The callback to remove
 */
export function undelegate(element: HTMLElement, eventName?: string, selector?: string, callback?: EventCallback) {
    const delegatedElement: HTMLElement & WithEventDelegations = element;
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
            const callbacks = delegations[eventName];
            if (!callback) {
                callbacks.forEach((descriptor) => {
                    undelegate(element, eventName, descriptor.selector, descriptor.callback);
                });
            } else {
                // get the list of delegations
                // find the index of the callback to remove in the list
                for (let i = 0; i < callbacks.length; i++) {
                    let descriptor = callbacks[i];
                    if (descriptor.selector === selector && descriptor.callback === callback) {
                        callbacks.splice(i, 1);
                        if (callbacks.length === 0) {
                            element.removeEventListener(eventName, callbacks.listener);
                        }
                    }
                }
            }
        }
    }
}
