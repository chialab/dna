import { TemplateItems, Fragment, h } from '@chialab/dna';
import { convertReactProps } from './convertReactProps';
import React from 'react';

/**
 * Check if the target is a ReactElement.
 * @param target The reference to check.
 */
function isReactNode(target: any): target is React.ReactElement {
    return typeof target === 'object' && target.$$typeof && target.$$typeof.toString() === 'Symbol(react.element)';
}

/**
 * Check if the target is a ReactForwardRef.
 * @param target The reference to check.
 */
function isReactForwardRef(target: any): target is React.ForwardRefExoticComponent<unknown> {
    return typeof target === 'object' && target.$$typeof && target.$$typeof.toString() === 'Symbol(react.forward_ref)';
}

/**
 * Convert React nodes to DNA template items.
 * @param children A list of React nodes to conver.
 * @return A list of converted template items.
 */
export function convertReactNodes(children: React.ReactNode | React.ReactNode[]): TemplateItems {
    let nodes = children as React.ReactNode[];
    if (!Array.isArray(nodes)) {
        nodes = [nodes];
    }
    return nodes.map(child => {
        if (isReactNode(child)) {
            if (isReactForwardRef(child.type)) {
                return h(Fragment, null, ...convertReactNodes((child.type as any).render(child.props, (child as any).ref)));
            }
            let type = child.type as string;
            let children = child.props.children as React.ReactNode[];
            let props = {
                ...child.props,
                key: child.key,
                children: undefined,
            };
            return h(type, convertReactProps(props), ...convertReactNodes(children));
        }
        return child;
    }) as TemplateItems;
}
