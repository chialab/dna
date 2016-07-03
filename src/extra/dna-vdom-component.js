import { virtualDom } from 'vdom';
import { DNATemplateComponent } from '../dna-template-component.js';
import { DNAProperty, registry } from '../dna-helper.js';

function getCtr(node) {
    return registry(node.getAttribute('is')) || registry(node.tagName);
}

/**
 * A virtualDom hook for life cycle handling.
 * @private
 * @class DNALifeCycleHook
 */
class DNALifeCycleHook {
    static get CREATED_PROP() {
        return '__virtualDomCreated';
    }

    static get ATTACHED_PROP() {
        return '__virtualDomAttached';
    }

    hook(node) {
        let created = DNAProperty.get(node, DNALifeCycleHook.CREATED_PROP);
        if (!created) {
            DNAProperty.set(node, DNALifeCycleHook.CREATED_PROP, true, false);
        }
        this.isAttached(node);
    }

    isAttached(node) {
        let attached = DNAProperty.get(node, DNALifeCycleHook.ATTACHED_PROP);
        if (this.parentNode && !attached) {
            DNAProperty.set(node, DNALifeCycleHook.ATTACHED_PROP, true, false);
            this.trigger('attachedCallback');
        } else if (!this.parentNode && attached) {
            DNAProperty.set(node, DNALifeCycleHook.ATTACHED_PROP, false, false);
            this.trigger('detachedCallback');
        }
    }

    trigger(name, ...args) {
        if (typeof this[name] === 'function') {
            this[name].apply(this, args);
        }
    }
}

/**
 * A virtualDom hook for attributes handling.
 * @private
 * @class DNAAttributeHook
 */
class DNAAttributeHook {
    constructor(value, namespace) {
        this.value = value;
        this.namespace = namespace;
    }

    hook(node, propertyName, oldValue) {
        let value = this.value;
        let old = oldValue && oldValue.value;
        if (old !== value) {
            if (value !== undefined && value !== null) {
                if (this.namespace) {
                    node.removeAttribute(propertyName);
                    node.setAttributeNS(this.namespace, propertyName, value);
                } else {
                    node.setAttribute(propertyName, value);
                }
            } else if (oldValue) {
                if (this.namespace) {
                    node.removeAttributeNS(this.namespace, propertyName);
                } else {
                    node.removeAttribute(propertyName);
                }
            }
            if (typeof node.attributeChangedCallback === 'function') {
                node.attributeChangedCallback(propertyName, old, value);
            }
        }
    }
}

/**
 * Extract node's attributes.
 * @private
 * @param {Node} node The node to parse.
 * @return {Object} A key => value object with node's attributes.
 */
function attributesToProp(node, options = {}, hooks = true) {
    let res = {};
    Array.prototype.forEach.call(node.attributes || [], (attr) => {
        if (hooks && attr.name !== 'is') {
            res[attr.name] = new DNAAttributeHook(attr.value, options.namespace);
        } else {
            res[attr.name] = attr.value;
        }
    });
    return res;
}

/**
 * Convert a Node to a VDOM Node.
 * @private
 * @param {Node} node The node to convert.
 * @param {Object} parentOptions The node's parent options (optional).
 * @return {Object} A VDOM Node.
 */
function nodeToVDOM(node, parentOptions = {}) {
    if (typeof node === 'undefined' || node.nodeType === Node.COMMENT_NODE) {
        return false;
    } else if (node.nodeType === Node.TEXT_NODE) {
        return new virtualDom.VText(node.textContent);
    }
    let options = {};
    for (let k in parentOptions) {
        if (parentOptions.hasOwnProperty(k)) {
            options[k] = parentOptions[k];
        }
    }
    if (node.tagName && node.tagName.toLowerCase() === 'svg') {
        options.namespace = 'http://www.w3.org/2000/svg';
    }
    let Ctr = getCtr(node);
    let useHooks = options.hooks && typeof Ctr === 'function';
    let properties = attributesToProp(node, options, useHooks);
    if (useHooks) {
        properties['life-cycle-hook'] = new DNALifeCycleHook();
    } else {
        properties = {
            attributes: properties,
        };
    }
    let childNodes = Array.prototype.filter.call(node.childNodes || [], (n) =>
        n && n instanceof Node && n.nodeType !== Node.COMMENT_NODE
    );
    return new virtualDom.VNode(
        node.tagName,
        properties,
        childNodes.map((n) => nodeToVDOM(n, options)),
        undefined,
        options.namespace
    );
}

/**
 * Same as DNATemplateComponent, but with VDOM support.
 * This component is available only including /dna\.vdom(\-?.*)\.js/ libraries.
 * @class DNAVDomComponent
 * @extends DNATemplateComponent
 *
 * @example
 * my-component.js
 * ```js
 * import { DNAVDomComponent } from 'dna/component';
 * export class MyComponent extends DNAVDomComponent {
 *   static get template() {
 *     return new virtualDom.VNode('h1', {}, this.name);
 *   }
 *   get name() {
 *     return 'Newton';
 *   }
 * }
 * ```
 * app.js
 * ```js
 * import { Register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * var MyElement = Register(MyComponent);
 * var element = new MyElement();
 * console.log(element.innerHTML); // logs "<h1>Newton</h1>"
 * ```
 */
export class DNAVDomComponent extends DNATemplateComponent {
    /**
     * Use virtualDom hooks for component life-cycle.
     */
    static get useVirtualDomHooks() {
        return true;
    }
    /**
     * Update Component child nodes using VDOM trees.
     * @param {*} content Optional result of a `render` of an extended class.
     */
    updateViewContent(content) {
        // Render the template
        content = content || this.render();
        if (content !== null && content !== undefined) {
            let tree = new virtualDom.VNode(this.tagName);
            let vtree = DNAProperty.get(this, '__vtree') || tree;
            if (typeof content === 'string') {
                let parser = new DOMParser();
                let doc = parser.parseFromString(
                    content,
                    'text/html'
                );
                content = doc.body && doc.body.childNodes;
            }
            if (content instanceof Node) {
                content = [content];
            } else if (content instanceof NodeList) {
                content = Array.prototype.slice.call(content, 0);
            }
            if (Array.isArray(content)) {
                let useHooks = registry(this.is).useVirtualDomHooks;
                content = content.map((contentChild) =>
                    nodeToVDOM(contentChild, {
                        hooks: useHooks,
                    })
                );
                tree = new virtualDom.VNode(this.tagName, {}, content);
            }
            if (tree instanceof virtualDom.VNode) {
                let diff = virtualDom.diff(vtree || nodeToVDOM(), tree);
                virtualDom.patch(this, diff);
                DNAProperty.set(this, '__vtree', tree, false);
            }
        }
    }
}
