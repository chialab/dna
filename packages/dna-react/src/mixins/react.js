import React from 'react';
import ReactDOM from 'react-dom';
import { DOM } from '@dnajs/core/src/core.js';
import { isFunction } from '@dnajs/core/src/lib/typeof.js';

function convertProps(elem) {
    let res = {};
    if (elem.properties) {
        for (let k in elem.properties) {
            res[k] = elem[k];
        }
    }
    return res;
}

function filterAttributes(elem) {
    let Ctr = elem.constructor;
    let attrs = Ctr.observedAttributes || [];
    let res = {};
    for (let k in elem.state) {
        if (attrs.indexOf(k) !== -1) {
            res[k] = elem.state[k];
        }
    }
    return res;
}

let changing;

export const ReactMixin = (SuperClass) => class extends SuperClass {
    get node() {
        return ReactDOM.findDOMNode(this);
    }

    propertyChangedCallback(propName, oldValue, newValue) {
        changing = true;
        super.propertyChangedCallback(propName, oldValue, newValue);
        changing = false;
        this.setState(convertProps(this));
    }

    render() {
        if (changing) {
            // prevent rerendering from other mixins.
            return false;
        }
        return React.createElement(
            this.is,
            filterAttributes(this),
            isFunction(this.template) ? this.template.call(this) : undefined
        );
    }

    componentDidMount() {
        DOM.connect(this);
        for (let k in this.props) {
            this[k] = this.props[k];
        }
    }

    componentWillUnmount() {
        DOM.disconnect(this);
    }

    componentDidUpdate() {
        for (let k in this.props) {
            this[k] = this.props[k];
        }
    }
};
