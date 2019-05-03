/**
 * A Symbol which contains all Node delegation.
 */
const EVENT_CALLBACKS_SYMBOL = Symbol();

/**
 * Describe the signature of a delegated event callback.
 * @param event The original DOM event.
 * @param target The matched delegated element.
 */
export type DelegatedEventCallback = (event: Event, target?: HTMLElement) => any;

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
 */
export function delegate(element: HTMLElement, eventName: string, selector: string | undefined, callback: DelegatedEventCallback) {
    const delegatedElement: HTMLElement & WithEventDelegations = element;
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
            const eventTarget = ev.target as HTMLElement;
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
            let filtered: { target: HTMLElement; callback: DelegatedEventCallback; }[] = [];
            for (let i = 0; i < descriptors.length; i++) {
                let { selector, callback } = descriptors[i];
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
export function undelegate(element: HTMLElement, eventName?: string, selector?: string, callback?: DelegatedEventCallback) {
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
            const { descriptors, listener } = delegations[eventName];
            if (!callback) {
                descriptors.forEach((descriptor) => {
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
