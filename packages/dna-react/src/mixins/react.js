import React from '@react/react';
import ReactDOM from '@react/react-dom';
import { DOM } from '@dnajs/core/src/library-helpers.js';

export const ReactMixin = (superClass) => {
    let ReactComponent = class extends React.Component {
        render() {
            return React.createElement(
                this.is
            );
        }

        componentDidMount() {
            let node = ReactDOM.findDOMNode(this);
            if (node) {
                if (!node.reactComponent) {
                    DOM.bind(node);
                    node.reactComponent = this;
                }
                if (DOM.isComponent(node)) {
                    DOM.connect(node);
                    for (let k in this.props) {
                        node[k] = this.props[k];
                    }
                }
            }
        }

        componentWillUnmount() {
            let node = ReactDOM.findDOMNode(this);
            if (node) {
                if (DOM.isComponent(node)) {
                    DOM.disconnect(node);
                }
            }
        }

        componentDidUpdate() {
            let node = ReactDOM.findDOMNode(this);
            if (node) {
                for (let k in this.props) {
                    node[k] = this.props[k];
                }
            }
        }
    };

    return class extends superClass {
        constructor(...args) {
            super(...args);
            if (args.length !== 0) {
                let cmp = new ReactComponent(...args);
                cmp.is = this.is;
                return cmp;
            }
        }
    };
};
