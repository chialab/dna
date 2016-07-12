/* global React ReactDOM */
import { digest } from '../helpers/digest.js';
import { dashToCamel } from '../helpers/strings.js';
import { register as _register } from './dna.vdom-elements.js';

// export library
export * from './dna.vdom-elements.js';

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
