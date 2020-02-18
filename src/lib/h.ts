import { createSymbolKey } from './symbols';
import { CustomElement, isCustomElement } from './CustomElement';
import { Scope, getScope, setScope } from './Scope';
import { HyperFunction, createHyperFunction } from './HyperFunction';
import { Template, TemplateItems, createFilterableTemplateItems } from './Template';
import { getSlotted, setSlotted } from './Slotted';
import { isInterpolationFunction } from './InterpolationFunction';
import { registry } from './CustomElementRegistry';
import { DOM } from './DOM';

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

        // get the constructor from the registry
        Component = registry.get(propertiesToSet.is || tag);
    }

    const fn = function(this: Scope, previousElement?: Element) {
        // if the current patch is a JSX Fragment,
        if (isFragment) {
            // just return children
            return children;
        }

        // update the Node properties
        const props: HyperProperties = {};
        for (let property in propertiesToSet) {
            let value = propertiesToSet[property];
            if (value && isInterpolationFunction(value)) {
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
        const namespaceURI = props.namespaceURI;
        delete props.namespaceURI;

        const element = getRoot(Component || tag, props.key, namespaceURI, previousElement);
        const context = (element as any)[PRIVATE_CONTEXT_SYMBOL] = (element as any)[PRIVATE_CONTEXT_SYMBOL] || {};
        const isCE = isCustomElement(element);
        // update the Node properties
        for (let propertyKey in context) {
            if (!(propertyKey in props)) {
                props[propertyKey] = null;
            }
        }
        for (let propertyKey in props) {
            let value = props[propertyKey];

            if (isCE) {
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
        const childrenInput = children.slice(0) as TemplateItems;
        setScope(childrenInput, this);
        setSlotted(element, childrenInput);

        if (isCE) {
            // notify the Component that its slotted Nodes has been updated
            (element as CustomElement).forceUpdate();
        }

        // return the updated (or created) Node (or Component)
        return element;
    };

    return createHyperFunction(fn);
}
