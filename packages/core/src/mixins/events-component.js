import { define } from '../helpers/obj-define.js';
import { reduceObjectProperty } from '../lib/reduce.js';
import { isString, isFunction } from '../lib/typeof.js';
import { matches } from '../helpers/matches.js';
import { dispatch } from '../lib/dispatch.js';

/**
 * Check if an event has a selector in mathc in target list.
 * @private
 *
 * @param {Event} event The event to check.
 * @param {HTMLElement} node The root node.
 * @param {String} selector The CSS selector to match.
 * @return {HTMLElement} The element in target list which matches the selector.
 */
function checkDelegate(event, node, selector) {
    if (!selector) {
        return node;
    }
    let target = event.target;
    while (target && target !== node) {
        if (matches(target, selector)) {
            return target;
        }
        target = target.parentNode;
    }
    return null;
}
/**
 * Generate a delegate listener for an event.
 * @private
 *
 * @param {String} eventName The Event name to register.
 * @param {String} selector The CSS selector to match.
 * @param {Function} callback The original callback for the event.
 * @return {Function} Wrapped callback with a delegation check.
 */
function delegateCallback(eventName, selector, callback) {
    if (!isFunction(callback)) {
        throw new TypeError('Invalid callback for event.');
    }
    const events = this.events;
    const callbacks = events[eventName] ? events[eventName].callbacks : [];
    callbacks.push({
        selector,
        callback,
    });
    const eventCallback = (ev) => {
        let stopped = false;
        const originalStopPropagation = ev.stopPropagation;
        ev.stopPropagation = () => {
            stopped = true;
            return originalStopPropagation.call(ev);
        };
        callbacks
            // check valid target for the event.
            .map((desc) => {
                let target = checkDelegate(ev, this.node, desc.selector);
                if (target) {
                    return {
                        target,
                        callback: desc.callback,
                    };
                }
            })
            .filter((desc) => !!desc)
            // reorder targets by position in the dom tree.
            .sort((desc1, desc2) => (desc1.target.contains(desc2.target) ? 1 : -1))
            // trigger the callback
            .forEach((desc) => {
                if (!stopped) {
                    desc.callback.call(this, ev, desc.target);
                }
            });
    };
    eventCallback.callbacks = callbacks;
    events[eventName] = eventCallback;
    return eventCallback;
}

/**
 * Simple Custom Component with events delegation,
 * It also implement a `dispatchEvent` wrapper named `trigger`.
 * @mixin EventsMixin
 * @memberof DNA.MIXINS
 *
 * @param {Function} SuperClass The class to extend.
 * @return {Function} The extended class.
 *
 * @example
 * ```js
 * // my-component.js
 * import { BaseComponent } from '@dnajs/core';
 * export class MyComponent extends BaseComponent {
 *   get events() {
 *     return {
 *       'click button': 'onButtonClick'
 *     }
 *   }
 *   onButtonClick() {
 *     console.log('button clicked');
 *   }
 * }
 * ```
 * ```js
 * // app.js
 * import { define } from '@dnajs/core';
 * import { MyComponent } from './my-component.js';
 * define('my-component', MyComponent);
 * var element = new MyComponent();
 * var button = document.createElement('button');
 * button.innerText = 'Click me';
 * element.appendChild(button);
 * button.click(); // logs "button clicked"
 * ```
 */
export const EventsMixin = (SuperClass) => class extends SuperClass {
    /**
     * Iterate `events` properties.
     * @method constructor
     * @memberof DNA.MIXINS.EventsMixin
     * @instance
     */
    constructor(...args) {
        super(...args);
        let events = reduceObjectProperty(this, 'events');
        define(this, 'events', { value: {} });
        for (let k in events) {
            let callback = isString(events[k]) ?
                this[events[k]] :
                events[k];
            let ev = k.trim().split(' ');
            let evName = ev.shift();
            let selector = ev.join(' ');
            delegateCallback.call(this, evName, selector, callback);
        }
    }
    /**
     * Attach and delegate events to the component.
     * @method connectedCallback
     * @memberof DNA.MIXINS.EventsMixin
     * @instance
     */
    connectedCallback() {
        super.connectedCallback();
        // bind events
        let events = this.events;
        for (let evName in events) {
            this.addEventListener(evName, events[evName]);
        }
    }
    /**
     * Detach and undelegate events from the component.
     * @method disconnectedCallback
     * @memberof DNA.MIXINS.EventsMixin
     * @instance
     */
    disconnectedCallback() {
        let events = this.events;
        for (let evName in events) {
            this.removeEventListener(evName, events[evName]);
        }
        super.disconnectedCallback();
    }
    /**
     * Delegate events to the component descendents.
     * @method delegate
     * @memberof DNA.MIXINS.EventsMixin
     * @instance
     *
     * @param {String} evName The name of the event to delegate.
     * @param {String} selector A CSS selector for descendents.
     * @param {Function} callback The callback to fire.
     */
    delegate(evName, selector, callback) {
        if (this.events[evName]) {
            this.removeEventListener(evName, this.events[evName]);
        }
        let wrapCallback = delegateCallback.call(this, evName, selector, callback);
        return this.addEventListener(evName, wrapCallback);
    }
    /**
     * `Node.prototype.dispatchEvent` wrapper.
     * @method trigger
     * @memberof DNA.MIXINS.EventsMixin
     * @instance
     *
     * @param {String} evName The name of the event to fire.
     * @param {Object} data A set of custom data to pass to the event.
     * @param {Boolean} bubbles Should the event bubble throw the DOM tree.
     * @param {Boolean} cancelable Can be the event cancel by a callback.
     * @return {Boolean} True if event propagation has not be stopped.
     */
    trigger(evName, data, bubbles = true, cancelable = true) {
        return dispatch(this, evName, data, bubbles, cancelable);
    }
};
