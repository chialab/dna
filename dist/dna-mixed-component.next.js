'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This is another model to use to create DNA Custom Components mixing a list of prototypes.
 * Implement a get method for the `behaviors` property which returns a list of Prototypes.
 */

var DNAMixedComponent = (function (_DNABaseComponent) {
	_inherits(DNAMixedComponent, _DNABaseComponent);

	function DNAMixedComponent() {
		_classCallCheck(this, DNAMixedComponent);

		_get(Object.getPrototypeOf(DNAMixedComponent.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(DNAMixedComponent, [{
		key: 'createdCallback',

		/**
   * Trigger all `created` methods of the implemented behaviors.
   * @private
   */
		value: function createdCallback() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			DNABaseComponent.prototype.createdCallback.apply(this, args);
			DNAMixedComponent.__triggerCallbacks(this, 'created', args);
		}

		/**
   * Trigger all `attached` methods of the implemented behaviors.
   * @private
   */
	}, {
		key: 'attachedCallback',
		value: function attachedCallback() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			DNABaseComponent.prototype.attachedCallback.apply(this, args);
			DNAMixedComponent.__triggerCallbacks(this, 'attached', args);
		}

		/**
   * Trigger all `attributeChanged` methods of the implemented behaviors.
   * @private
   * @param {String} attrName The changed attribute name.
      * @param {*} oldVal The value of the attribute before the change.
      * @param {*} newVal The value of the attribute after the change.
      */
	}, {
		key: 'attributeChangedCallback',
		value: function attributeChangedCallback(attrName, oldVal, newVal) {
			DNABaseComponent.prototype.attributeChangedCallback.apply(this, [attrName, oldVal, newVal]);
			DNAMixedComponent.__triggerCallbacks(this, 'attributeChanged', [attrName, oldVal, newVal]);
		}

		/**
   * Iterate and fire a list of callbacks.
   * @private
   * @param {DNABaseComponent} ctx The context to apply.
   * @param {String} callbackKey The key to use to retrieve the right callback list.
   * @param {Array} args A list of arguments to apply to the callback.
   */
	}], [{
		key: 'init',

		/**
   * Attach behaviors' static and class methods and properties to the current class.
   * Trigger all `init` static methods of the implemented behaviors.
   */
		value: function init() {
			for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				args[_key3] = arguments[_key3];
			}

			DNABaseComponent.init.apply(this, args);
			var behaviors = this['behaviors'] || [];
			DNAMixedComponent.__iterateBehaviors(behaviors);
			DNAMixedComponent.__triggerCallbacks(this, 'init', args);
		}
	}, {
		key: '__triggerCallbacks',
		value: function __triggerCallbacks(ctx, callbackKey, args) {
			var callbacks = ctx[DNAMixedComponent.__getCallbackKey(callbackKey)];
			if (callbacks && Array.isArray(callbacks)) {
				for (var i = 0, len = callbacks.length; i < len; i++) {
					var _callbacks$i;

					(_callbacks$i = callbacks[i]).apply.apply(_callbacks$i, [ctx].concat(_toConsumableArray(args)));
				}
			}
		}

		/**
   * Iterate and attach behaviors to the class.
   * @private
   * @param {Array} behavior A list of classes.
   */
	}, {
		key: '__iterateBehaviors',
		value: function __iterateBehaviors(behavior) {
			var ctx = this;
			if (Array.isArray(behavior)) {
				// if the provided behavior is complex (a list of other behaviors), iterate it.
				for (var i = 0; i < behavior.length; i++) {
					DNAMixedComponent.__iterateBehaviors(ctx, behavior[i]);
				}
			} else {
				// check if the behavior is already attached to the class.
				ctx.__attachedBehaviors = ctx.__attachedBehaviors || [];
				if (ctx.__attachedBehaviors.indexOf(behavior.name) !== -1) {
					return;
				}
				// iterate and attach static methods and priorities.
				var callbacks = DNAMixedComponent.__componentCallbacks,
				    keys = Object.getOwnPropertyNames(behavior);
				for (var k in keys) {
					var key = keys[k];
					if (!(key in DNABaseComponent)) {
						ctx[key] = behavior[key];
					}
					if (callbacks.indexOf(key) !== -1) {
						var callbackKey = DNAMixedComponent.__getCallbackKey(key);
						ctx[callbackKey] = ctx[callbackKey] || [];
						ctx[callbackKey].push(behavior[key]);
					} else if (!(key in DNABaseComponent)) {
						ctx[key] = behavior[key];
					}
				}
				// iterate and attach prototype methods and priorities.
				if (behavior.prototype) {
					keys = Object.getOwnPropertyNames(behavior.prototype);
					for (var k in keys) {
						var key = keys[k];
						if (callbacks.indexOf(key) !== -1) {
							var callbackKey = DNAMixedComponent.__getCallbackKey(key);
							ctx.prototype[callbackKey] = ctx.prototype[callbackKey] || [];
							ctx.prototype[callbackKey].push(behavior.prototype[key]);
						} else if (!(key in DNABaseComponent.prototype)) {
							ctx.prototype[key] = behavior.prototype[key];
						}
					}
				}
				// add the callback to the attached list
				ctx.__attachedBehaviors.push(behavior.name);
			}
		}

		/**
   * Retrieve the key to use to register a callback.
   * @private
   * @param {String} callbackName The type of the callback to register.
   * @return {String} The key string.
   */
	}, {
		key: '__getCallbackKey',
		value: function __getCallbackKey(callbackName) {
			return '__' + callbackName + 'Callbacks';
		}

		/**
   * Retrieve a list of callbacks that should not be overridden but concatenated.
   * @private
   * @return {Array} The list.
   */
	}, {
		key: '__componentCallbacks',
		get: function get() {
			return ['init', 'created', 'attached', 'attributeChanged'];
		}
	}]);

	return DNAMixedComponent;
})(DNABaseComponent);
//# sourceMappingURL=dna-mixed-component.next.js.map
