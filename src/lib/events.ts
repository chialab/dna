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

export type WithEventDelegations = {
    [EVENT_CALLBACKS_SYMBOL]?: {
        [key: string]: EventDescriptor[];
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
    const callbacks = delegations[eventName] = delegations[eventName] || [];
    // check if the event has already been delegated
    if (!callbacks.length) {
        // setup the listener
        element.addEventListener(eventName, (ev) => {
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
            callbacks
                // check valid target for the event.
                .reduce((filtered: { target: HTMLElement; callback: EventCallback; }[], { selector, callback }) => {
                    let target = selector ? eventTarget.closest(selector) as HTMLElement : element;
                    if (target) {
                        filtered.push({
                            target,
                            callback,
                        });
                    }
                    return filtered;
                }, [])
                // reorder targets by position in the dom tree.
                .sort(({ target: target1 }, { target: target2 }) => (target1.contains(target2) ? 1 : -1))
                // trigger the callback
                .forEach(({ callback, target }) => {
                    if (!stopped) {
                        callback.call(element, ev, target);
                    }
                });
        });
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
export function undelegate(element: HTMLElement, eventName: string, selector: string | undefined, callback: EventCallback) {
    const delegatedElement: HTMLElement & WithEventDelegations = element;
    // get all delegations
    const delegations = delegatedElement[EVENT_CALLBACKS_SYMBOL];
    // check the delegation to remove exists
    if (delegations && (eventName in delegations)) {
        // get the list of delegations
        const callbacks = delegations[eventName];
        // find the index of the callback to remove in the list
        const io = callbacks
            .map((descriptor) => descriptor.callback)
            .indexOf(callback);
        if (io !== -1) {
            // remove the callback
            callbacks.splice(io, 1);
        }
    }
}
