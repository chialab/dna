'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Simple Custom Component with attributes watching and reflecting.
 */

var DNAAttributesComponent = (function (_DNABaseComponent) {
	_inherits(DNAAttributesComponent, _DNABaseComponent);

	function DNAAttributesComponent() {
		_classCallCheck(this, DNAAttributesComponent);

		_get(Object.getPrototypeOf(DNAAttributesComponent.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(DNAAttributesComponent, [{
		key: 'created',

		/**
   * On `created` callback, sync attributes with properties.
   */
		value: function created() {
			var attributes = this.attributes || [];
			for (var i = 0, len = attributes.length; i < len; i++) {
				var attr = attributes[i];
				this.attributeChanged(attr.name, undefined, attr.value);
			}
		}

		/**
   * On `attributeChanged` callback, sync attributes with properties.
   * @private
   * @param {String} attrName The changed attribute name.
      * @param {*} oldVal The value of the attribute before the change.
      * @param {*} newVal The value of the attribute after the change.
   */
	}, {
		key: 'attributeChanged',
		value: function attributeChanged(attr, oldVal, newVal) {
			var cl = this.constructor;
			if (cl && cl.attributes && Array.isArray(cl.attributes)) {
				if (cl.attributes.indexOf(attr)) {
					this[attr] = newVal;
				}
			}
		}
	}]);

	return DNAAttributesComponent;
})(DNABaseComponent);
//# sourceMappingURL=dna-attributes-component.next.js.map
