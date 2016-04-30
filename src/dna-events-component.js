import Delegate from './libs/dom-delegate.js';
import { DNAComponent } from './dna-component.js';

/**
 * Simple Custom Component with events delegation,
 * It also implement a `dispatchEvent` wrapper named `trigger`.
 * @class DNAEventsComponent
 * @extends DNAComponent
 *
 * @example
 * my-component.js
 * ```js
 * import { DNAEventsComponent } from 'dna/component';
 * export class MyComponent extends DNAEventsComponent {
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
 * import { Register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * var MyElement = Register(MyComponent);
 * var element = new MyElement();
 * var button = document.createElement('button');
 * button.innerText = 'Click me';
 * element.appendChild(button);
 * button.click(); // logs "button clicked"
 * ```
 */
export class DNAEventsComponent extends DNAComponent {
    /**
     * Fires when an instance of the element is created.
     */
    createdCallback() {
        // bind events
        let events = this.constructor.events;
        if (events) {
            let delegate = new Delegate(this);
            for (let k in events) {
                if (events.hasOwnProperty(k)) {
                    let callback = (typeof events[k] === 'string') ?
                        this[events[k]] :
                        events[k];
                    if (callback && typeof callback === 'function') {
                        let rule = k.split(' ');
                        let evName = rule.shift();
                        let selector = rule.join(' ');
                        let self = this;
                        if (selector) {
                            delegate.on(evName, selector, function(ev) {
                                callback.call(self, ev, this);
                            });
                        } else {
                            delegate.on(evName, function(ev) {
                                callback.call(self, ev, this);
                            });
                        }
                    }
                }
            }
        }
        super.createdCallback();
    }
    /**
     * `Node.prototype.dispatchEvent` wrapper.
     * @param {String} evName The name of the event to fire.
     * @param {Object} data A set of custom data to pass to the event.
     * @param {Boolean} bubbles Should the event bubble throw the DOM tree.
     * @param {Boolean} cancelable Can be the event cancel by a callback.
     */
    trigger(evName, data, bubbles = true, cancelable = true) {
        if (!evName) {
            throw new Error('Event name is undefined');
        }
        let ev = document.createEvent('Event');
        if (typeof ev.initEvent !== 'undefined') {
            ev.initEvent(evName, bubbles, cancelable);
        }
        if (data) {
            ev.detail = data;
        }
        return this.dispatchEvent(ev);
    }
}
