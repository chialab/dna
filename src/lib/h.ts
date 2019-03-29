import { isInterpolateFunction } from './interpolate';
import { Template, Scope, TemplateItem, getScope, setScope, getSlotted, setSlotted, createFilterableTemplateItems } from './render';
import * as registry from './registry';
import { DOM } from './dom';

/**
 * Compare a child already in the tree with the Node requested by the patch.
 * If the Nodes are compatible, return the old Node instance,
 * or create a new one otherwise.
 *
 * @param constructor The component constructor of the Node to create or the tag name
 * @param oldNode The previous Node to compare
 * @return The same old Node instance or a new one
 */
function getRoot(constructor: string | typeof HTMLElement, oldNode?: HTMLElement): HTMLElement {
    // start the comparison
    if (typeof constructor === 'function') {
        // the requested Node is a Component and/or the previous Node is it,
        // so, check if the constructors are the same
        if (oldNode && oldNode instanceof constructor) {
            // compatible!
            return oldNode;
        }
        // in this case, we should instantiate a new Component
        return new constructor();
    // check if old node and requested one have the same tag name
    } else if (oldNode && oldNode.localName === constructor) {
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
        let element = getRoot(Component || tag, previousElement);
        // update the Node properties
        for (let propertyKey in props) {
            let value = props[propertyKey];
            if ((element as any)[propertyKey] !== value) {
                // the property should be update
                (element as any)[propertyKey] = value;
                // update the attributes too
                if (value == null || value === false) {
                    // falsy values should remove attributes by design
                    DOM.removeAttribute(element, propertyKey);
                } else {
                    if (value === true) {
                        value = '';
                    }
                    DOM.setAttribute(element, propertyKey, value);
                }
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

        if (DOM.isCustomElement(element)) {
            // notify the Component that its slotted Nodes has been updated
            element.render();
        }

        // return the updated (or created) Node (or Component)
        return element;
    } as HyperFunction;
}
