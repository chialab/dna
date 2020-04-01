import { Component, connect } from '@chialab/dna';
import React from 'react';
import ReactDOM from 'react-dom';
import { convertReactNodes } from './convertReactNodes';

export function wrap<T extends typeof Component>(constructor: T) {
    const is = constructor.prototype.is;
    if ((constructor as any).__react) {
        return (constructor as any).__react;
    }

    return (constructor as any).__react = class extends React.Component<Partial<InstanceType<T>>> {
        componentDidMount() {
            const node = ReactDOM.findDOMNode(this) as InstanceType<T>;
            const props: any = (this as React.Component).props;
            this.componentWillUpdate(props);
            connect(node);
        }

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

        render() {
            let props: any = (this as React.Component).props;
            props = Object.keys(props)
                .reduce((newProps: any, propertyKey: string) => {
                    if (propertyKey === 'children') {
                        return newProps;
                    }
                    let value = props[propertyKey];
                    let type = typeof value;
                    if (type === 'function' || type === 'object') {
                        return newProps;
                    }
                    newProps[propertyKey] = value;
                    return newProps;
                }, {});
            return React.createElement(is, props);
        }
    };
}
