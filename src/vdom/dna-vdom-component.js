import * as virtualDom from './lib/vdom.js';
import { mix } from 'mixwith';
import { DNATemplateMixin } from '../dna-template-component.js';
import { DNAProperty } from '../helpers/dna-property.js';
import { templateToNodes } from '../helpers/template.js';
import { nodeToVDOM } from './helpers/node-to-vdom.js';

const VTREE_PROP = '__vtree';

export const DNAVDomMixin = (SuperClass) => class extends mix(SuperClass).with(DNATemplateMixin) {
    /**
     * Use virtualDom hooks for component life-cycle.
     */
    static get useVirtualDomHooks() {
        return true;
    }
    /**
     * Update Component child nodes using VDOM trees.
     * @param {*} content Optional result of a `render` of an extended class.
     * @return Promise The render promise.
     */
    render(content) {
        content = content || this.constructor.template;
        content = templateToNodes(this, content);
        if (content !== null && content !== undefined) {
            let tree = new virtualDom.VNode(this.tagName);
            let vtree = DNAProperty.get(this, VTREE_PROP) || tree;
            if (content instanceof virtualDom.VNode) {
                tree = new virtualDom.VNode(this.tagName, {}, [content]);
            } else if (Array.isArray(content)) {
                let useHooks = this.constructor.useVirtualDomHooks;
                content = content.map((contentChild) =>
                    nodeToVDOM(contentChild, {
                        hooks: useHooks,
                    })
                );
                tree = new virtualDom.VNode(this.tagName, {}, content);
            }
            if (tree instanceof virtualDom.VNode) {
                let diff = virtualDom.diff(vtree, tree);
                virtualDom.patch(this, diff);
                DNAProperty.set(this, VTREE_PROP, tree, false);
            }
            return Promise.resolve();
        }
        return Promise.reject();
    }
};

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
 *     return new DNA.vdom.VNode('h1', {}, this.name);
 *   }
 *   get name() {
 *     return 'Newton';
 *   }
 * }
 * ```
 * app.js
 * ```js
 * import { register } from 'dna/component';
 * import { MyComponent } from './components/my-component/my-component.js';
 * var MyElement = register('my-component', MyComponent);
 * var element = new MyElement();
 * console.log(element.innerHTML); // logs "<h1>Newton</h1>"
 * ```
 */
export class DNAVDomComponent extends mix(HTMLElement).with(DNAVDomMixin) {}
