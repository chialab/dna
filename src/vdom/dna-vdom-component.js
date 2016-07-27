import { mix } from 'mixwith';
import { DNAComponent } from '../dna-component.js';
import { DNATemplateMixin } from '../dna-template-component.js';
import { DNAProperty } from '../helpers/dna-property.js';
import snabbdom from 'snabbdom/snabbdom';
import snabbdomClass from 'snabbdom/class';
import snabbdomStyle from 'snabbdom/style';
import snabbdomAttributes from 'snabbdom/attributes';
import h from 'snabbdom/h';

const VTREE_PROP = '__vtree';

const patch = snabbdom.init([
    snabbdomClass,
    snabbdomStyle,
    snabbdomAttributes,
]);

function isVNode(elem) {
    return (typeof elem === 'object' &&
        typeof elem.sel === 'string');
}

export const DNAVDomMixin = (SuperClass) => class extends mix(SuperClass).with(DNATemplateMixin) {
    /**
     * Update Component child nodes using VDOM trees.
     * @param {*} content Optional result of a `render` of an extended class.
     * @return Promise The render promise.
     */
    render(content) {
        content = content || this.constructor.template;
        if (typeof content === 'function') {
            content = content.call(this);
        }
        if (isVNode(content) || Array.isArray(content)) {
            let vtree = DNAProperty.get(this, VTREE_PROP) || this;
            let tree = h(this.tagName.toLowerCase(), {}, isVNode(content) ? [content] : content);
            patch(vtree, tree);
            DNAProperty.set(this, VTREE_PROP, tree, false);
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
export class DNAVDomComponent extends mix(DNAComponent).with(DNAVDomMixin) {}
