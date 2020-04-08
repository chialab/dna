import { Fragment, createElement, createRef, ReactNode, ReactElement, ForwardRefExoticComponent, RefObject } from 'react';
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

/**
 * Wrap React children with fragments in order to always use HTMLElement methods like appendChild and insertBefore.
 * In DNA components those methods are overridden in order to handle slot children.
 * @param children A list of React nodes to convert.
 * @return A list of converted nodes.
 */
export function convertReactNodes(children: ReactNode | ReactNode[]): { children: ReactNode[], references: ReferencesMap} {
    let nodes = children as ReactNode[];
    if (!Array.isArray(nodes)) {
        nodes = [nodes];
    }
    let references: ReferencesMap = [];
    return {
        references,
        children: nodes.map((child) => {
            if (!isReactNode(child)) {
                return createElement(Fragment, null, child);
            }
            let ref: RefObject<unknown>|null = (child as any).ref;
            if (!isReactForwardRef(child.type)) {
                ref = ref || createRef();
                references.push([ref as RefObject<unknown>, child.props]);
            }
            let { children, references: childReferences } = convertReactNodes(child.props.children);
            references.push(...childReferences);
            return {
                ...child,
                ref,
                props: {
                    ...convertReactProps(child.props, false),
                    children: createElement(Fragment, null, ...children),
                },
            };
        }),
    };
}
