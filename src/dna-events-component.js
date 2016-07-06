import { DNAComponent } from './dna-component.js';

const EVENTS_CACHE = {};

function matches(element, selector) {
    let f = element.matches ||
        element.webkitMatchesSelector ||
        element.mozMatchesSelector ||
        element.msMatchesSelector ||
        function(s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };
    return f.call(element, selector);
}

function delegate(element, evName, selector, callback) {
    element.addEventListener(evName, (event) => {
        let target = event.target;
        while (target && target !== element) {
            if (matches(target, selector)) {
                callback.call(element, event, target);
                return;
            }
            target = target.parentNode;
        }
    });
}

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
 * import { register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * var MyElement = register('my-component', MyComponent);
 * var element = new MyElement();
 * var button = document.createElement('button');
 * button.innerText = 'Click me';
 * element.appendChild(button);
 * button.click(); // logs "button clicked"
 * ```
 */
export class DNAEventsComponent extends DNAComponent {
    /**
     * Fires when an the element is registered.
     * @param {String} id The element definition name.
     */
    static onRegister(is) {
        EVENTS_CACHE[is] = this.events;
    }
    /**
     * Fires when an instance of the element is created.
     */
    createdCallback() {
        // bind events
        let events = EVENTS_CACHE[this.is];
        if (events) {
            for (let k in events) {
                if (events.hasOwnProperty(k)) {
                    let callback = (typeof events[k] === 'string') ?
                        this[events[k]] :
                        events[k];
                    if (callback && typeof callback === 'function') {
                        let rule = k.split(' ');
                        let evName = rule.shift();
                        let selector = rule.join(' ');
                        if (selector) {
                            delegate(this, evName, selector, (ev, target) => {
                                callback.call(this, ev, target);
                            });
                        } else {
                            this.addEventListener(evName, (ev) => {
                                callback.call(this, ev, this);
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
