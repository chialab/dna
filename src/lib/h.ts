import { CustomElement } from './CustomElement';
import { isInterpolateFunction } from './interpolate';
import { Template, Scope, TemplateItem, getScope, setScope, getSlotted, setSlotted, createFilterableTemplateItems } from './render';
import * as registry from './registry';
import { DOM } from './dom';

const PRIVATE_CONTEXT_SYMBOL = Symbol();

type KeyedElement = HTMLElement & { key?: any };

type WithContext = HTMLElement & {
    [key: string]: any;
}

type WithPrivateContext = HTMLElement & {
    [PRIVATE_CONTEXT_SYMBOL]: WithContext;
};

/**
 * Compare a child already in the tree with the Node requested by the patch.
 * If the Nodes are compatible, return the old Node instance,
 * or create a new one otherwise.
 *
 * @param constructor The component constructor of the Node to create or the tag name
 * @param oldNode The previous Node to compare
 * @return The same old Node instance or a new one
 */
function getRoot(constructor: string | typeof HTMLElement, key: string | undefined, oldNode?: KeyedElement): HTMLElement {
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
    return DOM.createElement(constructor);
}

export type HyperProperties = {
    is?: string;
    slot?: string;
    [key: string]: any;
};

export type HyperFunction = (this: Scope, previousElement?: HTMLElement) => Template | Template[];

/**
 * Create a new Patch instance.
 *
 * @param tagName The tag name or the constructor of the Node
 * @param properties The set of properties of the Node
 * @param children The children of the Node
 */
export function h(tag: string | typeof HTMLElement, properties: HyperProperties | null, ...children: (TemplateItem[] | TemplateItem)[]): HyperFunction {
    // Patch instances could be generated from the `h` function using JSX,
    // so the first parameter could be the Node constructor
    let Component: typeof HTMLElement | null = null;

    if (typeof tag === 'function') {
        Component = tag;
    } else {
        // Also a real tag name can produce a Component instance,
        // if the tag is registered as Component or the `is` property is defined
        let name = properties && properties.is || tag;
        if (registry.has(name)) {
            // get the constructor from the registry
            Component = registry.get(name).constructor;
        }
    }

    let isTemplate = tag === 'template';
    let isSlot = tag === 'slot';

    return function(this: Scope, previousElement?: HTMLElement) {
        // update the Node properties
        let props: HyperProperties = {};
        for (let property in properties) {
            let value = properties[property];
            if (isInterpolateFunction(value)) {
                // resolve interpolated properties
                value = value.call(this);
            }
            props[property] = value;
        }

        // if the current patch is a template,
        // handle the template
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
                    const clone = children.slice(0) as TemplateItem[];
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
        let element = getRoot(Component || tag, props.key, previousElement);
        let isCustomElement = DOM.isCustomElement(element);
        let attributesToSet: { [key: string]: string } = {};
        let attributesToRemove: string[] = [];
        // update the Node properties
        for (let propertyKey in props) {
            let value = props[propertyKey];
            let isFalsy = value == null || value === false;
            let isTrue = value === true;
            let isProperty = typeof value === 'object' || propertyKey === 'key';

            if (isCustomElement) {
                if ((element as WithContext)[propertyKey] !== value) {
                    // the property should be update
                    (element as WithContext)[propertyKey] = value;
                    if (isFalsy) {
                        attributesToRemove.push(propertyKey);
                    } else if (!isProperty) {
                        attributesToSet[propertyKey] = isTrue ? '' : value;
                    }
                }
            } else {
                (element as WithPrivateContext)[PRIVATE_CONTEXT_SYMBOL] = (element as WithPrivateContext)[PRIVATE_CONTEXT_SYMBOL] || {};
                if ((element as WithPrivateContext)[PRIVATE_CONTEXT_SYMBOL][propertyKey] !== value) {
                    (element as WithPrivateContext)[PRIVATE_CONTEXT_SYMBOL][propertyKey] = value;
                    if (isFalsy) {
                        attributesToRemove.push(propertyKey);
                    } else if (!isProperty) {
                        attributesToSet[propertyKey] = isTrue ? '' : value;
                    } else {
                        (element as WithContext)[propertyKey] = value;
                    }
                }
            }

            // update the attributes too
            attributesToRemove.forEach((attributeName) => DOM.removeAttribute(element, attributeName));
            for (let attributeName in attributesToSet) {
                DOM.setAttribute(element, attributeName, attributesToSet[attributeName]);
            }

            if (propertyKey === 'key') {
                this[props[propertyKey]] = element;
            }
        }

        // store the Node children in order to reuse them
        // at the next render cycle
        let childrenInput = children.slice(0) as TemplateItem[];
        setScope(childrenInput, this);
        setSlotted(element, childrenInput);

        if (isCustomElement) {
            // notify the Component that its slotted Nodes has been updated
            (element as CustomElement).render();
        }

        // return the updated (or created) Node (or Component)
        return element;
    } as HyperFunction;
}
