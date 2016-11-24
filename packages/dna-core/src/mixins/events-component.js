import { isString, isFunction } from '../lib/typeof.js';
import { matches } from '../polyfills/matches.js';
import { dispatch } from '../lib/dispatch.js';

const SPLIT_SELECTOR = /([^\s]+)(.*)?/;

/**
 * Simple Custom Component with events delegation,
 * It also implement a `dispatchEvent` wrapper named `trigger`.
 * @mixin EventsMixin
 * @memberof DNA.MIXINS.
 * @static
 *
 * @example
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
 * @example
 * // app.js
 * import { define } from '@dnajs/core';
 * import { MyComponent } from './my-component.js';
 * define('my-component', MyComponent);
 * var element = new MyComponent();
 * var button = document.createElement('button');
 * button.innerText = 'Click me';
 * element.appendChild(button);
 * button.click(); // logs "button clicked"
 */
export const EventsMixin = (SuperClass) => class extends SuperClass {
    /**
     * Attach and delegate events to the component.
     * @method constructor
     * @memberof DNA.MIXINS.EventsMixin
     * @instance
     */
    constructor() {
        super();
        // bind events
        let events = this.events || {};
        for (let k in events) {
            let callback = isString(events[k]) ?
                this[events[k]] :
                events[k];
            if (isFunction(callback)) {
                let rule = k.match(SPLIT_SELECTOR);
                let evName = rule[1];
                let selector = (rule[2] || '').trim();
                if (selector) {
                    this.delegate(evName, selector, callback);
                } else {
                    this.addEventListener(evName, (ev) => {
                        callback.call(this, ev, this);
                    });
                }
            } else {
                throw new TypeError('Invalid callback for event.');
            }
        }
    }
    /**
     * Delegate events to the component descendents.
     * @method delegate
     * @memberof DNA.MIXINS.EventsMixin
     * @instance
     *
     * @param {String} evName The name of the event to delegate.
     * @param {String} selector A CSS selector for descendents.
     * @param {Function} callback The callback to fire when the event fires.
     */
    delegate(evName, selector, callback) {
        this.addEventListener(evName, (event) => {
            let target = event.target;
            while (target && target !== this) {
                if (matches.call(target, selector)) {
                    callback.call(this, event, target);
                }
                target = target.parentNode;
            }
        });
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
