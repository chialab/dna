import { Component, connect, disconnect } from '@chialab/dna';
import React from 'react';
import ReactDOM from 'react-dom';
import { convertReactNodes } from './convertReactNodes';
import { convertReactProps } from './convertReactProps';

/**
 * Wrap DNA component constructor in a React Component.
 * Since React does not support Custom Elements (properties are always set as attributes),
 * we have to generate the node using React render and set properties in componentDidMount and componentWillUpdate hooks.
 * We also convert component child React nodes to DNA template items in order to correctly handle slotted templates.
 * @param constructor The component constructor.
 * @return The React component.
 */
export function wrap<T extends typeof Component>(constructor: T) {
    const is = constructor.prototype.is;

    if ((constructor as any).__react) {
        // create a single react reference per component
        return (constructor as any).__react;
    }

    return (constructor as any).__react = class extends React.Component<Partial<InstanceType<T>>> {
        /**
         * Setup properties and connect the node.
         */
        componentDidMount() {
            const node = ReactDOM.findDOMNode(this) as InstanceType<T>;
            const props: any = (this as React.Component).props;
            this.componentWillUpdate(props);
            connect(node);
        }

        /**
         * Set properties to the component.
         */
        componentWillUpdate(props: any) {
            const node = ReactDOM.findDOMNode(this) as InstanceType<T>;
            for (let propertyKey in props) {
                if (propertyKey === 'children') {
                    node.slotChildNodes = convertReactNodes(props.children);
                } else {
                    (node as any)[propertyKey] = props[propertyKey];
                }
            }
        }

        /**
         * Disconnect the node.
         */
        componentWillUnmount() {
            const node = ReactDOM.findDOMNode(this) as InstanceType<T>;
            disconnect(node);
        }

        /**
         * Render the component root with only plain attributes.
         */
        render() {
            const props: any = (this as React.Component).props;
            return React.createElement(is, convertReactProps(props));
        }
    };
}
