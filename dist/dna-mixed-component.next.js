'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DNAMixedComponent = (function (_DNABaseComponent) {
	_inherits(DNAMixedComponent, _DNABaseComponent);

	function DNAMixedComponent() {
		_classCallCheck(this, DNAMixedComponent);

		_get(Object.getPrototypeOf(DNAMixedComponent.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(DNAMixedComponent, [{
		key: 'createdCallback',
		value: function createdCallback() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			DNABaseComponent.prototype.createdCallback.apply(this, args);
			DNAMixedComponent.triggerCallbacks(this, 'created', args);
		}
	}, {
		key: 'attachedCallback',
		value: function attachedCallback() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			DNABaseComponent.prototype.attachedCallback.apply(this, args);
			DNAMixedComponent.triggerCallbacks(this, 'attached', args);
		}
	}, {
		key: 'attributeChangedCallback',
		value: function attributeChangedCallback() {
			for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				args[_key3] = arguments[_key3];
			}

			DNABaseComponent.prototype.attributeChangedCallback.apply(this, args);
			DNAMixedComponent.triggerCallbacks(this, 'attributeChanged', args);
		}
	}], [{
		key: 'init',
		value: function init() {
			for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				args[_key4] = arguments[_key4];
			}

			DNABaseComponent.init.apply(this, args);
			var behaviors = this['behaviors'] || [];
			DNAMixedComponent.iterateBehaviors(this, behaviors);
			DNAMixedComponent.triggerCallbacks(this, 'init', args);
		}
	}, {
		key: 'triggerCallbacks',
		value: function triggerCallbacks(ctx, callback, args) {
			var callbacks = ctx[DNAMixedComponent.getCallbackKey(callback)];
			if (callbacks && Array.isArray(callbacks)) {
				for (var i = 0, len = callbacks.length; i < len; i++) {
					var _callbacks$i;

					(_callbacks$i = callbacks[i]).apply.apply(_callbacks$i, [ctx].concat(_toConsumableArray(args)));
				}
			}
		}
	}, {
		key: 'iterateBehaviors',
		value: function iterateBehaviors(ctx, behaviors) {
			if (Array.isArray(behaviors)) {
				for (var i = 0; i < behaviors.length; i++) {
					DNAMixedComponent.iterateBehaviors(ctx, behaviors[i]);
				}
			} else {
				var callbacks = DNAMixedComponent.componentCallbacks,
				    keys = Object.getOwnPropertyNames(behaviors);
				for (var k in keys) {
					var key = keys[k];
					if (!(key in DNABaseComponent)) {
						ctx[key] = behaviors[key];
					}
					if (callbacks.indexOf(key) !== -1) {
						var callbackKey = DNAMixedComponent.getCallbackKey(key);
						ctx[callbackKey] = ctx[callbackKey] || [];
						ctx[callbackKey].push(behaviors[key]);
					} else if (!(key in DNABaseComponent)) {
						ctx[key] = behaviors[key];
					}
				}
				if (behaviors.prototype) {
					keys = Object.getOwnPropertyNames(behaviors.prototype);
					for (var k in keys) {
						var key = keys[k];
						if (callbacks.indexOf(key) !== -1) {
							var callbackKey = DNAMixedComponent.getCallbackKey(key);
							ctx.prototype[callbackKey] = ctx.prototype[callbackKey] || [];
							ctx.prototype[callbackKey].push(behaviors.prototype[key]);
						} else if (!(key in DNABaseComponent.prototype)) {
							ctx.prototype[key] = behaviors.prototype[key];
						}
					}
				}
			}
		}
	}, {
		key: 'getCallbackKey',
		value: function getCallbackKey(callback) {
			return '__' + callback + 'Callbacks';
		}
	}, {
		key: 'componentCallbacks',
		get: function get() {
			return ['init', 'created', 'attached', 'attributeChanged'];
		}
	}]);

	return DNAMixedComponent;
})(DNABaseComponent);
//# sourceMappingURL=dna-mixed-component.next.js.map
