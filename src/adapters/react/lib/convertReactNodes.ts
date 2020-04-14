import React, { ReactNode, ReactElement, ForwardRefExoticComponent, RefObject, FunctionComponent, Context } from 'react';
import { convertReactProps } from './convertReactProps';

/**
 * Check if the target is a ReactElement.
 * @param target The reference to check.
 */
function isReactNode(target: any): target is ReactElement {
    return typeof target === 'object' && target.$$typeof && target.$$typeof.toString() === 'Symbol(react.element)';
}

/**
 * Check if the target is a ReactForwardRef.
 * @param target The reference to check.
 */
function isReactForwardRef(target: any): target is ForwardRefExoticComponent<unknown> {
    return typeof target === 'object' && target.$$typeof && target.$$typeof.toString() === 'Symbol(react.forward_ref)';
}

export type ReferencesMap = Array<[RefObject<unknown>, any]>;

function isComponentFunction(target: any): target is FunctionComponent {
    return typeof target === 'function' && !(target.prototype instanceof React.Component);
}

/**
 * Wrap React children with fragments in order to always use HTMLElement methods like appendChild and insertBefore.
 * In DNA components those methods are overridden in order to handle slot children.
 * @param children A list of React nodes to convert.
 * @return A list of converted nodes.
 */
export function convertReactNodes(children: ReactNode | ReactNode[], context: Context<unknown>): { children: ReactNode[], references: ReferencesMap} {
    let nodes = children as ReactNode[];
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
                    children = children[0] as ReactNode[];
                }
                references.push(...childReferences);
                return React.createElement(
                    React.Fragment,
                    null,
                    children,
                );
            }
            let ref: RefObject<unknown>|null = (child as any).ref;
            if (!isReactForwardRef(child.type)) {
                ref = ref || React.createRef();
                references.push([ref as RefObject<unknown>, child.props]);
            }
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
        }),
    };
}
