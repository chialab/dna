/* global React */
import { digest } from '../helpers/digest.js';
import { dashToCamel } from '../helpers/strings.js';
import { register as _register } from './dna.vdom-elements.js';

// export library
export * from './dna.vdom-elements.js';

function createClass(tagName, Scope, config = {}) {
    let props = (Scope.observedProperties || [])
        .concat(Scope.observedAttributes || [])
        .map(dashToCamel);
    return class extends React.Component {
        static get getDefaultProps() {
            let attrs = {};
            props.forEach((name) => {
                attrs[name] = undefined;
            });
            return attrs;
        }

        render() {
            let attrs = {};
            props.forEach((name) => {
                attrs[name] = this.props[name];
            });
            if (config.extends) {
                attrs.is = tagName;
            }
            return React.createElement(
                config.extends || tagName,
                attrs
            );
        }
    };
}

/**
 * Register a Custom Element.
 * `document.registerElement`-like interface.
 * @param {string} tagName The tag to use for the custom element. (required)
 * @param {object} config A configuration object. (`prototype` key is required)
 * @return {function} The Component constructor.
 */
export function register(...args) {
    _register(...args);
    let pre = digest(...args);
    let scope = pre.scope;
    let config = pre.config;
    let tagName = pre.tagName;
    return createClass(tagName, scope, config);
}
