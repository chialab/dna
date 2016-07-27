/* global React ReactDOM */
import { dashToCamel } from '../helpers/strings.js';
import { register as _register } from './dna.vdom.js';

// export library
export * from './dna.vdom.js';

/**
 * Create a React component wrapper.
 * @private
 *
 * @param {string} tagName The tag to use for the custom element. (required)
 * @param {function} Scope The component definition.
 * @param {object} config A configuration object. (`prototype` key is required)
 * @return {function} The React Component constructor.
 */
function createClass(tagName, Scope, config = {}) {
    let props = (Scope.observedProperties || []).map(dashToCamel);
    let attrs = (Scope.observedAttributes || []).map(dashToCamel);
    return class extends React.Component {
        static get getDefaultProps() {
            let reactProps = {};
            props.concat(attrs).forEach((name) => {
                reactProps[name] = undefined;
            });
            return reactProps;
        }

        render() {
            let nodeAttrs = {};
            attrs.forEach((name) => {
                nodeAttrs[name] = this.props[name];
            });
            if (config.extends) {
                nodeAttrs.is = tagName;
            }
            let node = React.createElement(
                config.extends || tagName,
                nodeAttrs
            );
            return node;
        }

        componentDidMount() {
            let node = ReactDOM.findDOMNode(this);
            props.forEach((name) => {
                node[name] = this.props[name];
            });
        }
    };
}

/**
 * Create the Component constructor.
 * @param {String} tagName The nickname of the Component.
 * @param {Function} Component The definition of the Component.
 * @param {Object} config A set of options for the registration of the Component.
 * @return {Function} The Component constructor.
 */
export function register(tagName, Component, config = {}) {
    _register(tagName, Component, config);
    return createClass(tagName, Component, config);
}
