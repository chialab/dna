import React from 'react';
import { convertReactProps } from './convertReactProps';

/**
 * Check if the target is a ReactElement.
 * @param target The reference to check.
 */
function isReactNode(target: any): target is React.ReactElement {
    return typeof target === 'object' && target.$$typeof && target.$$typeof.toString() === 'Symbol(react.element)';
}

function isComponentFunction(target: any): target is React.FunctionComponent {
    return typeof target === 'function' && !(target.prototype instanceof React.Component);
}

export type ReferencesMap = Array<[React.RefObject<unknown>, any]>;

/**
 * Wrap React children with fragments in order to always use HTMLElement methods like appendChild and insertBefore.
 * In DNA components those methods are overridden in order to handle slot children.
 * @param children A list of React nodes to convert.
 * @return A list of converted nodes.
 */
export function convertReactNodes(children: React.ReactNode | React.ReactNode[], context: React.Context<unknown>): { children: React.ReactNode[], references: ReferencesMap} {
    let nodes = children as React.ReactNode[];
    if (!Array.isArray(nodes)) {
        nodes = [nodes];
    }
    let references: ReferencesMap = [];
    return {
        references,
        children: nodes.map((child) => {
            if (!isReactNode(child)) {
                return React.createElement(React.Fragment, null, child);
            }
            if (isComponentFunction(child.type)) {
                let { children, references: childReferences } = convertReactNodes(child.type(child.props, context), context);
                if (children.length === 1) {
                    children = children[0] as React.ReactNode[];
                }
                references.push(...childReferences);
                return React.createElement(React.Fragment, null, children);
            }

            let ref: React.RefObject<unknown>|null = (child as any).ref || React.createRef();
            references.push([ref as React.RefObject<unknown>, child.props]);

            if (child.props.children) {
                let { children, references: childReferences } = convertReactNodes(child.props.children, context);
                references.push(...childReferences);
                return {
                    ...child,
                    ref,
                    props: {
                        ...convertReactProps(child.props, false),
                        children: React.createElement(React.Fragment, null, ...children),
                    },
                };
            }
            return {
                ...child,
                ref,
                props: convertReactProps(child.props, false),
            };
        }),
    };
}
