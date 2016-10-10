import { isString, isFunction } from './helpers/typeof.js';

const SPLIT_SELECTOR = /([^\s]+)(.*)?/;

function delegate(element, evName, selector, callback) {
    element.addEventListener(evName, (event) => {
        let target = event.target;
        while (target && target !== element) {
            if (target.matches(selector)) {
                if (callback.call(element, event, target) === false) {
                    return;
                }
            }
            target = target.parentNode;
        }
    });
}

/**
 * Simple Custom Component with events delegation,
 * It also implement a `dispatchEvent` wrapper named `trigger`.
 *
 * @example
 * my-component.js
 * ```js
 * import { EventsMixin, Component, mix } from 'dna/component';
 * export class MyComponent extends mix(Component).with(EventsMixin) {
 *   static get events() {
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
        let events = this.constructor.events || {};
        for (let k in events) {
            let callback = isString(events[k]) ?
                this[events[k]] :
                events[k];
            if (isFunction(callback)) {
                let rule = k.match(SPLIT_SELECTOR);
                let evName = rule[1];
                let selector = (rule[2] || '').trim();
                if (selector) {
                    delegate(this, evName, selector, (ev, target) => {
                        callback.call(this, ev, target);
                    });
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
     * `Node.prototype.dispatchEvent` wrapper.
     * @param {String} evName The name of the event to fire.
     * @param {Object} data A set of custom data to pass to the event.
     * @param {Boolean} bubbles Should the event bubble throw the DOM tree.
     * @param {Boolean} cancelable Can be the event cancel by a callback.
     */
    trigger(evName, data, bubbles = true, cancelable = true) {
        if (!isString(evName)) {
            throw new TypeError('Event name is undefined');
        }
        let ev = new CustomEvent(evName, {
            detail: data,
            bubbles,
            cancelable,
        });
        return this.dispatchEvent(ev);
    }
};
