import React from 'react';
import ReactDOM from 'react-dom';
import { connect, disconnect, customElements } from '@chialab/dna';
import { ReferencesMap, convertReactNodes } from './convertReactNodes';

/**
 * A generic wrapper for DNA components.
 * It renders a div wrapper which is used as render root for DNA components.
 */
export class Root extends React.Component<unknown> {
    private references: ReferencesMap = [];

    /**
     * Render wrapper.
     */
    componentDidMount() {
        const node = ReactDOM.findDOMNode(this) as HTMLElement;
        this.componentDidUpdate();
        connect(node);
    }

    /**
     * Update wrapper.
     */
    componentDidUpdate() {
        const node = ReactDOM.findDOMNode(this) as HTMLElement;
        customElements.upgrade(node);
        this.references.forEach(([ref, props]) => {
            if (!ref.current) {
                return;
            }
            let node: any = ref.current;
            let attributes = node.constructor.observedAttributes || [];
            for (let propertyKey in props) {
                if (propertyKey !== 'children' &&
                    propertyKey !== 'is' &&
                    propertyKey !== 'key' &&
                    attributes.indexOf(propertyKey) === -1) {
                    node[propertyKey] = props[propertyKey];
                }
            }
        });
    }

    /**
     * Disconnect wrapper.
     */
    componentWillUnmount() {
        const node = ReactDOM.findDOMNode(this) as HTMLElement;
        disconnect(node);
    }

    /**
     * Render the component wrapper.
     */
    render(): React.ReactNode {
        const { children, references } = convertReactNodes(this.props.children, this.context);
        this.references = references;
        return React.createElement(React.Fragment, this.props, ...children);
    }
}
