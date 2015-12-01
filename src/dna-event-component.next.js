'use strict';

import { DNAComponent } from 'dna-component.next.js'

/**
 * Simple Custom Component with `addEventListener` polyfill and a `dispatchEvent` wrapper named `trigger`.
 */
export class DNAEventComponent extends DNAComponent {
	/**
	 * `Node.prototype.addEventListener` polyfill.
	 * @param {String} evName The name of the event to listen.
	 * @param {Function} callback The callback for the event.
	 */
	addEventListener(evName, callback) {
		if (typeof Node.prototype.addEventListener !== 'undefined') {
			return Node.prototype.addEventListener.call(this, evName, callback);
		} else if (typeof Node.prototype.attachEvent !== 'undefined') {
			return Node.prototype.attachEvent.call(this, 'on' + evName, callback);
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
		var ev = DNAEventComponent.createEvent();
		if (ev) {
			if (typeof ev.initEvent !== 'undefined') {
				ev.initEvent(evName, bubbles, cancelable);
			}
			ev.detail = data;
			if (typeof Node.prototype.dispatchEvent !== 'undefined') {
				return Node.prototype.dispatchEvent.call(this, ev);
			} else if (typeof Node.prototype.fireEvent !== 'undefined') {
				return Node.prototype.fireEvent.call(this, 'on' + evName, ev);
			}
		}
	}
	/**
	 * Create an Event instance.
	 * @param {String} type The event type.
	 * @return {Event} The created event.
	 */
	static createEvent(type = 'Event') {
		if (typeof document.createEvent !== 'undefined') {
			return document.createEvent(type);
		} else if (typeof document.createEventObject !== 'undefined') {
			return document.createEventObject();
		}
	}
}
