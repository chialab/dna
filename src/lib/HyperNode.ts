import { createSymbolKey } from './symbols';
import { registry } from './CustomElementRegistry';
import { TemplateItems } from './Template';
import { Fragment } from './Fragment';

/**
 * Symbol for interpolated functions.
 */
const HYPER_SYMBOL = createSymbolKey();

/**
 * The properties of a HyperNode.
 */
export type HyperProperties = {
    is?: string;
    slot?: string;
    key?: any;
    namespaceURI?: string;
    [key: string]: any;
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
    Component?: typeof Element,
    tag?: string;
    is?: string,
    key?: any,
    isFragment?: boolean,
    isSlot?: boolean,
    namespaceURI?: NamespaceURI,
    properties?: any,
    children: TemplateItems,
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
 * @param tagOrComponent The tag name or the constructor of the Node
 * @param properties The set of properties of the Node
 * @param children The children of the Node
 */
export const h = (tagOrComponent: string | typeof Element, properties: HyperProperties | null, ...children: TemplateItems): HyperNode => {
    let tag: string | undefined = typeof tagOrComponent === 'string' ? (tagOrComponent as string).toLowerCase() : undefined,
        isFragment: boolean = tagOrComponent === Fragment,
        isSlot: boolean = tag === 'slot',
        is: string | undefined,
        key: any | undefined,
        propertiesToSet: any = {},
        Component: typeof Element | undefined;

    if (properties) {
        for (let propertyKey in properties) {
            let value = properties[propertyKey];
            if (propertyKey === 'is') {
                is = value;
            } else if (propertyKey === 'key') {
                key = value;
            } else {
                propertiesToSet[propertyKey] = value;
            }
        }
    }

    if (!tag) {
        Component = tagOrComponent as typeof Element;
    } else {
        // get the constructor from the registry
        Component = registry.get(is as string || tag as string);
    }

    return {
        Component,
        tag,
        is,
        key,
        isFragment,
        isSlot,
        namespaceURI: NamespaceURI[tag as keyof typeof NamespaceURI] || propertiesToSet.xmlns,
        properties: propertiesToSet,
        children,
        [HYPER_SYMBOL]: true,
    } as HyperNode;
};
