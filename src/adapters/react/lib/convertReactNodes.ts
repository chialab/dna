import { TemplateItems, h } from '@chialab/dna';
import React from 'react';

/**
 * Check if the target is a ReactElement.
 * @param target The reference to check.
 */
function isReactNode(target: any): target is React.ReactElement {
    return typeof target === 'object' && target.$$typeof && target.$$typeof.toString() === 'Symbol(react.element)';
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
            let children = child.props.children as React.ReactNode[];
            let props = {
                ...child.props,
                key: child.key,
                children: undefined,
            };
            return h(child.type as string, props, ...convertReactNodes(children));
        }
        return child;
    }) as TemplateItems;
}
