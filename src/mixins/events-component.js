import { isString, isFunction } from './lib/typeof.js';
import { dispatch } from './lib/dispatch.js';

const SPLIT_SELECTOR = /([^\s]+)(.*)?/;

/**
 * Simple Custom Component with events delegation,
 * It also implement a `dispatchEvent` wrapper named `trigger`.
 *
 * @example
 * my-component.js
 * ```js
 * import { EventsMixin, Component, mix } from 'dna/component';
 * export class MyComponent extends mix(Component).with(EventsMixin) {
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
 * app.js
 * ```js
 * import { define } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
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
     * Fires when an instance of the element is created.
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
    delegate(evName, selector, callback) {
        this.addEventListener(evName, (event) => {
            let target = event.target;
            while (target && target !== this) {
                if (target.matches(selector)) {
                    callback.call(this, event, target);
                }
                target = target.parentNode;
            }
        });
    }
    /**
     * `Node.prototype.dispatchEvent` wrapper.
     * @param {String} evName The name of the event to fire.
     * @param {Object} data A set of custom data to pass to the event.
     * @param {Boolean} bubbles Should the event bubble throw the DOM tree.
     * @param {Boolean} cancelable Can be the event cancel by a callback.
     */
    trigger(evName, data, bubbles = true, cancelable = true) {
        return dispatch(this, evName, data, bubbles, cancelable);
    }
};
