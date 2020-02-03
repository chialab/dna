import { define, render, DOM, IDOM, prop, BaseComponent } from '../../dist/adapters/compat/dna.js';

// eslint-disable-next-line
const h = IDOM.h;
const WRAPPER = document.body;

class TestBaseComponent extends BaseComponent {
    static get observedAttributes() {
        return ['name'];
    }

    get properties() {
        return {
            name: String,
            lastName: prop.STRING.attribute('last-name'),
        };
    }

    get template() {
        return `<span>${this.name} ${this.lastName}</span>`;
    }

    constructor(...args) {
        super(...args);
        this.created = true;
    }

    connectedCallback() {
        super.connectedCallback();
        this.attached = true;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.attached = false;
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal);
        this[attr] = newVal;
    }
}

class TestBaseIDOMComponent extends BaseComponent {
    static get observedAttributes() {
        return ['name'];
    }

    get properties() {
        return {
            name: String,
            lastName: prop.STRING.attribute('last-name'),
            age: Number,
        };
    }

    get template() {
        return () => <span>{this.name} {this.lastName} {this.age}{this.undefinedProp}{false}{0}</span>;
    }

    constructor(node) {
        super(node);
        this.created = true;
    }

    connectedCallback() {
        super.connectedCallback();
        this.attached = true;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.attached = false;
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal);
        this[attr] = newVal;
    }
}

class TestBaseComponent1 extends TestBaseComponent { }
class TestBaseComponent2 extends TestBaseComponent { }
class TestBaseComponent3 extends TestBaseComponent { }
class TestBaseIDOMComponent2 extends TestBaseIDOMComponent { }

define('test-base-component', TestBaseComponent1);
define('test-base-component-2', TestBaseComponent2, {
    extends: 'button',
});
define('test-base-idom-component', TestBaseIDOMComponent);
define('test-base-idom-component-2', TestBaseIDOMComponent2, {
    extends: 'button',
});

DOM.lifeCycle(true);

describe.skip('[Compat] BaseComponent without definition', () => {
    describe.skip('> constructor', () => {
        it.skip('should throw', () => {
            assert.throws(() => new TestBaseComponent3(), 'Component has not been defined');
        });
    });
});

describe.skip('[Compat] BaseComponent', () => {
    let elem;
    before(() => {
        elem = new TestBaseComponent1();
        elem.lastName = 'Turing';
    });

    describe.skip('> created', () => {
        it.skip('check if element has the correct tag', () => {
            assert.equal(elem.node.tagName.toLowerCase(), 'test-base-component');
        });

        it.skip('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe.skip('> attached', () => {
        it.skip('check if element is correctly attached to the tree', () => {
            DOM.appendChild(WRAPPER, elem);
            assert.equal(elem.attached, true);
        });
    });

    describe.skip('> attributeChanged', () => {
        it.skip('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'name', 'Alan');
            assert.equal(elem.name, 'Alan');
        });
    });

    describe.skip('> render', () => {
        it.skip('check if element has been correctly rendered', () => {
            assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing');
        });
    });

    describe.skip('> detached', () => {
        it.skip('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            assert.equal(elem.attached, false);
        });
    });
});

describe.skip('[Compat] BaseComponent with native element', () => {
    let elem;
    before(() => {
        elem = new TestBaseComponent2();
        elem.lastName = 'Turing';
    });

    describe.skip('> created', () => {
        it.skip('check if element has the correct tag', () => {
            assert.equal(elem.node.tagName.toLowerCase(), 'button');
            assert.equal(elem.node.getAttribute('is').toLowerCase(), 'test-base-component-2');
        });

        it.skip('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe.skip('> attached', () => {
        it.skip('check if element is correctly attached to the tree', () => {
            DOM.appendChild(WRAPPER, elem);
            assert.equal(elem.attached, true);
        });
    });

    describe.skip('> attributeChanged', () => {
        it.skip('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'name', 'Alan');
            assert.equal(elem.name, 'Alan');
        });
    });

    describe.skip('> render', () => {
        it.skip('check if element has been correctly rendered', () => {
            assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing');
        });
    });

    describe.skip('> detached', () => {
        it.skip('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            assert.equal(elem.attached, false);
        });
    });
});

describe.skip('[Compat] Base IDOM Component', () => {
    let elem;
    before(() => {
        elem = render(WRAPPER, TestBaseIDOMComponent, { lastName: 'Turing', age: 42 });
    });

    describe.skip('> created', () => {
        it.skip('check if element has the correct tag', () => {
            assert.equal(elem.node.tagName.toLowerCase(), 'test-base-idom-component');
        });

        it.skip('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe.skip('> attached', () => {
        it.skip('check if element is correctly attached to the tree', () => {
            assert.equal(elem.attached, true);
        });
    });

    describe.skip('> attributeChanged', () => {
        it.skip('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'name', 'Alan');
            assert.equal(elem.name, 'Alan');
        });
    });

    describe.skip('> render', () => {
        it.skip('check if element has been correctly rendered', () => {
            assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing 42');
        });
    });

    describe.skip('> detached', () => {
        it.skip('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            assert.equal(elem.attached, false);
        });
    });
});

describe.skip('[Compat] Base IDOM Component with native element', () => {
    let elem;
    before(() => {
        elem = render(WRAPPER, TestBaseIDOMComponent2, { lastName: 'Turing', age: 42 });
    });

    describe.skip('> created', () => {
        it.skip('check if element has the correct tag', () => {
            assert.equal(elem.node.tagName.toLowerCase(), 'button');
            assert.equal(elem.node.getAttribute('is'), 'test-base-idom-component-2');
        });

        it.skip('check if element is correctly instantiated', () => {
            assert.equal(elem.created, true);
        });
    });

    describe.skip('> attached', () => {
        it.skip('check if element is correctly attached to the tree', () => {
            assert.equal(elem.attached, true);
        });
    });

    describe.skip('> attributeChanged', () => {
        it.skip('check if element is correctly trigger attributeChangedCallback', () => {
            DOM.setAttribute(elem, 'name', 'Alan');
            assert.equal(elem.name, 'Alan');
        });
    });

    describe.skip('> render', () => {
        it.skip('check if element has been correctly rendered', () => {
            assert.equal(elem.node.querySelector('span').textContent, 'Alan Turing 42');
        });
    });

    describe.skip('> detached', () => {
        it.skip('check if element is correctly detached from the tree', () => {
            DOM.removeChild(WRAPPER, elem);
            assert.equal(elem.attached, false);
        });
    });
});
