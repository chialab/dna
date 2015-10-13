'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Simple Custom Component with `addEventListener` polyfill and a `dispatchEvent` wrapper named `trigger`.
 */

var DNAEventComponent = (function (_DNABaseComponent) {
	_inherits(DNAEventComponent, _DNABaseComponent);

	function DNAEventComponent() {
		_classCallCheck(this, DNAEventComponent);

		_get(Object.getPrototypeOf(DNAEventComponent.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(DNAEventComponent, [{
		key: 'addEventListener',

		/**
   * `Node.prototype.addEventListener` polyfill.
   * @param {String} evName The name of the event to listen.
   * @param {Function} callback The callback for the event.
   */
		value: function addEventListener(evName, callback) {
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
	}, {
		key: 'trigger',
		value: function trigger(evName, data) {
			var bubbles = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
			var cancelable = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

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
	}], [{
		key: 'createEvent',
		value: function createEvent() {
			var type = arguments.length <= 0 || arguments[0] === undefined ? 'Event' : arguments[0];

			if (typeof document.createEvent !== 'undefined') {
				return document.createEvent(type);
			} else if (typeof document.createEventObject !== 'undefined') {
				return document.createEventObject();
			}
		}
	}]);

	return DNAEventComponent;
})(DNABaseComponent);
//# sourceMappingURL=dna-event-component.next.js.map
