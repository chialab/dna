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
 * @param {String} selector The CSS selector to match.
 * @param {Function} callback The original callback for the event.
 * @return {Function} Wrapped callback with a delegation check.
 */
function delegateCallback(selector, callback) {
    return (ev) => {
        let target = checkDelegate(ev, this.node, selector);
        if (target) {
            callback.call(this, ev, target);
        }
    };
}

/**
 * Simple Custom Component with events delegation,
 * It also implement a `dispatchEvent` wrapper named `trigger`.
 * @mixin EventsMixin
 * @memberof DNA.MIXINS.
 * @static
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
    constructor(node) {
        super(node);
        let events = reduceObjectProperty(this, 'events');
        for (let k in events) {
            let callback = isString(events[k]) ?
                this[events[k]] :
                events[k];
            if (isFunction(callback)) {
                let ev = k.trim().split(' ');
                let name = ev.shift();
                let selector = ev.join(' ');
                events[k] = {
                    name,
                    selector,
                    callback: delegateCallback.call(this, selector, callback),
                };
            } else {
                throw new TypeError('Invalid callback for event.');
            }
        }
        define(this, 'events', { value: events });
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
        for (let k in events) {
            this.addEventListener(events[k].name, events[k].callback);
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
        for (let k in events) {
            this.removeEventListener(events[k].name, events[k].callback);
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
        let wrapCallback = delegateCallback.call(this, selector, callback);
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
