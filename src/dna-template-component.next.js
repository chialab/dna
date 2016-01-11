/**
 *
 * @see http://www.2ality.com/2015/01/template-strings-html.html
 */

'use strict';

import { DNAComponent } from './dna-component.next.js'

function htmlEscape(str) {
    return str.replace(/&/g, '&amp;') // first!
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;');
}

function render(literalSections, ...substs) {
    // Use raw literal sections: we don’t want
    // backslashes (\n etc.) to be interpreted
    let raw = literalSections.raw;

    let result = '';

    substs.forEach((subst, i) => {
        // Retrieve the literal section preceding
        // the current substitution
        let lit = raw[i];

        // In the example, map() returns an array:
        // If substitution is an array (and not a string),
        // we turn it into a string
        if (Array.isArray(subst)) {
            subst = subst.join('');
        }

        // If the substitution is preceded by a dollar sign,
        // we escape special characters in it
        if (lit.endsWith('$')) {
            subst = htmlEscape(subst);
            lit = lit.slice(0, -1);
        }
        result += lit;
        result += subst;
    });
    // Take care of last literal section
    // (Never fails, because an empty template string
    // produces one literal section, an empty string)
    result += raw[raw.length - 1]; // (A)

    return result;
}

export class DNATemplateComponent {
    /**
     * Fires when an the element is registered.
     */
    static onRegister(...args) {
        // Create render function
        let ctr = this;
        if (this.template) {
            if (typeof ctr.template === 'function') {
                ctr.prototype.render = ctr.template.bind(this);
            } else if (typeof ctr.template == 'string') {
                let template = ctr.template;
                ctr.prototype.render = (function(scope) {
                    return function() {
                        try {
                            return eval('render`' + template + '`');
                        } catch(ex) {
                            console.error(ex);
                        }
                    }
                })(this);
            } else if (ctr.template instanceof Node && ctr.template.tagName == 'TEMPLATE') {
                ctr.prototype.render = () => document.importNode(ctr.template.content, true);
            }
        }
    }
    /**
     * Fires when an instance of the element is created.
     */
    createdCallback() {
        // Render the template
        var nodes = this.render();
        if (typeof nodes === 'string') {
            this.innerHTML = nodes;
        } else if (nodes instanceof NodeList) {
            for (let i = 0, len = nodes.length; i < len; i++) {
                this.appendChild(nodes[i]);
            }
        } else if (nodes instanceof Node) {
            this.appendChild(nodes);
        }
        DNAComponent.prototype.createdCallback.call(this);
    }
}
