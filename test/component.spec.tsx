import _decorate from '@babel/runtime/helpers/decorate';
import * as DNA from '@chialab/dna';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

describe(
    'Component',
    () => {
        let wrapper: HTMLElement;
        beforeEach(() => {
            wrapper = document.createElement('div');
            document.body.appendChild(wrapper);
        });

        afterEach(() => {
            if (wrapper.parentNode) {
                document.body.removeChild(wrapper);
            }
        });

        describe('#new', () => {
            it('should create a node', () => {
                const TestElement = DNA.define('test-component-1', class extends DNA.Component {});
                const element = new TestElement();

                expect(element).toBeInstanceOf(window.HTMLElement);
                expect(element).toHaveProperty('is', 'test-component-1');
                expect(element).toHaveProperty('tagName', 'TEST-COMPONENT-1');
            });

            it('should extend a native node', () => {
                const TestElement = DNA.define('test-component-2', class extends DNA.Component {}, {
                    extends: 'article',
                });
                const element = new TestElement();

                expect(element).toBeInstanceOf(window.HTMLElement);
                expect(element).toHaveProperty('is', 'test-component-2');
                expect(element).toHaveProperty('tagName', 'ARTICLE');
            });

            it('should create a base class starting from the anchor base class', () => {
                const TestElement = DNA.define('test-component-3', class extends DNA.HTML.Anchor {}, {
                    extends: 'a',
                });
                const element = new TestElement();
                element.href = 'https://www.webcomponents.org/introduction';

                expect(TestElement).not.toBe(HTMLAnchorElement);
                expect(element).toBeInstanceOf(HTMLAnchorElement);
                expect('href' in element).toBe(true);
            });

            it('should throw if element is not defined', () => {
                class TestElement extends DNA.Component {}
                expect(() => new TestElement()).toThrow(TypeError);
            });

            it('should setup properties', () => {
                @DNA.customElement('test-component-4')
                class TestElement extends DNA.Component {
                    static get properties() {
                        return {
                            myCustomProp1: {
                                attribute: 'custom-prop',
                            },
                        };
                    }

                    declare myCustomProp1: string;

                    @DNA.property()
                    myCustomProp2 = '';

                    @DNA.property()
                    myCustomProp3 = '';
                }

                const element = new TestElement();
                expect(element).toHaveProperty('myCustomProp1');
                expect(element).toHaveProperty('myCustomProp2');
                expect(element).toHaveProperty('myCustomProp3');
                expect(element).not.toHaveProperty('myCustomProp4');
            });

            it('should setup properties with babel decorator', () => {
                const TestElement = _decorate(
                    [DNA.customElement('test-component-5')],
                    (_initialize, _DNA$Component) => {
                        class TestElement extends _DNA$Component {
                            constructor(node?: HTMLElement) {
                                super(node);
                                _initialize(this);
                            }
                        }

                        return {
                            F: TestElement,
                            d: [
                                {
                                    kind: 'get',
                                    static: true,
                                    key: 'properties',
                                    value: function properties() {
                                        return {
                                            myCustomProp1: {
                                                attribute: 'custom-prop',
                                            },
                                        };
                                    },
                                },
                                {
                                    kind: 'field',
                                    decorators: [DNA.property()],
                                    key: 'myCustomProp2',
                                    value() {
                                        return '';
                                    },
                                },
                                {
                                    kind: 'field',
                                    decorators: [DNA.property()],
                                    key: 'myCustomProp3',
                                    value() {
                                        return '';
                                    },
                                },
                            ],
                        };
                    },
                    DNA.Component
                );

                const element = new TestElement();
                expect(element).toHaveProperty('myCustomProp1');
                expect(element).toHaveProperty('myCustomProp2');
                expect(element).toHaveProperty('myCustomProp3');
                expect(element).not.toHaveProperty('myCustomProp4');
            });

            it('should setup properties for extended elements', () => {
                const _forceUpdate = vi.fn();

                @DNA.customElement('test-component-6', { extends: 'article' })
                class TestElement extends DNA.Component {
                    static get properties() {
                        return {
                            myCustomProp1: {
                                attribute: 'custom-prop',
                            },
                        };
                    }

                    declare myCustomProp1: string;

                    @DNA.property()
                    myCustomProp2 = '';

                    @DNA.property()
                    myCustomProp3 = '';

                    render() {
                        return this.myCustomProp1;
                    }

                    forceUpdate() {
                        _forceUpdate();
                        super.forceUpdate();
                    }
                }

                const element = new TestElement();
                expect(element).toHaveProperty('myCustomProp1');
                expect(element).toHaveProperty('myCustomProp2');
                expect(element).toHaveProperty('myCustomProp3');
                expect(element).not.toHaveProperty('myCustomProp4');
                expect(_forceUpdate).not.toHaveBeenCalled();

                element.myCustomProp1 = 'Hello';
                element.forceUpdate();
                expect(element).toHaveProperty('textContent', 'Hello');
            });

            it('should setup properties for extended components (ts over ts)', () => {
                @DNA.customElement('test-component-7')
                class BaseElement extends DNA.Component {
                    static get properties() {
                        return {
                            myCustomProp1: {
                                attribute: 'custom-prop',
                            },
                        };
                    }

                    declare myCustomProp1: string;

                    @DNA.property()
                    myCustomProp2 = '';

                    @DNA.property()
                    myCustomProp3 = '';

                    render() {
                        return this.myCustomProp1;
                    }
                }

                const _forceUpdate = vi.fn(() => {});

                @DNA.customElement('test-component-8')
                class TestElement extends BaseElement {
                    @DNA.property()
                    myCustomProp4 = '';

                    forceUpdate() {
                        _forceUpdate();
                        super.forceUpdate();
                    }
                }

                const element = new TestElement();
                expect(element).toHaveProperty('myCustomProp1');
                expect(element).toHaveProperty('myCustomProp2');
                expect(element).toHaveProperty('myCustomProp3');
                expect(element).toHaveProperty('myCustomProp4');
                expect(element).not.toHaveProperty('myCustomProp5');
                expect(_forceUpdate).not.toHaveBeenCalled();

                element.myCustomProp1 = 'Hello';
                element.forceUpdate();
                expect(element).toHaveProperty('textContent', 'Hello');
            });

            it('should setup properties for extended components (js over ts)', () => {
                @DNA.customElement('test-component-9')
                class BaseElement extends DNA.Component {
                    static get properties(): Record<string, DNA.PropertyConfig> {
                        return {
                            myCustomProp1: {
                                attribute: 'custom-prop',
                            },
                        };
                    }

                    declare myCustomProp1: string;

                    @DNA.property()
                    myCustomProp2 = '';

                    @DNA.property()
                    myCustomProp3 = '';

                    render() {
                        return this.myCustomProp1;
                    }
                }

                const _forceUpdate = vi.fn();
                const TestElement = DNA.define(
                    'test-component-10',
                    class TestElement extends BaseElement {
                        static get properties() {
                            return {
                                myCustomProp4: {
                                    type: String,
                                    defaultValue: '',
                                },
                            };
                        }

                        forceUpdate() {
                            _forceUpdate();
                            super.forceUpdate();
                        }
                    }
                );

                const element = new TestElement();
                expect(element).toHaveProperty('myCustomProp1');
                expect(element).toHaveProperty('myCustomProp2');
                expect(element).toHaveProperty('myCustomProp3');
                expect(element).toHaveProperty('myCustomProp4');
                expect(element).not.toHaveProperty('myCustomProp5');
                expect(_forceUpdate).not.toHaveBeenCalled();
                element.myCustomProp1 = 'Hello';
                element.forceUpdate();
                expect(element).toHaveProperty('textContent', 'Hello');
            });

            it('should connect already connected nodes', () => {
                let connected = false;

                wrapper.innerHTML = '<test-component-11></test-component-11>';
                expect(connected).toBe(false);
                DNA.define(
                    'test-component-11',
                    class extends DNA.Component {
                        connectedCallback() {
                            super.connectedCallback();
                            connected = true;
                        }
                    }
                );
                window.customElements.upgrade(wrapper);
                expect(connected).toBe(true);
            });

            it('should setup component via innerHTML', () => {
                class TestElement extends DNA.Component {
                    static get properties() {
                        return {
                            myCustomProp1: {
                                attribute: 'custom-prop',
                            },
                        };
                    }

                    declare myCustomProp1: string;

                    render() {
                        return (
                            <div>
                                <slot />
                            </div>
                        );
                    }
                }
                DNA.define('test-component-12', TestElement);

                wrapper.innerHTML = '<test-component-12 custom-prop="test"><span>test</span></test-component-12>';
                const element = wrapper.children[0] as TestElement;
                expect(element).toBeInstanceOf(DNA.Component);
                expect(element).toHaveProperty('is', 'test-component-12');
                expect(element).toHaveProperty('tagName', 'TEST-COMPONENT-12');
                expect(element).toHaveProperty('myCustomProp1', 'test');
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0].childNodes).toHaveLength(1);
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'SPAN');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'test');
            });

            it('should setup nested component via innerHTML', () => {
                class TestElement extends DNA.Component {
                    render() {
                        return (
                            <div>
                                <test-component-14>
                                    <slot />
                                </test-component-14>
                            </div>
                        );
                    }
                }
                DNA.define('test-component-13', TestElement);
                DNA.define(
                    'test-component-14',
                    class extends DNA.Component {
                        render() {
                            return (
                                <div>
                                    <slot />
                                </div>
                            );
                        }
                    }
                );

                wrapper.innerHTML = '<test-component-13><span>test</span></test-component-13>';
                const element = wrapper.children[0] as TestElement;
                expect(element).toBeInstanceOf(DNA.Component);
                expect(element).toHaveProperty('is', 'test-component-13');
                expect(element).toHaveProperty('tagName', 'TEST-COMPONENT-13');
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0].childNodes).toHaveLength(1);
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'TEST-COMPONENT-14');
                expect(element.childNodes[0].childNodes[0].childNodes).toHaveLength(1);
                expect(element.childNodes[0].childNodes[0].childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0].childNodes[0].childNodes[0].childNodes).toHaveLength(1);
                expect(element.childNodes[0].childNodes[0].childNodes[0].childNodes[0]).toHaveProperty(
                    'tagName',
                    'SPAN'
                );
                expect(element.childNodes[0].childNodes[0].childNodes[0].childNodes[0]).toHaveProperty(
                    'textContent',
                    'test'
                );
            });
        });

        describe('#connectedCallback|disconnectedCallback', () => {
            it('should connect on appendChild and disconnect on removeChild', async () => {
                class TestElement extends DNA.Component {
                    spyConnectedCallback = vi.fn();
                    spyDisconnectedCallback = vi.fn();

                    connectedCallback() {
                        super.connectedCallback();
                        this.spyConnectedCallback();
                    }
                    disconnectedCallback() {
                        super.disconnectedCallback();
                        this.spyDisconnectedCallback();
                    }
                }

                const TestElement1 = DNA.define('test-component-15', class extends TestElement {});
                const TestElement2 = DNA.define('test-component-16', class extends TestElement {}, {
                    extends: 'article',
                });

                const custom = new TestElement1();
                expect(custom.spyConnectedCallback).not.toHaveBeenCalled();
                expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(custom);
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyConnectedCallback).toHaveBeenCalled();
                expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.removeChild(custom);
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyDisconnectedCallback).toHaveBeenCalled();

                const builtin = new TestElement2();
                expect(builtin.spyConnectedCallback).not.toHaveBeenCalled();
                expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(builtin);
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyConnectedCallback).toHaveBeenCalled();
                expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.removeChild(builtin);
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyDisconnectedCallback).toHaveBeenCalled();
            });

            it('should connect on replaceChild', async () => {
                class TestElement extends DNA.Component {
                    spyConnectedCallback = vi.fn();
                    spyDisconnectedCallback = vi.fn();

                    connectedCallback() {
                        super.connectedCallback();
                        this.spyConnectedCallback();
                    }

                    disconnectedCallback() {
                        super.disconnectedCallback();
                        this.spyDisconnectedCallback();
                    }
                }

                const TestElement1 = DNA.define('test-component-17', class extends TestElement {});
                const TestElement2 = DNA.define('test-component-18', class extends TestElement {}, {
                    extends: 'article',
                });

                const custom = new TestElement1();
                const child = document.createElement('div');
                wrapper.appendChild(child);
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyConnectedCallback).not.toHaveBeenCalled();
                expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.replaceChild(custom, child);
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyConnectedCallback).toHaveBeenCalled();
                expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.replaceChild(child, custom);
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyConnectedCallback).toHaveBeenCalled();
                expect(custom.spyDisconnectedCallback).toHaveBeenCalled();
                expect(custom.spyConnectedCallback).toHaveBeenCalledOnce();
                expect(custom.spyDisconnectedCallback).toHaveBeenCalledOnce();

                const builtin = new TestElement2();
                const child2 = document.createElement('div');
                wrapper.appendChild(child2);
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyConnectedCallback).not.toHaveBeenCalled();
                expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.replaceChild(builtin, child2);
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyConnectedCallback).toHaveBeenCalled();
                expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.replaceChild(child2, builtin);
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyConnectedCallback).toHaveBeenCalled();
                expect(builtin.spyDisconnectedCallback).toHaveBeenCalled();
                expect(builtin.spyConnectedCallback).toHaveBeenCalledOnce();
                expect(builtin.spyDisconnectedCallback).toHaveBeenCalledOnce();
            });

            it('should connect on insertBefore', async () => {
                class TestElement extends DNA.Component {
                    spyConnectedCallback = vi.fn();
                    spyDisconnectedCallback = vi.fn();

                    connectedCallback() {
                        super.connectedCallback();
                        this.spyConnectedCallback();
                    }

                    disconnectedCallback() {
                        super.disconnectedCallback();
                        this.spyDisconnectedCallback();
                    }
                }

                const TestElement1 = DNA.define('test-component-19', class extends TestElement {});
                const TestElement2 = DNA.define('test-component-20', class extends TestElement {}, {
                    extends: 'article',
                });

                const custom = new TestElement1();
                const child = document.createElement('div');
                wrapper.appendChild(child);
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyConnectedCallback).not.toHaveBeenCalled();
                expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.insertBefore(custom, child);
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyConnectedCallback).toHaveBeenCalled();
                expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.insertBefore(child, custom);
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyConnectedCallback).toHaveBeenCalledOnce();
                expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();

                const builtin = new TestElement2();
                const child2 = document.createElement('div');
                wrapper.appendChild(child2);
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyConnectedCallback).not.toHaveBeenCalled();
                expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.insertBefore(builtin, child2);
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyConnectedCallback).toHaveBeenCalled();
                expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.insertBefore(child2, builtin);
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyConnectedCallback).toHaveBeenCalledOnce();
                expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
            });

            it('should connect if not moved', async () => {
                class TestElement extends DNA.Component {
                    spyConnectedCallback = vi.fn();
                    spyDisconnectedCallback = vi.fn();

                    connectedCallback() {
                        super.connectedCallback();
                        this.spyConnectedCallback();
                    }

                    disconnectedCallback() {
                        super.disconnectedCallback();
                        this.spyDisconnectedCallback();
                    }
                }

                const TestElement1 = DNA.define('test-component-21', class extends TestElement {});
                const TestElement2 = DNA.define('test-component-22', class extends TestElement {}, {
                    extends: 'article',
                });

                const custom = new TestElement1();
                expect(custom.spyConnectedCallback).not.toHaveBeenCalled();
                expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(custom);
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyConnectedCallback).toHaveBeenCalled();
                expect(custom.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(custom);
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyConnectedCallback).toHaveBeenCalledTimes(2);
                expect(custom.spyDisconnectedCallback).toHaveBeenCalledOnce();

                const builtin = new TestElement2();
                expect(builtin.spyConnectedCallback).not.toHaveBeenCalled();
                expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(builtin);
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyConnectedCallback).toHaveBeenCalled();
                expect(builtin.spyDisconnectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(builtin);
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyConnectedCallback).toHaveBeenCalledTimes(2);
                expect(builtin.spyDisconnectedCallback).toHaveBeenCalledOnce();
            });

            it('should render when connected', async () => {
                class TestElement extends DNA.Component {
                    render() {
                        return <h1>test</h1>;
                    }
                }

                const TestElement1 = DNA.define('test-component-23', class extends TestElement {});
                const TestElement2 = DNA.define('test-component-24', class extends TestElement {}, {
                    extends: 'article',
                });

                const custom = new TestElement1();
                expect(custom.innerHTML).toBe('');
                wrapper.appendChild(custom);
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.innerHTML).toBe('<h1>test</h1>');

                const builtin = new TestElement2();
                expect(builtin.innerHTML).toBe('');
                wrapper.appendChild(builtin);
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.innerHTML).toBe('<h1>test</h1>');
            });

            it('should connect only once when polyfilled', async () => {
                const spyConnectedCallback = vi.fn();

                DNA.define(
                    'test-component-80',
                    class extends DNA.HTML.Button {
                        connectedCallback(): void {
                            super.connectedCallback();
                            spyConnectedCallback();
                        }
                    },
                    {
                        extends: 'button',
                    }
                );

                const TestElement = DNA.define(
                    'test-component-81',
                    class extends DNA.Component {
                        render() {
                            return (
                                <button
                                    type="button"
                                    is="test-component-80">
                                    test
                                </button>
                            );
                        }
                    },
                    {
                        extends: 'article',
                    }
                );

                const element = new TestElement();
                expect(spyConnectedCallback).not.toHaveBeenCalled();

                wrapper.appendChild(element);

                // Wait for the connectedCallback to be called for polyfilled elements
                await new Promise((resolve) => setTimeout(resolve, 100));

                expect(spyConnectedCallback).toHaveBeenCalledOnce();
            });
        });

        describe('childListChangedCallback', () => {
            it('should trigger once, when connected', () => {
                const spyChildListChangedCallback = vi.fn();
                const TestElement = DNA.define(
                    'test-component-76',
                    class extends DNA.Component {
                        childListChangedCallback() {
                            super.childListChangedCallback();
                            spyChildListChangedCallback();
                        }
                    }
                );

                const element = new TestElement();
                element.appendChild(document.createElement('div'));
                expect(spyChildListChangedCallback).not.toHaveBeenCalled();

                wrapper.appendChild(element);
                expect(spyChildListChangedCallback).toHaveBeenCalledOnce();
            });

            it('should invoke when a node has been added', () => {
                const spyChildListChangedCallback = vi.fn();
                const TestElement = DNA.define(
                    'test-component-77',
                    class extends DNA.Component {
                        childListChangedCallback() {
                            super.childListChangedCallback();
                            spyChildListChangedCallback();
                        }
                    }
                );

                const element = new TestElement();
                expect(spyChildListChangedCallback).not.toHaveBeenCalled();

                wrapper.appendChild(element);
                expect(spyChildListChangedCallback).toHaveBeenCalledOnce();

                element.appendChild(document.createElement('div'));
                expect(spyChildListChangedCallback).toHaveBeenCalledTimes(2);
            });

            it('should invoke when a node has been removed', () => {
                const spyChildListChangedCallback = vi.fn();
                const TestElement = DNA.define(
                    'test-component-78',
                    class extends DNA.Component {
                        childListChangedCallback() {
                            super.childListChangedCallback();
                            spyChildListChangedCallback();
                        }
                    }
                );

                const element = new TestElement();
                const child = document.createElement('div');
                element.appendChild(child);
                expect(spyChildListChangedCallback).not.toHaveBeenCalled();

                wrapper.appendChild(element);
                expect(spyChildListChangedCallback).toHaveBeenCalledOnce();

                element.removeChild(child);
                expect(spyChildListChangedCallback).toHaveBeenCalledTimes(2);
            });

            it('should when the component has been upgraded', () => {
                const spyChildListChangedCallback = vi.fn();
                class TestElement extends DNA.Component {
                    childListChangedCallback() {
                        super.childListChangedCallback();
                        spyChildListChangedCallback();
                    }
                }

                const element = document.createElement('test-component-79') as TestElement;
                expect(spyChildListChangedCallback).not.toHaveBeenCalled();

                wrapper.appendChild(element);
                expect(spyChildListChangedCallback).not.toHaveBeenCalled();

                element.appendChild(document.createElement('div'));
                expect(spyChildListChangedCallback).not.toHaveBeenCalled();

                DNA.define('test-component-79', TestElement);
                window.customElements.upgrade(wrapper);

                expect(spyChildListChangedCallback).toHaveBeenCalledOnce();
            });
        });

        describe('~isConnected', () => {
            it('return `true` if element is connected', () => {
                const TestElement = DNA.define('test-component-25', class extends DNA.Component {});
                const element = new TestElement();

                wrapper.appendChild(element);
                expect(element.isConnected).toBe(true);
            });

            it('return `false` if element is disconnected', () => {
                const TestElement = DNA.define('test-component-26', class extends DNA.Component {});
                const element = new TestElement();

                expect(element.isConnected).toBe(false);
            });
        });

        describe('#attributeChangedCallback', () => {
            it('should handle attribute changes on setAttribute', async () => {
                class TestElement extends DNA.Component {
                    static get observedAttributes() {
                        return ['title'];
                    }

                    spyAttributeChangedCallback = vi.fn();

                    attributeChangedCallback(
                        attrName: string,
                        oldValue: null | string,
                        newValue: null | string,
                        namespace?: null | string
                    ) {
                        super.attributeChangedCallback(attrName, oldValue, newValue, namespace);
                        this.spyAttributeChangedCallback(attrName, oldValue, newValue, namespace);
                    }
                }

                const TestElement1 = DNA.define('test-component-27', class extends TestElement {});
                const TestElement2 = DNA.define('test-component-28', class extends TestElement {}, {
                    extends: 'article',
                });

                const custom = new TestElement1();
                expect(custom.spyAttributeChangedCallback).not.toHaveBeenCalled();
                custom.setAttribute('title', 'test');
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyAttributeChangedCallback).toHaveBeenCalled();
                expect(custom.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                custom.setAttribute('title', 'test2');
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyAttributeChangedCallback).toHaveBeenCalledWith('title', 'test', 'test2', null);

                const builtin = new TestElement2();
                expect(builtin.spyAttributeChangedCallback).not.toHaveBeenCalled();
                builtin.setAttribute('title', 'test');
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyAttributeChangedCallback).toHaveBeenCalled();
                expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                builtin.setAttribute('title', 'test2');
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledWith('title', 'test', 'test2', null);
            });

            it('should handle attribute changes on removeAttribute', async () => {
                class TestElement extends DNA.Component {
                    static get observedAttributes() {
                        return ['title'];
                    }

                    spyAttributeChangedCallback = vi.fn();

                    attributeChangedCallback(
                        attrName: string,
                        oldValue: null | string,
                        newValue: null | string,
                        namespace?: null | string
                    ) {
                        super.attributeChangedCallback(attrName, oldValue, newValue, namespace);
                        this.spyAttributeChangedCallback(attrName, oldValue, newValue, namespace);
                    }
                }

                const TestElement1 = DNA.define('test-component-29', class extends TestElement {});
                const TestElement2 = DNA.define('test-component-30', class extends TestElement {}, {
                    extends: 'article',
                });

                const custom = new TestElement1();
                expect(custom.spyAttributeChangedCallback).not.toHaveBeenCalled();
                custom.setAttribute('title', 'test');
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyAttributeChangedCallback).toHaveBeenCalled();
                expect(custom.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                custom.removeAttribute('title');
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyAttributeChangedCallback).toHaveBeenCalledWith('title', 'test', null, null);

                const builtin = new TestElement2();
                expect(builtin.spyAttributeChangedCallback).not.toHaveBeenCalled();
                builtin.setAttribute('title', 'test');
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyAttributeChangedCallback).toHaveBeenCalled();
                expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                builtin.removeAttribute('title');
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledWith('title', 'test', null, null);
            });

            it('should handle attribute if nothing changed on setAttribute', async () => {
                class TestElement extends DNA.Component {
                    static get observedAttributes() {
                        return ['title'];
                    }

                    spyAttributeChangedCallback = vi.fn();

                    attributeChangedCallback(
                        attrName: string,
                        oldValue: null | string,
                        newValue: null | string,
                        namespace?: null | string
                    ) {
                        super.attributeChangedCallback(attrName, oldValue, newValue, namespace);
                        this.spyAttributeChangedCallback(attrName, oldValue, newValue, namespace);
                    }
                }

                const TestElement1 = DNA.define('test-component-31', class extends TestElement {});
                const TestElement2 = DNA.define('test-component-32', class extends TestElement {}, {
                    extends: 'article',
                });

                const custom = new TestElement1();
                expect(custom.spyAttributeChangedCallback).not.toHaveBeenCalled();
                custom.setAttribute('title', 'test');
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyAttributeChangedCallback).toHaveBeenCalled();
                expect(custom.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                custom.setAttribute('title', 'test');
                await new Promise((r) => setTimeout(r, 0));
                expect(custom.spyAttributeChangedCallback).toHaveBeenCalledTimes(2);

                const builtin = new TestElement2();
                expect(builtin.spyAttributeChangedCallback).not.toHaveBeenCalled();
                builtin.setAttribute('title', 'test');
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyAttributeChangedCallback).toHaveBeenCalled();
                expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledWith('title', null, 'test', null);
                builtin.setAttribute('title', 'test');
                await new Promise((r) => setTimeout(r, 0));
                expect(builtin.spyAttributeChangedCallback).toHaveBeenCalledTimes(2);
            });

            describe('attribute and properties sync', () => {
                @DNA.customElement('test-component-33')
                class TestElement extends DNA.Component {
                    @DNA.property()
                    any = undefined;

                    @DNA.property({ type: Boolean })
                    boolean = false;

                    @DNA.property({ type: String })
                    string = '';

                    @DNA.property({ type: Number })
                    number = 0;

                    @DNA.property({
                        type: [String, Number],
                        attribute: 'string-number',
                    })
                    stringNumber?: string | number = '';

                    @DNA.property({ type: [Object] })
                    object = {};

                    @DNA.property({ type: [Array] })
                    array = [];

                    @DNA.property({
                        fromAttribute(value) {
                            return Number.parseInt(value as string, 10) * 2;
                        },
                        toAttribute(value) {
                            return `${(value as number) / 2}`;
                        },
                    })
                    convertion: string | number = '';
                }

                let element: TestElement;
                let fromAttributeSpy: Mock;
                beforeEach(() => {
                    fromAttributeSpy = vi.fn();
                    element = new TestElement();
                });

                describe('attribute to property value convertion', () => {
                    it('should handle unspecified type', () => {
                        element.setAttribute('any', '1');
                        expect(element.any).toBe(1);
                        element.setAttribute('any', 'test');
                        expect(element.any).toBe('test');
                        element.removeAttribute('any');
                        expect(element.any).toBeNull();
                    });

                    it('should handle boolean type', () => {
                        element.setAttribute('boolean', '');
                        expect(element.boolean).toBe(true);
                        element.removeAttribute('boolean');
                        expect(element.boolean).toBe(false);
                    });

                    it('should handle string type', () => {
                        element.setAttribute('string', '');
                        expect(element.string).toBe('');
                        element.setAttribute('string', 'test');
                        expect(element.string).toBe('test');
                        element.setAttribute('string', '1234');
                        expect(element.string).toBe('1234');
                        element.setAttribute('string', '{"test":1}');
                        expect(element.string).toBe('{"test":1}');
                        element.setAttribute('string', '[1]');
                        expect(element.string).toBe('[1]');
                        element.removeAttribute('string');
                        expect(element.string).toBeNull();
                    });

                    it('should handle number type', () => {
                        element.setAttribute('number', '1234');
                        expect(element.number).toBe(1234);
                        element.setAttribute('number', '-1234');
                        expect(element.number).toBe(-1234);
                        element.setAttribute('number', '1234.1234');
                        expect(element.number).toBe(1234.1234);
                        element.removeAttribute('number');
                        expect(element.number).toBeNull();
                    });

                    it('should handle string/number type', () => {
                        element.setAttribute('string-number', '');
                        expect(element.stringNumber).toBe('');
                        element.setAttribute('string-number', 'test');
                        expect(element.stringNumber).toBe('test');
                        element.setAttribute('string-number', '1234');
                        expect(element.stringNumber).toBe(1234);
                        element.setAttribute('string-number', '{"test":1}');
                        expect(element.stringNumber).toBe('{"test":1}');
                        element.setAttribute('string-number', '[1]');
                        expect(element.stringNumber).toBe('[1]');
                        element.removeAttribute('string-number');
                        expect(element.stringNumber).toBeNull();
                    });

                    it('should handle object type', () => {
                        element.setAttribute('object', '{}');
                        expect(element.object).toStrictEqual({});
                        element.setAttribute('object', '{"test":1}');
                        expect(element.object).toStrictEqual({ test: 1 });
                        element.removeAttribute('object');
                        expect(element.object).toBeNull();
                    });

                    it('should handle array type', () => {
                        element.setAttribute('array', '[]');
                        expect(element.array).toStrictEqual([]);
                        element.setAttribute('array', '[1]');
                        expect(element.array).toStrictEqual([1]);
                        element.removeAttribute('array');
                        expect(element.array).toBeNull();
                    });

                    it('should convert using configuration', () => {
                        element.setAttribute('convertion', '2');
                        expect(element.convertion).toBe(4);
                    });
                });

                describe('property to attribute value convertion', () => {
                    it('should convert using configuration', () => {
                        element.convertion = 4;
                        expect(element.getAttribute('convertion')).toBe('2');
                    });

                    it('should not convert attribute if set by property', () => {
                        element.convertion = 4;
                        expect(fromAttributeSpy).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('#propertyChangedCallback/stateChangedCallback', () => {
            it('should handle property changes on assignment', () => {
                const propertyChangedCallback = vi.fn();

                @DNA.customElement('test-component-34')
                class TestElement extends DNA.Component {
                    static get properties() {
                        return {
                            age: {
                                type: [Number],
                            },
                        };
                    }

                    declare age: number;

                    @DNA.property({ type: [String], attribute: false })
                    title: string;

                    constructor(node?: HTMLElement) {
                        super(node);
                        this.title = '';
                    }

                    propertyChangedCallback<P extends keyof this>(
                        propertyName: P,
                        oldValue: this[P] | undefined,
                        newValue: this[P]
                    ) {
                        super.propertyChangedCallback(propertyName, oldValue, newValue);
                        propertyChangedCallback(propertyName, oldValue, newValue);
                    }
                }

                const element = new TestElement();
                expect(propertyChangedCallback).not.toHaveBeenCalled();
                element.title = 'test';
                expect(propertyChangedCallback).toHaveBeenCalled();
                expect(propertyChangedCallback).toHaveBeenCalledWith('title', '', 'test');
                element.title = 'test2';
                expect(propertyChangedCallback).toHaveBeenCalledWith('title', 'test', 'test2');
                element.age = 42;
                expect(propertyChangedCallback).toHaveBeenCalledWith('age', undefined, 42);
                element.setAttribute('title', 'test');
                expect(propertyChangedCallback).toHaveBeenCalledTimes(3);
            });

            it('should handle state property changes on assignment', () => {
                const stateChangedCallback = vi.fn();

                @DNA.customElement('test-component-35')
                class TestElement extends DNA.Component {
                    static get properties() {
                        return {
                            age: {
                                type: [Number],
                                state: true,
                            },
                        };
                    }

                    declare age: number;

                    @DNA.state({ type: [String], attribute: false })
                    title: string;

                    constructor(node?: HTMLElement) {
                        super(node);
                        this.title = '';
                    }

                    stateChangedCallback<P extends keyof this>(
                        propertyName: P,
                        oldValue: this[P] | undefined,
                        newValue: this[P]
                    ) {
                        super.stateChangedCallback(propertyName, oldValue, newValue);
                        stateChangedCallback(propertyName, oldValue, newValue);
                    }
                }

                const element = new TestElement();
                expect(stateChangedCallback).not.toHaveBeenCalled();
                element.title = 'test';
                expect(stateChangedCallback).toHaveBeenCalled();
                expect(stateChangedCallback).toHaveBeenCalledWith('title', '', 'test');
                element.title = 'test2';
                expect(stateChangedCallback).toHaveBeenCalledWith('title', 'test', 'test2');
                element.age = 42;
                expect(stateChangedCallback).toHaveBeenCalledWith('age', undefined, 42);
                element.setAttribute('title', 'test');
                expect(stateChangedCallback).toHaveBeenCalledTimes(3);
            });

            it('should not loop on connection assignement', async () => {
                const propertyChangedCallback = vi.fn();
                wrapper.innerHTML = `<section is="test-component-36" page="1"></section>`;
                const element = wrapper.children[0];
                DNA.define(
                    'test-component-36',
                    class TestElement extends DNA.Component {
                        static get properties() {
                            return {
                                page: {
                                    type: Number,
                                },
                            };
                        }

                        declare page: number;

                        connectedCallback() {
                            super.connectedCallback();
                            this.page = 2;
                        }

                        propertyChangedCallback<P extends keyof this>(
                            propertyName: P,
                            oldValue: this[P] | undefined,
                            newValue: this[P]
                        ) {
                            super.propertyChangedCallback(propertyName, oldValue, newValue);
                            propertyChangedCallback(propertyName, oldValue, newValue);
                        }
                    },
                    {
                        extends: 'section',
                    }
                );
                window.customElements.upgrade(element);
                await new Promise((r) => setTimeout(r, 0));

                expect(propertyChangedCallback).toHaveBeenCalled();
                expect(propertyChangedCallback).toHaveBeenCalledWith('page', 1, 2);
                expect(propertyChangedCallback).toHaveBeenCalledTimes(2);
            });

            it('should NOT handle property changes on delete', () => {
                const propertyChangedCallback = vi.fn((name, old, value) => [name, old, value]);

                @DNA.customElement('test-component-37')
                class TestElement extends DNA.Component {
                    static get properties() {
                        return {
                            age: {
                                type: [Number],
                            },
                        };
                    }

                    declare age: number;

                    @DNA.property()
                    title: string;

                    constructor(node?: HTMLElement) {
                        super(node);
                        this.title = '';
                    }

                    propertyChangedCallback<P extends keyof this>(
                        propertyName: P,
                        oldValue: this[P] | undefined,
                        newValue: this[P]
                    ) {
                        super.propertyChangedCallback(propertyName, oldValue, newValue);
                        propertyChangedCallback(propertyName, oldValue, newValue);
                    }
                }

                const element = new TestElement();
                expect(propertyChangedCallback).not.toHaveBeenCalled();
                element.title = 'test';
                expect(propertyChangedCallback).toHaveBeenCalled();
                expect(propertyChangedCallback).toHaveBeenCalledWith('title', '', 'test');
                // @ts-expect-error
                // biome-ignore lint/performance/noDelete: Here we are testing delete
                delete element.title;
                expect(propertyChangedCallback).toHaveBeenCalledOnce();
            });

            it('should should re-render on property changes', () => {
                @DNA.customElement('test-component-38')
                class TestElement extends DNA.Component {
                    @DNA.property({ type: [String] })
                    title: string;

                    constructor(node?: HTMLElement) {
                        super(node);
                        this.title = '';
                    }

                    render() {
                        return <h1>{this.title}</h1>;
                    }
                }

                const element = wrapper.appendChild(new TestElement());
                expect(element.innerHTML).toBe('<h1></h1>');
                element.title = 'test';
                expect(element.innerHTML).toBe('<h1>test</h1>');
            });

            it('should should re-render once using assign', () => {
                const spy = vi.fn();

                @DNA.customElement('test-component-39')
                class TestElement extends DNA.Component {
                    @DNA.property({ type: [String] })
                    title: string;

                    @DNA.property({ type: [String] })
                    description: string;

                    constructor(node?: HTMLElement) {
                        super(node);
                        this.title = '';
                        this.description = '';
                    }

                    render() {
                        spy();
                        return (
                            <>
                                <h1>{this.title}</h1>
                                <h2>{this.description}</h2>
                            </>
                        );
                    }
                }

                const element = wrapper.appendChild(new TestElement());
                expect(element.innerHTML).toBe('<h1></h1><h2></h2>');
                element.assign({
                    title: 'test',
                    description: 'test',
                });
                expect(element.innerHTML).toBe('<h1>test</h1><h2>test</h2>');
                expect(spy).toHaveBeenCalledTimes(2);
            });

            it('should should re-render once using assign inside rendering cycle', () => {
                const spy = vi.fn();

                @DNA.customElement('test-component-40')
                class TestElement extends DNA.Component {
                    @DNA.property({ type: [String] })
                    title: string;

                    @DNA.property({ type: [String] })
                    description: string;

                    constructor(node?: HTMLElement) {
                        super(node);
                        this.title = '';
                        this.description = '';
                    }

                    render() {
                        spy();
                        const tpl = (
                            <>
                                <h1>{this.title}</h1>
                                <h2>{this.description}</h2>
                            </>
                        );
                        if (!this.title) {
                            this.assign({
                                title: 'test',
                                description: 'test',
                            });
                        }
                        return tpl;
                    }
                }

                const element = wrapper.appendChild(new TestElement());
                expect(element.innerHTML).toBe('<h1>test</h1><h2>test</h2>');
                expect(spy).toHaveBeenCalledTimes(2);
            });

            it('should render only once after construction', () => {
                const callback = vi.fn();

                @DNA.customElement('test-component-41')
                class TestElement extends DNA.Component {
                    static get properties() {
                        return {
                            author: String,
                            date: {
                                type: Date,
                                defaultValue: new Date(0),
                            },
                        };
                    }

                    @DNA.property()
                    title = '';

                    @DNA.property()
                    description = '';

                    @DNA.property()
                    body = 'Test';

                    declare author: string;
                    declare date: Date;

                    render() {
                        callback();
                        return (
                            <>
                                <div>{this.title}</div>
                                <div>{this.description}</div>
                                <div>{this.body}</div>
                                <div>{this.author}</div>
                                <div>{this.date.getTime()}</div>
                            </>
                        );
                    }
                }

                expect(callback).not.toHaveBeenCalled();
                const element = wrapper.appendChild(new TestElement());
                element.title = 'Test';
                element.description = 'Test';
                element.author = 'Test';
                expect(callback).toHaveBeenCalledTimes(4);
                expect(element.innerHTML).toBe(
                    '<div>Test</div><div>Test</div><div>Test</div><div>Test</div><div>0</div>'
                );
            });

            it('should NOT handle property if nothing changed on assignment', () => {
                const propertyChangedCallback = vi.fn();

                @DNA.customElement('test-component-42')
                class TestElement extends DNA.Component {
                    static get properties() {
                        return {
                            age: {
                                type: [Number],
                            },
                        };
                    }

                    declare age: number;

                    @DNA.property({ type: [String] })
                    title = '';

                    propertyChangedCallback<P extends keyof this>(
                        propertyName: P,
                        oldValue: this[P] | undefined,
                        newValue: this[P]
                    ) {
                        super.propertyChangedCallback(propertyName, oldValue, newValue);
                        propertyChangedCallback(propertyName, oldValue, newValue);
                    }
                }

                const element = new TestElement();
                expect(propertyChangedCallback).not.toHaveBeenCalled();
                element.title = 'test';
                expect(propertyChangedCallback).toHaveBeenCalled();
                expect(propertyChangedCallback).toHaveBeenCalledWith('title', '', 'test');
                element.title = 'test';
                expect(propertyChangedCallback).toHaveBeenCalledOnce();
            });

            it('should dispatch custom event', () => {
                const callback1 = vi.fn();
                const callback2 = vi.fn();

                @DNA.customElement('test-component-43')
                class TestElement extends DNA.Component {
                    static get properties() {
                        return {
                            age: {
                                type: [Number],
                                event: true,
                                defaultValue: 20,
                            },
                        };
                    }

                    declare age: number;

                    @DNA.property({ event: 'titleupdate' })
                    title = '';
                }

                const element = new TestElement();
                element.addEventListener('agechange', (event) =>
                    callback1(
                        event.type,
                        (event as CustomEvent).detail.oldValue,
                        (event as CustomEvent).detail.newValue
                    )
                );
                element.addEventListener('titleupdate', (event) =>
                    callback2(
                        event.type,
                        (event as CustomEvent).detail.oldValue,
                        (event as CustomEvent).detail.newValue
                    )
                );
                expect(callback1).not.toHaveBeenCalled();
                expect(callback2).not.toHaveBeenCalled();
                element.age = 25;
                expect(callback1).toHaveBeenCalled();
                expect(callback2).not.toHaveBeenCalled();
                expect(callback1).toHaveBeenCalledWith('agechange', 20, 25);
                element.title = 'Test';
                expect(callback2).toHaveBeenCalled();
                expect(callback2).toHaveBeenCalledWith('titleupdate', '', 'Test');
            });
        });

        describe('#textContent', () => {
            it('should retrieve whole textContent', () => {
                const TestElement = DNA.define(
                    'test-component-44',
                    class extends DNA.Component {
                        render() {
                            return (
                                <div>
                                    <slot /> inner text
                                </div>
                            );
                        }
                    }
                );
                const element = wrapper.appendChild(new TestElement());
                element.textContent = 'Test';
                expect(element).toHaveProperty('textContent', 'Test inner text');
            });

            it('should set slot text using textContent setter', () => {
                const TestElement = DNA.define(
                    'test-component-45',
                    class extends DNA.Component {
                        render() {
                            return (
                                <div>
                                    <slot />
                                </div>
                            );
                        }
                    }
                );
                const element = new TestElement();
                element.textContent = 'Test';
                wrapper.appendChild(element);
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0]).toHaveProperty('textContent', 'Test');
            });
        });

        describe('#innerHTML', () => {
            it('should retrieve whole innerHTML', () => {
                const TestElement = DNA.define(
                    'test-component-46',
                    class extends DNA.Component {
                        render() {
                            return (
                                <div>
                                    <slot /> inner text
                                </div>
                            );
                        }
                    }
                );
                const element = wrapper.appendChild(new TestElement());
                element.innerHTML = '<span>Test</span>';
                expect(element.innerHTML.indexOf('<div>')).toBe(0);
                expect(element.innerHTML.indexOf('<span>Test</span>')).not.toBe(-1);
            });

            it('should set slot text using innerHTML setter', () => {
                const TestElement = DNA.define(
                    'test-component-47',
                    class extends DNA.Component {
                        render() {
                            return (
                                <div>
                                    <slot />
                                </div>
                            );
                        }
                    }
                );
                const element = wrapper.appendChild(new TestElement());
                element.innerHTML = '<span>Test</span>';
                expect(element.children).toHaveLength(1);
                expect(element.children[0]).toHaveProperty('tagName', 'DIV');
                expect(element.children[0].children[0]).toHaveProperty('tagName', 'SPAN');
                expect(element.children[0].children[0]).toHaveProperty('textContent', 'Test');
            });
        });

        describe('#appendChild', () => {
            it('should append and connect child', () => {
                const connectedCallback = vi.fn();
                const TestElement = DNA.define('test-component-48', class extends DNA.Component {});
                const TestChild = DNA.define(
                    'test-component-49',
                    class extends DNA.Component {
                        connectedCallback() {
                            super.connectedCallback();
                            connectedCallback();
                        }
                    }
                );
                const element = new TestElement();
                const child = new TestChild();
                expect(connectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(element);
                element.appendChild(child);
                expect(connectedCallback).toHaveBeenCalled();
                element.appendChild(child);
                expect(connectedCallback).toHaveBeenCalledOnce();
            });

            it('should move and connect a child from a parent', () => {
                const connectedCallback = vi.fn();
                const disconnectedCallback = vi.fn();
                const TestElement = DNA.define('test-component-50', class extends DNA.Component {});
                const TestChild = DNA.define(
                    'test-component-51',
                    class extends DNA.Component {
                        connectedCallback() {
                            super.connectedCallback();
                            connectedCallback();
                        }
                        disconnectedCallback() {
                            super.disconnectedCallback();
                            disconnectedCallback();
                        }
                    }
                );
                const element = new TestElement();
                const child = new TestChild();

                expect(connectedCallback).not.toHaveBeenCalled();
                expect(disconnectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(element);
                wrapper.appendChild(child);
                expect(connectedCallback).toHaveBeenCalled();
                expect(disconnectedCallback).not.toHaveBeenCalled();
                element.appendChild(child);
                expect(connectedCallback).toHaveBeenCalledTimes(2);
                expect(disconnectedCallback).toHaveBeenCalled();
            });

            it('should render default slot', () => {
                const TestElement = DNA.define(
                    'test-component-52',
                    class extends DNA.Component {
                        render() {
                            return (
                                <div>
                                    <slot>
                                        <span>Test</span>
                                    </slot>
                                </div>
                            );
                        }
                    }
                );
                const element = wrapper.appendChild(new TestElement());
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'SPAN');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('textContent', 'Test');
            });

            it('should append slot item', () => {
                const TestElement = DNA.define(
                    'test-component-53',
                    class extends DNA.Component {
                        render() {
                            return (
                                <div>
                                    <slot>
                                        <span>Test</span>
                                    </slot>
                                </div>
                            );
                        }
                    }
                );
                const element = wrapper.appendChild(new TestElement());
                element.appendChild(document.createElement('span'));
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'SPAN');
            });
        });

        describe('#removeChild', () => {
            it('should remove and disconnect a child', () => {
                const disconnectedCallback = vi.fn();
                const TestElement = DNA.define('test-component-54', class extends DNA.Component {});
                const TestChild = DNA.define(
                    'test-component-55',
                    class extends DNA.Component {
                        disconnectedCallback() {
                            super.disconnectedCallback();
                            disconnectedCallback();
                        }
                    }
                );
                const element = new TestElement();
                const child = new TestChild();

                expect(disconnectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(element);
                element.appendChild(child);
                expect(disconnectedCallback).not.toHaveBeenCalled();
                element.removeChild(child);
                expect(disconnectedCallback).toHaveBeenCalled();
            });

            it('should remove slot item', () => {
                const TestElement = DNA.define(
                    'test-component-56',
                    class extends DNA.Component {
                        render() {
                            return (
                                <div>
                                    <slot />
                                </div>
                            );
                        }
                    }
                );
                const element = new TestElement();
                const span = document.createElement('span');
                wrapper.appendChild(element);
                element.appendChild(span);
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'SPAN');
                element.removeChild(span);
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0].childNodes).toHaveLength(0);
            });
        });

        describe('#insertBefore', () => {
            it('should insert and connect a child before another', () => {
                const connectedCallback = vi.fn();
                const TestElement = DNA.define('test-component-57', class extends DNA.Component {});
                const TestChild = DNA.define(
                    'test-component-58',
                    class extends DNA.Component {
                        connectedCallback() {
                            super.connectedCallback();
                            connectedCallback();
                        }
                    }
                );
                const element = new TestElement();
                const child1 = new TestChild();
                const child2 = new TestChild();
                const child3 = new TestChild();

                expect(connectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(element);
                element.appendChild(child1);
                element.insertBefore(child2, child1);
                element.insertBefore(child3, child2);
                expect(element.slotChildNodes[0]).toBe(child3);
                expect(element.slotChildNodes[1]).toBe(child2);
                expect(element.slotChildNodes[2]).toBe(child1);
                expect(element.childNodes[0]).toBe(child3);
                expect(element.childNodes[1]).toBe(child2);
                expect(element.childNodes[2]).toBe(child1);
                expect(connectedCallback).toHaveBeenCalledTimes(3);
                // change nothing
                element.insertBefore(child2, child1);
                expect(element.slotChildNodes[0]).toBe(child3);
                expect(element.slotChildNodes[1]).toBe(child2);
                expect(element.slotChildNodes[2]).toBe(child1);
                expect(element.childNodes[0]).toBe(child3);
                expect(element.childNodes[1]).toBe(child2);
                expect(element.childNodes[2]).toBe(child1);
                expect(element.slotChildNodes).toHaveLength(3);
                // move up
                element.insertBefore(child1, child2);
                expect(element.slotChildNodes[0]).toBe(child3);
                expect(element.slotChildNodes[1]).toBe(child1);
                expect(element.slotChildNodes[2]).toBe(child2);
                expect(element.childNodes[0]).toBe(child3);
                expect(element.childNodes[1]).toBe(child1);
                expect(element.childNodes[2]).toBe(child2);
                // move up
                element.insertBefore(child1, child3);
                expect(element.slotChildNodes[0]).toBe(child1);
                expect(element.slotChildNodes[1]).toBe(child3);
                expect(element.slotChildNodes[2]).toBe(child2);
                expect(element.childNodes[0]).toBe(child1);
                expect(element.childNodes[1]).toBe(child3);
                expect(element.childNodes[2]).toBe(child2);
            });

            it('should insert and connect a child (and remove it from the previous parent) before another', () => {
                const connectedCallback = vi.fn();
                const disconnectedCallback = vi.fn();
                const TestElement = DNA.define('test-component-59', class extends DNA.Component {});
                const TestChild = DNA.define(
                    'test-component-60',
                    class extends DNA.Component {
                        connectedCallback() {
                            super.connectedCallback();
                            connectedCallback();
                        }
                        disconnectedCallback() {
                            super.disconnectedCallback();
                            disconnectedCallback();
                        }
                    }
                );
                const element = new TestElement();
                const child1 = new TestChild();
                const child2 = new TestChild();

                expect(connectedCallback).not.toHaveBeenCalled();
                expect(disconnectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(element);
                wrapper.appendChild(child2);
                element.appendChild(child1);
                element.insertBefore(child2, child1);
                expect(connectedCallback).toHaveBeenCalledTimes(3);
                expect(disconnectedCallback).toHaveBeenCalledOnce();
            });

            it('should insert slot item', () => {
                const TestElement = DNA.define(
                    'test-component-61',
                    class extends DNA.Component {
                        render() {
                            return (
                                <div>
                                    <slot />
                                </div>
                            );
                        }
                    }
                );
                const element = wrapper.appendChild(new TestElement());
                const span = element.appendChild(document.createElement('span'));
                const input = document.createElement('input');
                element.insertBefore(input, span);
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'INPUT');
                expect(element.childNodes[0].childNodes[1]).toHaveProperty('tagName', 'SPAN');
            });
        });

        describe('#replaceChild', () => {
            it('should reaplce and connect child in a parent', () => {
                const connectedCallback = vi.fn();
                const disconnectedCallback = vi.fn();
                const TestElement = DNA.define('test-component-62', class extends DNA.Component {});
                const TestChild = DNA.define(
                    'test-component-63',
                    class extends DNA.Component {
                        connectedCallback() {
                            super.connectedCallback();
                            connectedCallback();
                        }
                        disconnectedCallback() {
                            super.disconnectedCallback();
                            disconnectedCallback();
                        }
                    }
                );
                const element = new TestElement();
                const child1 = new TestChild();
                const child2 = new TestChild();

                expect(connectedCallback).not.toHaveBeenCalled();
                expect(disconnectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(element);
                element.appendChild(child1);
                element.replaceChild(child2, child1);
                expect(connectedCallback).toHaveBeenCalledTimes(2);
                expect(disconnectedCallback).toHaveBeenCalledOnce();
            });

            it('should reaplce and connect a child (and remove it from the previous parent) in a parent', () => {
                const connectedCallback = vi.fn();
                const disconnectedCallback = vi.fn();
                const TestElement = DNA.define('test-component-64', class extends DNA.Component {});
                const TestChild = DNA.define(
                    'test-component-65',
                    class extends DNA.Component {
                        connectedCallback() {
                            super.connectedCallback();
                            connectedCallback();
                        }
                        disconnectedCallback() {
                            super.disconnectedCallback();
                            disconnectedCallback();
                        }
                    }
                );
                const element = new TestElement();
                const child1 = new TestChild();
                const child2 = new TestChild();

                expect(connectedCallback).not.toHaveBeenCalled();
                expect(disconnectedCallback).not.toHaveBeenCalled();

                wrapper.appendChild(element);
                wrapper.appendChild(child2);
                element.appendChild(child1);
                element.replaceChild(child2, child1);
                expect(connectedCallback).toHaveBeenCalledTimes(3);
                expect(disconnectedCallback).toHaveBeenCalledTimes(2);
            });

            it('should replace slot item', () => {
                const TestElement = DNA.define(
                    'test-component-66',
                    class extends DNA.Component {
                        render() {
                            return (
                                <div>
                                    <slot />
                                </div>
                            );
                        }
                    }
                );
                const element = new TestElement();
                const span = document.createElement('span');
                const input = document.createElement('input');
                wrapper.appendChild(element);
                element.appendChild(span);
                element.replaceChild(input, span);
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'INPUT');
            });
        });

        describe('#insertAdjacentElement', () => {
            it('should insert and connect a child at first position', () => {
                const connectedCallback = vi.fn();
                const TestElement = DNA.define('test-component-67', class extends DNA.Component {});
                const TestChild = DNA.define(
                    'test-component-68',
                    class extends DNA.Component {
                        connectedCallback() {
                            super.connectedCallback();
                            connectedCallback();
                        }
                    }
                );
                const element = new TestElement();
                const child1 = new TestChild();
                const child2 = new TestChild();

                expect(connectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(element);
                element.appendChild(child1);
                element.insertAdjacentElement('afterbegin', child2);
                expect(connectedCallback).toHaveBeenCalledTimes(2);
                element.insertBefore(child2, child1);
                expect(element.slotChildNodes).toHaveLength(2);
            });

            it('should insert and connect a child (and remove it from the previous parent) at last position', () => {
                const connectedCallback = vi.fn();
                const disconnectedCallback = vi.fn();
                const TestElement = DNA.define('test-component-69', class extends DNA.Component {});
                const TestChild = DNA.define(
                    'test-component-70',
                    class extends DNA.Component {
                        connectedCallback() {
                            super.connectedCallback();
                            connectedCallback();
                        }
                        disconnectedCallback() {
                            super.disconnectedCallback();
                            disconnectedCallback();
                        }
                    }
                );
                const element = new TestElement();
                const child1 = new TestChild();
                const child2 = new TestChild();

                expect(connectedCallback).not.toHaveBeenCalled();
                expect(disconnectedCallback).not.toHaveBeenCalled();
                wrapper.appendChild(element);
                wrapper.appendChild(child2);
                element.appendChild(child1);
                element.insertAdjacentElement('beforeend', child2);
                expect(connectedCallback).toHaveBeenCalledTimes(3);
                expect(disconnectedCallback).toHaveBeenCalledOnce();
            });

            it('should insert slot item', () => {
                const TestElement = DNA.define(
                    'test-component-71',
                    class extends DNA.Component {
                        render() {
                            return (
                                <div>
                                    <slot />
                                </div>
                            );
                        }
                    }
                );
                const element = new TestElement();
                const span = document.createElement('span');
                const input = document.createElement('input');
                wrapper.appendChild(element);
                element.appendChild(span);
                element.insertAdjacentElement('afterbegin', input);
                expect(element.childNodes).toHaveLength(1);
                expect(element.childNodes[0]).toHaveProperty('tagName', 'DIV');
                expect(element.childNodes[0].childNodes[0]).toHaveProperty('tagName', 'INPUT');
                expect(element.childNodes[0].childNodes[1]).toHaveProperty('tagName', 'SPAN');
            });
        });

        describe('attributes', () => {
            @DNA.customElement('test-component-72')
            class TestElement extends DNA.Component {
                static get properties() {
                    return {
                        age: {
                            type: [Number],
                        },
                    };
                }

                declare age: number;

                @DNA.property()
                title = '';

                @DNA.property({ attribute: 'alias' })
                test = '';
            }

            let element: TestElement;
            beforeEach(() => {
                element = new TestElement();
                element.title = 'DNA';
                element.age = 42;
            });

            describe('#getAttribute', () => {
                it('should get an empty attribute', () => {
                    expect(element.getAttribute('missing')).toBeNull();
                });

                it('should get a string attribute', () => {
                    expect(element.getAttribute('title')).toBe('DNA');
                });

                it('should get a numeric attribute', () => {
                    expect(element.getAttribute('age')).toBe('42');
                });
            });

            describe('#setAttribute', () => {
                it('should set an attribute', () => {
                    element.setAttribute('missing', 'DNA');
                    expect(element.getAttribute('missing')).toBe('DNA');
                });

                it('should set a string attribute and update the property', () => {
                    element.setAttribute('title', 'WebComponents');
                    expect(element.title).toBe('WebComponents');
                });

                it('should set a string attribute and update the aliased property', () => {
                    element.setAttribute('alias', 'WebComponents');
                    expect(element.test).toBe('WebComponents');
                });
            });

            describe('#hasAttribute', () => {
                it('should return `true` if element has an attribute', () => {
                    expect(element.hasAttribute('title')).toBe(true);
                });

                it('should return `false` if element has an attribute', () => {
                    expect(element.hasAttribute('missing')).toBe(false);
                });
            });

            describe('#removeAttribute', () => {
                it('should remove an attribute', () => {
                    element.removeAttribute('title');
                    expect(element.hasAttribute('title')).toBe(false);
                });

                it('should remove a string attribute and update the property', () => {
                    element.removeAttribute('title');
                    expect(element.title).toBeNull();
                });

                it('should remove a numeric attribute and update the property', () => {
                    element.removeAttribute('age');
                    expect(element.age).toBeNull();
                });
            });
        });
    },
    10 * 1000
);
