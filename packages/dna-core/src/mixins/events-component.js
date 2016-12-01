import { reduce, reduceProperty } from '../lib/reduce.js';
import { isString, isFunction } from '../lib/typeof.js';
import { matches } from '../lib/matches.js';
import { dispatch } from '../lib/dispatch.js';
import { EVENTS_SYMBOL } from '../lib/symbols.js';

const SPLIT_SELECTOR = /([^\s]+)(.*)?/;

function addToPrivate(scope, evName, callback) {
    let internal = scope[EVENTS_SYMBOL] = scope[EVENTS_SYMBOL] || {};
    let events = internal[evName] = internal[evName] || [];
    events.push(callback);
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
    constructor() {
        super();
        let protoEvents = reduceProperty(this, 'events');
        let events = reduce(protoEvents, (evs, proto) => {
            for (let k in proto) {
                if (!evs.hasOwnProperty(k)) {
                    evs[k] = proto[k];
                }
            }
            return evs;
        }, {});
        Object.defineProperty(this, 'events', { value: events });
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
                    let wrapCallback = (event) => {
                        callback.call(this, event, this);
                    };
                    this.node.addEventListener(evName, wrapCallback);
                    addToPrivate(this, evName, wrapCallback);
                }
            } else {
                throw new TypeError('Invalid callback for event.');
            }
        }
    }
    /**
     * Detach and undelegate events from the component.
     * @method disconnectedCallback
     * @memberof DNA.MIXINS.EventsMixin
     * @instance
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        let events = this[EVENTS_SYMBOL] || {};
        for (let k in events) {
            events[k].forEach((callback) => this.node.removeEventListener(k, callback));
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
        let wrapCallback = (event) => {
            let target = event.target;
            let node = this.node;
            while (target && target !== node) {
                if (matches.call(target, selector)) {
                    callback.call(this, event, target);
                }
                target = target.parentNode;
            }
        };
        this.node.addEventListener(evName, wrapCallback);
        addToPrivate(this, evName, wrapCallback);
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
        return dispatch(this.node, evName, data, bubbles, cancelable);
    }
};
