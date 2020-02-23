import { createSymbolKey } from './symbols';
import { CustomElement } from './CustomElement';
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
 * A virtual description of a Node, generate by the `h` helper and used in the render function.
 */
export type HyperNode = {
    Component?: typeof Element,
    tag?: string;
    is?: string,
    key?: any,
    isFragment?: boolean,
    isSlot?: boolean,
    isTemplate?: boolean,
    isCustomElement?: boolean,
    namespaceURI?: string,
    properties?: any,
    children: TemplateItems,
};

/**
 * Check if the reference is a HyperNode.
 * @param target The reference to check.
 * @return The reference is a isHyperNode.
 */
export const isHyperNode = (target: any): target is HyperNode => !!target[HYPER_SYMBOL];

/**
 * Flag a node as HyperNode.
 * @ignore
 * @param node The node to flag.
 * @return The updated node.
 */
export const createHyperNode = (node: HyperNode): HyperNode => {
    (node as any)[HYPER_SYMBOL] = true;
    return node as HyperNode;
};

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
        isTemplate: boolean = tag === 'template',
        isSlot: boolean = tag === 'slot',
        isCustomElement: boolean,
        is: string | undefined,
        key: any | undefined,
        Component: typeof Element | undefined;

    // Patch instances could be generated from the `h` function using JSX,
    // so the first parameter could be the Node constructor
    let props = properties || {};

    let propertiesToSet: any = {};
    for (let propertyKey in props) {
        let value = props[propertyKey];
        if (propertyKey === 'is') {
            is = value;
        } else if (propertyKey === 'key' && !isTemplate) {
            key = value;
        } else {
            propertiesToSet[propertyKey] = value;
        }
    }

    if (!tag) {
        Component = tagOrComponent as typeof Element;
        isCustomElement = !!(Component as CustomElement).prototype.is;
        tag = undefined;
    } else {
        // get the constructor from the registry
        Component = registry.get(is as string || tag as string);
        isCustomElement = !!Component;
    }

    return createHyperNode({
        Component,
        tag,
        is,
        key,
        isFragment,
        isSlot,
        isTemplate,
        isCustomElement,
        namespaceURI: props.namespaceURI,
        properties: propertiesToSet,
        children,
    });
};
