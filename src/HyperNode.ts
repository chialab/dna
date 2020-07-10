import { window } from './window';
import { createSymbolKey } from './symbols';
import { customElements } from './CustomElementRegistry';
import { TemplateItems, TemplateFunction } from './Template';
import { Fragment } from './Fragment';

/**
 * Symbol for interpolated functions.
 */
const HYPER_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * The properties of a HyperNode.
 */
export type HyperProperties = {
    is?: string;
    slot?: string;
    key?: any;
    xlmns?: NamespaceURI;
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
    Component?: typeof HTMLElement,
    Function?: TemplateFunction,
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
export const h = (tagOrComponent: string | typeof HTMLElement | typeof Fragment | TemplateFunction, properties: HyperProperties|null = null, ...children: TemplateItems): HyperNode => {
    let tag: string | undefined = typeof tagOrComponent === 'string' ? (tagOrComponent as string).toLowerCase() : undefined,
        isFragment: boolean = tagOrComponent === Fragment,
        isSlot: boolean = tag === 'slot',
        propertiesToSet: any = properties || {},
        is: string | undefined = propertiesToSet.is,
        key = propertiesToSet.key,
        xmlns = propertiesToSet.xmlns,
        Component: typeof HTMLElement | undefined,
        Function: TemplateFunction | undefined;

    if (!isFragment && !isSlot) {
        if (!tag) {
            if (((tagOrComponent as Function).prototype instanceof window.HTMLElement)) {
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
        Component,
        Function,
        tag,
        is,
        key,
        isFragment,
        isSlot,
        namespaceURI: xmlns,
        properties: propertiesToSet,
        children,
        [HYPER_SYMBOL]: true,
    } as HyperNode;
};
