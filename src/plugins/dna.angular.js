import { digest } from '../helpers/digest.js';
import { dashToCamel } from '../helpers/strings.js';

export * from '../dna.js';

const module = window.angular.module('dna-components', []);

function bindAttribute(element, $attrs, key) {
    $attrs.$observe(key, (newValue, oldValue) => {
        element.attributeChangedCallback(key, oldValue, newValue);
    });
}

/**
 * Register an Angular directive to the `dna-components` module.
 * `document.registerElement`-like interface.
 * @param {string} tagName The tag to use for the custom element. (required)
 * @param {object} config A configuration object. (`prototype` key is required)
 * @return {function} The Component constructor.
 */
export function register(fn, options = {}) {
    let pre = digest(fn, options);
    let scope = pre.scope;
    let tagName = pre.tagName;
    let ngDescriptor = {
        restrict: 'E',
    };
    ngDescriptor.controller = [
        '$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
            let element = $element[0];
            Object.setPrototypeOf(element, scope.prototype);
            element.is = tagName;
            element.$scope = $scope;
            element.$element = $element;
            element.$attrs = $attrs;
            element.constructor();
            element.connectedCallback();
            $scope.$on('$destroy', () => {
                element.disconnectedCallback();
            });
            let attributes = scope.observedAttributes || [];
            if (Array.isArray(attributes)) {
                attributes.forEach((attrName) => {
                    bindAttribute(element, $attrs, attrName);
                });
            }
        },
    ];
    return module.directive(dashToCamel(tagName), () => ngDescriptor);
}
