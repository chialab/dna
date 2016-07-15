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
 * @param {String} tagName The nickname of the Component.
 * @param {Function} Component The definition of the Component.
 * @param {Object} config A set of options for the registration of the Component.
 * @return {Function} The Component constructor.
 */
export function register(tagName, Component) {
    let ngDescriptor = {
        restrict: 'E',
    };
    ngDescriptor.controller = [
        '$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
            let element = $element[0];
            Object.setPrototypeOf(element, Component.prototype);
            element.is = tagName;
            element.$scope = $scope;
            element.$element = $element;
            element.$attrs = $attrs;
            element.constructor();
            element.connectedCallback();
            $scope.$on('$destroy', () => {
                element.disconnectedCallback();
            });
            let attributes = Component.observedAttributes || [];
            if (Array.isArray(attributes)) {
                attributes.forEach((attrName) => {
                    bindAttribute(element, $attrs, attrName);
                });
            }
        },
    ];
    return module.directive(dashToCamel(tagName), () => ngDescriptor);
}
