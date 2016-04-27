import { digest, create as _create } from '../dna-helper.next.js';

export * from '../dna.next.js';

const module = window.angular.module('dna-components', []);

function bindAttribute(element, $attrs, key) {
    $attrs.$observe(key, (newValue, oldValue) => {
        element.attributeChangedCallback(key, oldValue, newValue);
    });
}

export function register(fn, options = {}) {
    let pre = digest(fn, options);
    let scope = pre.scope;
    let config = pre.config;
    let tagName = pre.tagName;

    if (typeof scope.onRegister === 'function') {
        scope.onRegister.call(scope, tagName);
    }
    let descriptor = config.prototype;
    let ngDescriptor = {
        restrict: 'E',
    };
    if (typeof descriptor.templateUrl === 'string') {
        ngDescriptor.templateUrl = descriptor.templateUrl;
    }
    ngDescriptor.controller = [
        '$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
            let element = $element[0];
            Object.setPrototypeOf(element, descriptor.prototype);
            element.is = config.prototype.is;
            element.$scope = $scope;
            element.$element = $element;
            element.$attrs = $attrs;
            element.createdCallback();
            element.attachedCallback();
            $scope.$on('$destroy', () => {
                element.detachedCallback();
            });
            if (typeof descriptor.attributes !== 'undefined' &&
                Array.isArray(descriptor.attributes)) {
                descriptor.attributes.forEach((attrName) => {
                    bindAttribute(element, $attrs, attrName);
                });
            }
        },
    ];
    return module.directive(descriptor);
}

export function create(fn, options = {}) {
    return _create(fn, options, register);
}
