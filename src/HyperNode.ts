import type { ComponentConstructorInterface } from './Interfaces';
import type { TemplateItems, TemplateFunction } from './Template';
import { window } from './window';
import { customElements } from './CustomElementRegistry';
import { Fragment } from './Fragment';
import { createSymbolKey } from './symbols';
import { isNode } from './helpers';

/**
 * A symbol which identify emulated components.
 */
const HYPER_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * Classes dictionary.
 */
export type HyperClasses = string | { [key: string]: boolean };

/**
 * Styles dictionary.
 */
export type HyperStyles = string | { [key: string]: string };

/**
 * The properties of a HyperNode.
 */
export type HyperProperties = {
    is?: string;
    slot?: string;
    key?: unknown;
    xlmns?: NamespaceURI;
    children?: TemplateItems;
    class?: HyperClasses;
    [key: string]: unknown;
};

/**
 * A list of namespaceURI bound with their tagName.
 */
export enum NamespaceURI {
    svg = 'http://www.w3.org/2000/svg',
}

/**
 * A virtual description of a Node, generate by the `h` helper and used in the render function.
 */
export type HyperNode = {
    node?: Node;
    Component?: ComponentConstructorInterface<HTMLElement>;
    Function?: TemplateFunction;
    tag?: string;
    is?: string;
    key?: unknown;
    isFragment?: boolean;
    isSlot?: boolean;
    namespaceURI?: NamespaceURI;
    properties: HyperProperties;
    children: TemplateItems;
};

/**
 * Check if the reference is a HyperNode.
 * @param target The reference to check.
 * @return The reference is a isHyperNode.
 */
export const isHyperNode = (target: any): target is HyperNode => target[HYPER_SYMBOL];

/**
 * HyperFunction factory to use as JSX pragma.
 *
 * @param tagOrComponent The tag name, the constructor or the instance of the node.
 * @param properties The set of properties of the Node.
 * @param children The children of the Node.
 */
export const h = (tagOrComponent: string | typeof HTMLElement | typeof Fragment | TemplateFunction | Node, properties: HyperProperties|null = null, ...children: TemplateItems): HyperNode => {
    let tag: string | undefined = typeof tagOrComponent === 'string' ? (tagOrComponent as string).toLowerCase() : undefined,
        isFragment: boolean = tagOrComponent === Fragment,
        isSlot: boolean = tag === 'slot',
        propertiesToSet = properties || {},
        is: string | undefined = propertiesToSet.is,
        key = propertiesToSet.key,
        xmlns = propertiesToSet.xmlns,
        node: Node | undefined,
        Component: typeof HTMLElement | undefined,
        Function: TemplateFunction | undefined;

    if (!isFragment && !isSlot) {
        if (!tag) {
            if (isNode(tagOrComponent)) {
                node = tagOrComponent;
            } else if (((tagOrComponent as Function).prototype instanceof window.HTMLElement)) {
                Component = tagOrComponent as typeof HTMLElement;
            } else {
                Function = tagOrComponent as TemplateFunction;
            }
        } else if (tag === 'svg') {
            xmlns = NamespaceURI.svg;
        } else {
            // get the constructor from the registry
            Component = customElements.get(is || tag);
        }
    }

    return {
        node,
        Component,
        Function,
        tag,
        is,
        key,
        isFragment,
        isSlot,
        namespaceURI: xmlns,
        properties: propertiesToSet,
        children: propertiesToSet.children || children,
        [HYPER_SYMBOL]: true,
    } as HyperNode;
};
