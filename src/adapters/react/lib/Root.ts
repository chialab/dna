import { createElement, Fragment, Component as ReactComponent, ReactNode } from 'react';
import { findDOMNode } from 'react-dom';
import { connect, disconnect } from '@chialab/dna';
import { upgrade } from '@chialab/dna';
import { ReferencesMap, convertReactNodes } from './convertReactNodes';

/**
 * A generic wrapper for DNA components.
 * It renders a div wrapper which is used as render root for DNA components.
 */
export class Root extends ReactComponent<unknown> {
    private references: ReferencesMap = [];
    /**
     * Render wrapper.
     */
    componentDidMount() {
        const node = findDOMNode(this) as HTMLElement;
        upgrade(node);
        connect(node);
    }

    /**
     * Update wrapper.
     */
    componentDidUpdate() {
        const node = findDOMNode(this) as HTMLElement;
        upgrade(node);
        this.references.forEach(([ref, props]) => {
            if (!ref.current) {
                return;
            }
            for (let propertyKey in props) {
                if (propertyKey !== 'children') {
                    (ref.current as any)[propertyKey] = (props as any)[propertyKey];
                }
            }
        });
    }

    /**
     * Disconnect wrapper.
     */
    componentWillUnmount() {
        const node = findDOMNode(this) as HTMLElement;
        disconnect(node);
    }

    /**
     * Render the component wrapper.
     */
    render(): ReactNode {
        const { children, references } = convertReactNodes(this.props.children);
        this.references = references;
        return createElement(Fragment, this.props, ...children);
    }
}
