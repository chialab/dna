import Template from 'skin-template';

function appendOuterNodes(parent, children) {
    for (let i = 0, len = children.length; i < len; i++) {
        parent.outer.appendChild(children[i]);
    }
}

const IDOM = Template.IDOM;
const ADDED_CALLBACK = IDOM.notifications.nodesCreated;
IDOM.notifications.nodesCreated = function(nodes) {
    if (rendering) {
        nodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE &&
                node.hasAttribute('outer')) {
                rendering.outer = node;
            }
        });
    }
    /* istanbul ignore if */
    if (ADDED_CALLBACK) {
        ADDED_CALLBACK(nodes);
    }
};

let rendering;

export const OuterMixin = (superClass) => class extends superClass {
    constructor() {
        super();
        if (this.hasOwnProperty('template')) {
            this.__initialChildren = [].slice.call(this.childNodes).map((node) => {
                this.removeChild(node);
                return node;
            });
            this.childrenObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length && rendering !== this && this.outer) {
                        appendOuterNodes(this, mutation.addedNodes);
                    }
                });
            });
        }
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.childrenObserver) {
            this.childrenObserver.observe(this, {
                childList: true,
            });
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.childrenObserver) {
            this.childrenObserver.disconnect();
        }
    }

    render() {
        rendering = this;
        super.render();
        rendering = null;
        if (this.childrenObserver && this.__initialChildren && this.outer) {
            appendOuterNodes(this, this.__initialChildren);
            delete this.__initialChildren;
        }
    }
};
