import { prop, define, render, IDOM, DOM, BaseComponent } from '@chialab/dna/compat';
import { getComponentName } from '../../test/helpers.js';

describe('[Compat] TemplateComponent', () => {
    let wrapper, BaseTestComponent;

    before(() => {
        DOM.lifeCycle(true);
        wrapper = DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);

        BaseTestComponent = class BaseTestComponent extends BaseComponent {
            static get properties() {
                return {
                    name: String,
                    lastName: String,
                    title: String,
                };
            }

            get fullname() {
                return `${this.name ? `${this.name} ` : ''}${this.lastName || ''}`;
            }
        };
    });

    it('should handle `template` getter property as function with interpolation', () => {
        class TestComponent extends BaseTestComponent {
            get template() {
                return () => {
                    this.node.innerHTML = `${this.title ? `<h1>${this.title}</h1><br>` : ''}Hello, ${this.fullname}`;
                };
            }
        }
        define(getComponentName(), TestComponent);

        const element = render(wrapper, TestComponent);
        assert.equal(element.node.innerHTML, 'Hello, ');
        element.name = 'Alan';
        element.lastName = 'Turing';
        element.title = 'Title';
        assert.equal(element.node.innerHTML, '<h1>Title</h1><br>Hello, Alan Turing');
    });

    it('should handle `template` getter property as string', () => {
        class TestComponent extends BaseTestComponent {
            get template() {
                return '<span class="dna-test">Hello DNA!</span>';
            }
        }
        define(getComponentName(), TestComponent);

        const element = render(wrapper, TestComponent);
        assert.equal(element.node.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    it('should handle `template` getter property as number', () => {
        class TestComponent extends BaseTestComponent {
            get template() {
                return 4;
            }
        }
        define(getComponentName(), TestComponent);

        const element = render(wrapper, TestComponent);
        assert.equal(element.node.innerHTML, '4');
    });

    it('should handle templates with <svg>', () => {
        class TestComponent extends BaseTestComponent {
            get template() {
                return () => {
                    this.node.innerHTML = `
                        <svg>
                            <circle r="${this.radius}" stroke="black" stroke-width="3" fill="red" />
                        </svg>
                    `;
                };
            }

            static get properties() {
                return {
                    radius: Number,
                };
            }
        }
        define(getComponentName(), TestComponent);

        const element = render(wrapper, TestComponent);
        element.radius = 40;
        let svg = element.node.querySelector('svg');
        let circle = svg.querySelector('circle');
        assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        assert.equal(circle.getAttribute('r'), '40');
    });
});

describe('[Compat] IDOMTemplateComponent', () => {
    let wrapper, BaseTestComponent;

    before(() => {
        DOM.lifeCycle(true);
        wrapper = DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);

        BaseTestComponent = class BaseTestComponent extends BaseComponent {
            static get properties() {
                return {
                    name: String,
                    lastName: String,
                    title: String,
                };
            }

            get fullname() {
                return `${this.name ? `${this.name} ` : ''}${this.lastName || ''}`;
            }
        };
    });

    it('should handle `template` with IDOM calls', () => {
        class TestComponent extends BaseTestComponent {
            get template() {
                return () => [
                    this.title && [
                        IDOM.h('h1', {}, this.title),
                        IDOM.h('br'),
                    ],
                    IDOM.h('span', {}, 'Hello, ', this.fullname),
                ];
            }
        }
        define(getComponentName(), TestComponent);

        const element = render(wrapper, TestComponent);
        assert.equal(element.node.innerHTML, '<span>Hello, </span>');
        element.name = 'Alan';
        element.lastName = 'Turing';
        element.title = 'Title';
        assert.equal(element.node.innerHTML, '<h1>Title</h1><br><span>Hello, Alan Turing</span>');
    });

    it('should handle `template` with JSX IDOM calls', () => {
        class TestComponent extends BaseTestComponent {
            get template() {
                return IDOM.h('span', { class: 'dna-test' }, 'Hello DNA!');
            }
        }
        define(getComponentName(), TestComponent);

        const element = render(wrapper, TestComponent);
        assert.equal(element.node.innerHTML, '<span class="dna-test">Hello DNA!</span>');
    });

    it('should handle templates with <svg>', () => {
        class TestComponent extends BaseTestComponent {
            get template() {
                return IDOM.h('svg', {}, [
                    IDOM.h('circle', {
                        'stroke': 'black',
                        'stroke-width': '3',
                        'fill': 'red',
                        'r': this.radius,
                    }),
                ]);
            }

            static get properties() {
                return {
                    radius: Number,
                };
            }
        }
        define(getComponentName(), TestComponent);

        const element = render(wrapper, TestComponent);
        element.radius = 40;
        const svg = element.node.firstElementChild;
        const circle = svg.querySelector('circle');
        assert.equal(svg && svg.tagName.toUpperCase(), 'SVG');
        assert.equal(circle.getAttribute('r'), '40');
    });

    describe('should handle sub components', () => {
        let element, placeholderName = getComponentName(), placeholderName2 = getComponentName();
        before(() => {
            class PlaceholderTestComponent extends BaseComponent {
                static get observedAttributes() {
                    return ['value'];
                }

                static get properties() {
                    return {
                        value: prop.NUMBER.attribute(),
                        attached: prop.BOOLEAN,
                    };
                }

                constructor(node) {
                    super(node);
                    this.value = 6;
                }

                connectedCallback() {
                    super.connectedCallback();
                    this.attached = this.isConnected;
                }

                disconnectedCallback() {
                    super.disconnectedCallback();
                    this.attached = this.isConnected;
                }
            }
            define(placeholderName, PlaceholderTestComponent);

            class Placeholder2TestComponent extends BaseComponent {
                static get observedAttributes() {
                    return ['value'];
                }

                static get properties() {
                    return {
                        value: Number,
                    };
                }

                constructor(node) {
                    super(node);
                    this.value = 11;
                }
            }
            define(placeholderName2, Placeholder2TestComponent, {
                extends: 'figure',
            });

            class TestElement extends BaseTestComponent {
                get template() {
                    return () => [
                        IDOM.h('span', { class: 'dna-test' }, 'Hello Dna!'),
                        IDOM.h(placeholderName),
                        IDOM.h('figure', {
                            is: placeholderName2,
                        }),
                    ];
                }
            }
            define(getComponentName(), TestElement);
            element = render(wrapper, TestElement);
        });

        it('and their callbacks', () => {
            const testElement1 = element.node.querySelector(placeholderName);
            const testElement2 = element.node.querySelector('figure');
            assert.equal(DOM.getNodeComponent(testElement1).value, 6);
            assert.equal(DOM.getNodeComponent(testElement2).value, 11);
        });

        it('and their life cycle (connected)', () => {
            const testElement1 = element.node.querySelector(placeholderName);
            assert.equal(DOM.getNodeComponent(testElement1).attached, true);
        });

        it('and their life cycle (disconnected)', () => {
            DOM.removeChild(wrapper, element);
            const testElement = element.node.querySelector(placeholderName);
            assert.equal(DOM.getNodeComponent(testElement).attached, false);
        });

        it('and their life cycle (riconnected)', () => {
            DOM.appendChild(wrapper, element);
            const testElement = element.node.querySelector(placeholderName);
            assert.equal(DOM.getNodeComponent(testElement).attached, true);
        });
    });
});
