import { createSymbolKey } from './symbols';
import { CustomElement } from './CustomElement';
import { Scope, getScope, setScope } from './Scope';
import { Template, TemplateItems, createFilterableTemplateItems } from './Template';
import { getSlotted, setSlotted } from './Slotted';
import { isInterpolateFunction } from './interpolate';
import * as registry from './registry';
import { DOM } from './dom';

/**
 * Symbol for interpolated functions.
 */
const HYPER_SYMBOL = createSymbolKey();

/**
 * A HyperFunction (built by the `h` method with a tag name, a list of properties and children)
 * returns a Template result for a given previous node at the current position in a render context.
 */
export type HyperFunction = (this: Scope, previousElement?: Element) => Template | TemplateItems;

/**
 * Check if the reference is a HyperFunction.
 * @param target The reference to check.
 * @return The reference is a HyperFunction.
 */
export function isHyperFunction(target: any): target is HyperFunction {
    return !!target[HYPER_SYMBOL];
}

/**
 * A symbol to store node properties.
 */
const PRIVATE_CONTEXT_SYMBOL = createSymbolKey();

/**
 * Represent HTML elements with a defined key.
 * Keys can be **any** value and are used to perform diff checking between two nodes with the same tag.
 */
type KeyedElement = Element & { key?: any };

/**
 * Compare a child already in the tree with the Node requested by the patch.
 * If the Nodes are compatible, return the old Node instance,
 * or create a new one otherwise.
 *
 * @param constructor The component constructor of the Node to create or the tag name
 * @param oldNode The previous Node to compare
 * @return The same old Node instance or a new one
 */
function getRoot(constructor: string | typeof Element, key?: string, namespaceURI?: string, oldNode?: KeyedElement): Element {
    // start the comparison
    if (typeof constructor === 'function') {
        // the requested Node is a Component and/or the previous Node is it,
        // so, check if the constructors are the same
        if (oldNode && oldNode instanceof constructor && key === oldNode.key) {
            // compatible!
            return oldNode;
        }
        // in this case, we should instantiate a new Component
        return new constructor();
    // check if old node and requested one have the same tag name
    } else if (oldNode && oldNode.localName === constructor && key === oldNode.key) {
        // compatible!
        return oldNode;
    }
    // create a new Node
    if (namespaceURI) {
        return DOM.createElementNS(namespaceURI, constructor);
    }
    return DOM.createElement(constructor);
}

export type HyperProperties = {
    is?: string;
    slot?: string;
    key?: any;
    namespaceURI?: string;
    [key: string]: any;
};

export const Fragment = function() {} as any as typeof Element;

/**
 * HyperFunction factory to use as JSX pragma.
 *
 * @param tagName The tag name or the constructor of the Node
 * @param properties The set of properties of the Node
 * @param children The children of the Node
 */
export function h(tag: string | typeof Element, properties: HyperProperties | null, ...children: TemplateItems): HyperFunction {
    let isFragment: boolean, isTemplate: boolean, isSlot: boolean;
    // Patch instances could be generated from the `h` function using JSX,
    // so the first parameter could be the Node constructor
    let Component: typeof Element | null = null;
    let propertiesToSet = properties || {};

    if (typeof tag === 'function') {
        isFragment = tag === Fragment;
        Component = tag;
    } else {
        isTemplate = tag === 'template';
        isSlot = tag === 'slot';

        // Also a real tag name can produce a Component instance,
        // if the tag is registered as Component or the `is` property is defined
        let name = propertiesToSet.is || tag;
        if (registry.has(name)) {
            // get the constructor from the registry
            Component = registry.get(name).constructor;
        }
    }

    const fn = function(this: Scope, previousElement?: Element) {
        // if the current patch is a JSX Fragment,
        if (isFragment) {
            // just return children
            return children;
        }

        // update the Node properties
        let props: HyperProperties = {};
        for (let property in propertiesToSet) {
            let value = propertiesToSet[property];
            if (value && isInterpolateFunction(value)) {
                // resolve interpolated properties
                value = value.call(this);
            }
            props[property] = value;
        }

        // if the current patch is a template,
        if (isTemplate) {
            // the Template instances are not rendered,
            // so it returns its children
            // check if the Template should handle the `if` property
            if ('if' in props) {
                if (props.if == null || props.if === false) {
                    // the condition is a falsy value, so it should not render anything
                    return null;
                }
            }
            // check if the Template should handle the `repeat` property
            if (props.repeat && children.length) {
                const newChildren = [] as Template[];
                // extract the `key` variable to use in the template
                const keyVar = props.key || '$key';
                // extract the `item` variable to use in the template
                const itemVar = props.item || '$item';
                const array = props.repeat;
                // iterate the object or the array
                for (let key in array) {
                    let item = array[key];
                    // augment the scope of the child
                    const childScope = this.$child();
                    childScope.$assign({
                        [keyVar]: key,
                        [itemVar]: item,
                    });
                    const clone = children.slice(0) as TemplateItems;
                    setScope(clone, childScope);
                    newChildren.push(clone);
                }
                return newChildren;
            }
            return children;
        }

        if (isSlot) {
            let slottedChildren = getSlotted(this);
            if (slottedChildren) {
                let scope = getScope(slottedChildren) || this;
                if (props.name) {
                    slottedChildren = createFilterableTemplateItems(slottedChildren, (item) => {
                        if (DOM.isElement(item)) {
                            return DOM.getAttribute(item, 'slot') === props.name;
                        }
                        return false;
                    });
                } else {
                    slottedChildren = createFilterableTemplateItems(slottedChildren, (item) => {
                        if (DOM.isElement(item)) {
                            return !DOM.getAttribute(item, 'slot');
                        }
                        return true;
                    });
                }
                setScope(slottedChildren, scope);
                return slottedChildren;
            }
            return [];
        }

        // or start the comparison between the old node and the requested one
        // if old and the requested are compatible,
        // the`root` contains the old Node or the old Component intance
        let namespaceURI = props.namespaceURI;
        delete props.namespaceURI;

        let element = getRoot(Component || tag, props.key, namespaceURI, previousElement);
        let context = (element as any)[PRIVATE_CONTEXT_SYMBOL] = (element as any)[PRIVATE_CONTEXT_SYMBOL] || {};
        let isCustomElement = DOM.isCustomElement(element);
        // update the Node properties
        for (let propertyKey in context) {
            if (!(propertyKey in props)) {
                props[propertyKey] = null;
            }
        }
        for (let propertyKey in props) {
            let value = props[propertyKey];

            if (isCustomElement) {
                if ((element as any)[propertyKey] !== value) {
                    // the property should be update
                    (element as any)[propertyKey] = value;
                }
            } else if (context[propertyKey] !== value) {
                context[propertyKey] = value;
                if (!namespaceURI) {
                    (element as any)[propertyKey] = value;
                }
            }

            if (value == null || value === false) {
                DOM.removeAttribute(element, propertyKey);
            } else if (typeof value !== 'object' && propertyKey !== 'key') {
                DOM.setAttribute(element, propertyKey, value === true ? '' : value);
            }

            if (propertyKey === 'key') {
                this[props[propertyKey]] = element;
            }
        }

        // store the Node children in order to reuse them
        // at the next render cycle
        let childrenInput = children.slice(0) as TemplateItems;
        setScope(childrenInput, this);
        setSlotted(element, childrenInput);

        if (isCustomElement) {
            // notify the Component that its slotted Nodes has been updated
            (element as CustomElement).render();
        }

        // return the updated (or created) Node (or Component)
        return element;
    };

    (fn as any)[HYPER_SYMBOL] = true;

    return fn as HyperFunction;
}
