import _decorate from '@babel/runtime/helpers/decorate';
import * as DNA from '@chialab/dna';
import { describe, expect, it, vi } from 'vitest';
import { IS_BROWSER, getComponentName } from './helpers';

describe.runIf(IS_BROWSER)(
    'property',
    () => {
        describe('@property', () => {
            it('should define a property', () => {
                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property()
                    testProp?: number;
                }

                expect(new MyElement()).toHaveProperty('testProp', undefined);
            });

            it('should update component on a property change', () => {
                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property()
                    testProp = 42;

                    render() {
                        return this.testProp;
                    }
                }

                const elem = new MyElement();
                document.body.appendChild(elem);
                expect(elem.textContent).toBe('42');
                elem.testProp = 84;
                expect(elem.textContent).toBe('84');
                document.body.removeChild(elem);
            });

            it('should not update component on a property change if not requested', () => {
                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property({ update: false })
                    testProp = 42;

                    render() {
                        return this.testProp;
                    }
                }

                const elem = new MyElement();
                document.body.appendChild(elem);
                expect(elem.textContent).toBe('42');
                elem.testProp = 84;
                expect(elem.textContent).toBe('42');
                document.body.removeChild(elem);
            });

            it('should define a property with a defaultValue', () => {
                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property()
                    testProp = 42;
                }

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 42);
            });

            it('should define a property with single type checker', () => {
                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property({
                        type: String,
                    })
                    testProp?: string;
                }

                const elem = new MyElement();
                expect(() => {
                    // @ts-expect-error We are checking the type validation
                    elem.testProp = 42;
                }).toThrow(TypeError);
            });

            it('should define a property with multiple type checkers', () => {
                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property({
                        type: [String, Boolean],
                    })
                    testProp?: string | boolean;
                }

                const elem = new MyElement();
                elem.testProp = 'string';
                expect(elem).toHaveProperty('testProp', 'string');

                elem.testProp = true;
                expect(elem).toHaveProperty('testProp', true);

                expect(() => {
                    // @ts-expect-error We are checking the type validation
                    elem.testProp = 42;
                }).toThrow(TypeError);
            });

            it('should define a property with custom validation', () => {
                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property({
                        type: [String, Boolean],
                        validate(value) {
                            if (typeof value === 'string') {
                                return value !== 'invalid';
                            }

                            return true;
                        },
                    })
                    testProp?: string | boolean;
                }

                const elem = new MyElement();
                elem.testProp = 'string';
                expect(elem).toHaveProperty('testProp', 'string');

                elem.testProp = true;
                expect(elem).toHaveProperty('testProp', true);

                expect(() => {
                    // @ts-expect-error We are checking the type validation
                    elem.testProp = 42;
                }).toThrow(TypeError);
                expect(() => {
                    elem.testProp = 'invalid';
                }).toThrow(TypeError);
            });

            it('should define a property with custom getter', () => {
                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property({
                        getter(value) {
                            return (value as number) * 2;
                        },
                    })
                    testProp = 42;
                }

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 84);

                elem.testProp = 2;
                expect(elem).toHaveProperty('testProp', 4);
            });

            it('should define a property with custom setter', () => {
                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property({
                        attribute: false,
                        setter(value) {
                            return value / 2;
                        },
                    })
                    testProp = 42;
                }

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 42);

                elem.testProp = 2;
                expect(elem).toHaveProperty('testProp', 1);
            });

            it('should define a property with decorated accessor', () => {
                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property()
                    get testProp(): number {
                        return this.getInnerPropertyValue('testProp') * 2;
                    }
                    set testProp(value) {
                        this.setInnerPropertyValue('testProp', value);
                    }

                    constructor(node?: HTMLElement) {
                        super(node);
                        this.testProp = 42;
                    }
                }

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 84);

                elem.testProp = 2;
                expect(elem).toHaveProperty('testProp', 4);
            });

            it('should define a property with a single observer', () => {
                const listener = vi.fn();

                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property({
                        observe: listener,
                    })
                    testProp = 42;
                }

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 42);
                expect(listener).not.toHaveBeenCalled();

                elem.testProp = 84;
                expect(elem).toHaveProperty('testProp', 84);
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledWith(42, 84, 'testProp');
            });

            it('should define a property with observe decorator', () => {
                const listener = vi.fn();

                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property()
                    testProp = 42;

                    @DNA.observe('testProp')
                    listener(oldValue?: number, newValue?: number, propName?: string) {
                        listener(oldValue, newValue, propName);
                    }
                }

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 42);
                expect(listener).not.toHaveBeenCalled();

                elem.testProp = 84;
                expect(elem).toHaveProperty('testProp', 84);
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledWith(42, 84, 'testProp');
            });

            it('should not merge observe decorators', () => {
                const listener = vi.fn();
                const listener2 = vi.fn();

                @DNA.customElement(getComponentName())
                class MyParent extends DNA.Component {
                    @DNA.property()
                    testProp = 42;

                    @DNA.observe('testProp')
                    listener(oldValue?: number, newValue?: number) {
                        listener(oldValue, newValue);
                    }
                }

                @DNA.customElement(getComponentName())
                class MyElement extends MyParent {
                    @DNA.observe('testProp')
                    listener2(oldValue?: number, newValue?: number) {
                        listener2(oldValue, newValue);
                    }
                }

                const parent = new MyParent();
                parent.testProp = 84;
                expect(parent).toHaveProperty('testProp', 84);
                expect(listener).toHaveBeenCalled();
                expect(listener2).not.toHaveBeenCalled();

                const elem = new MyElement();
                elem.testProp = 84;
                expect(elem).toHaveProperty('testProp', 84);
                expect(listener2).toHaveBeenCalled();
            });

            it('should define a property with observe decorator (babel)', () => {
                const listener = vi.fn();

                const MyElement = _decorate(
                    [DNA.customElement(getComponentName())],
                    (_initialize, _DNA$Component) => {
                        class MyElement extends _DNA$Component {
                            declare testProp?: number;

                            constructor(node?: HTMLElement) {
                                super(node);

                                _initialize(this);
                            }
                        }

                        return {
                            F: MyElement,
                            d: [
                                {
                                    kind: 'field',
                                    decorators: [DNA.property()],
                                    key: 'testProp',

                                    value() {
                                        return 42;
                                    },
                                },
                                {
                                    kind: 'method',
                                    decorators: [DNA.observe('testProp')],
                                    key: 'listener',
                                    value: listener,
                                },
                            ],
                        };
                    },
                    DNA.Component
                );

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 42);
                expect(listener).not.toHaveBeenCalled();

                elem.testProp = 84;
                expect(elem).toHaveProperty('testProp', 84);
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledWith(42, 84, 'testProp');
            });

            it('should define a property with multiple observers', () => {
                const listener1 = vi.fn();
                const listener2 = vi.fn();
                @DNA.customElement(getComponentName())
                class MyElement extends DNA.Component {
                    @DNA.property({
                        observers: [listener1, listener2],
                    })
                    testProp = 42;
                }

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 42);
                expect(listener1).not.toHaveBeenCalled();
                expect(listener2).not.toHaveBeenCalled();

                elem.testProp = 84;
                expect(elem).toHaveProperty('testProp', 84);
                expect(listener1).toHaveBeenCalled();
                expect(listener2).toHaveBeenCalled();
                expect(listener1).toHaveBeenCalledWith(42, 84, 'testProp');
                expect(listener2).toHaveBeenCalledWith(42, 84, 'testProp');
            });

            it('should restore a property after upgrade', () => {
                const tagName = getComponentName();
                const element = document.createElement(tagName) as InstanceType<typeof MyElement>;

                expect(element).not.toHaveProperty('testProp');
                expect(element.getAttribute('test-prop')).toBeNull();
                element.testProp = 84;
                expect(element.getAttribute('test-prop')).toBeNull();

                class MyElement extends DNA.Component {
                    @DNA.property({
                        attribute: 'test-prop',
                    })
                    testProp = 42;
                }
                expect(element).not.toBeInstanceOf(MyElement);
                DNA.define(tagName, MyElement);
                window.customElements.upgrade(element);

                expect(element).toBeInstanceOf(MyElement);
                expect(element).toHaveProperty('testProp', 84);
                expect(element.getAttribute('test-prop')).toBe('84');
            });

            it('should discard a getter property after upgrade', () => {
                const tagName = getComponentName();
                const element = document.createElement(tagName) as InstanceType<typeof MyElement>;

                expect(element).not.toHaveProperty('testProp');
                // @ts-expect-error testProp is not defined yet
                element.testProp = 84;

                class MyElement extends DNA.Component {
                    @DNA.property()
                    get testProp() {
                        return 42;
                    }
                }

                expect(element).not.toBeInstanceOf(MyElement);
                DNA.define(tagName, MyElement);
                window.customElements.upgrade(element);

                expect(element).toBeInstanceOf(MyElement);
                expect(element).toHaveProperty('testProp', 42);
            });
        });

        describe('properties getter', () => {
            it('should define a property', () => {
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get properties() {
                            return {
                                testProp: String,
                            };
                        }
                    }
                );

                expect(new MyElement()).toHaveProperty('testProp', undefined);
            });

            it('should define a property with a defaultValue', () => {
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get properties() {
                            return {
                                testProp: {
                                    defaultValue: 42,
                                },
                            };
                        }
                    }
                );

                expect(new MyElement()).toHaveProperty('testProp', 42);
            });

            it('should define a property with single type checker', () => {
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get properties() {
                            return {
                                testProp: {
                                    type: String,
                                },
                            };
                        }

                        declare testProp?: number;
                    }
                );

                expect(() => {
                    new MyElement().testProp = 42;
                }).toThrow(TypeError);
            });

            it('should define a property with multiple type checkers', () => {
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get properties() {
                            return {
                                testProp: {
                                    type: [String, Boolean],
                                },
                            };
                        }

                        declare testProp?: string | boolean;
                    }
                );
                const elem = new MyElement();

                elem.testProp = 'string';
                expect(elem).toHaveProperty('testProp', 'string');

                elem.testProp = true;
                expect(elem).toHaveProperty('testProp', true);
                expect(() => {
                    // @ts-expect-error We are checking the type validation
                    elem.testProp = 42;
                }).toThrow(TypeError);
            });

            it('should define a property with custom validation', () => {
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get properties() {
                            return {
                                testProp: {
                                    type: [String, Boolean],
                                    validate(value: unknown) {
                                        if (typeof value === 'string') {
                                            return value !== 'invalid';
                                        }

                                        return true;
                                    },
                                },
                            };
                        }

                        declare testProp?: string | boolean;
                    }
                );
                const elem = new MyElement();
                elem.testProp = 'string';

                expect(elem).toHaveProperty('testProp', 'string');

                elem.testProp = true;
                expect(elem).toHaveProperty('testProp', true);
                expect(() => {
                    // @ts-expect-error We are checking the type validation
                    elem.testProp = 42;
                }).toThrow(TypeError);
                expect(() => {
                    elem.testProp = 'invalid';
                }).toThrow(TypeError);
            });

            it('should define a property with custom getter', () => {
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get properties() {
                            return {
                                testProp: {
                                    defaultValue: 42,
                                    getter(value: unknown) {
                                        return (value as number) * 2;
                                    },
                                },
                            };
                        }

                        declare testProp?: number;
                    }
                );
                const elem = new MyElement();

                expect(elem).toHaveProperty('testProp', 84);

                elem.testProp = 2;
                expect(elem).toHaveProperty('testProp', 4);
            });

            it('should define a property with custom setter', () => {
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get properties() {
                            return {
                                testProp: {
                                    attribute: false,
                                    defaultValue: 42,
                                    setter(value: unknown) {
                                        return (value as number) / 2;
                                    },
                                },
                            };
                        }

                        declare testProp?: number;
                    }
                );
                const elem = new MyElement();

                expect(elem).toHaveProperty('testProp', 42);

                elem.testProp = 2;
                expect(elem).toHaveProperty('testProp', 1);
            });

            it('should define a property with a single observer', () => {
                const listener = vi.fn();
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get properties() {
                            return {
                                testProp: {
                                    defaultValue: 42,
                                    observe: listener,
                                },
                            };
                        }

                        declare testProp?: number;
                    }
                );
                const elem = new MyElement();

                expect(elem).toHaveProperty('testProp', 42);
                expect(listener).not.toHaveBeenCalled();

                elem.testProp = 84;
                expect(elem).toHaveProperty('testProp', 84);
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledWith(42, 84, 'testProp');
            });

            it('should define a property with multiple observers', () => {
                const listener1 = vi.fn();
                const listener2 = vi.fn();
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get properties() {
                            return {
                                testProp: {
                                    defaultValue: 42,
                                    observers: [listener1, listener2],
                                },
                            };
                        }

                        declare testProp?: number;
                    }
                );

                const elem = new MyElement();

                expect(elem).toHaveProperty('testProp', 42);
                expect(listener1).not.toHaveBeenCalled();
                expect(listener2).not.toHaveBeenCalled();

                elem.testProp = 84;
                expect(elem).toHaveProperty('testProp', 84);
                expect(listener1).toHaveBeenCalled();
                expect(listener2).toHaveBeenCalled();
                expect(listener1).toHaveBeenCalledWith(42, 84, 'testProp');
                expect(listener2).toHaveBeenCalledWith(42, 84, 'testProp');
            });

            it('should inherit and reduce the prototype chain', () => {
                class BaseElement extends DNA.Component {
                    static get properties(): Record<string, DNA.PropertyConfig> {
                        return {
                            inherit: String,
                            override: {
                                defaultValue: 42,
                            },
                        };
                    }

                    declare inherit?: string;
                    declare override?: number;
                }

                const MyElement = DNA.define(
                    getComponentName(),
                    class extends BaseElement {
                        static get properties() {
                            return {
                                override: {
                                    defaultValue: 84,
                                },
                                newProp: {
                                    defaultValue: true,
                                },
                            };
                        }

                        declare newProp?: boolean;
                    }
                );
                const MyElement2 = DNA.define(
                    getComponentName(),
                    class extends BaseElement {
                        static get properties() {
                            return {
                                newProp: {
                                    defaultValue: false,
                                },
                            };
                        }

                        declare newProp?: boolean;
                    }
                );

                const element = new MyElement();
                expect(element).toHaveProperty('inherit');
                expect(element).toHaveProperty('override', 84);
                expect(element).toHaveProperty('newProp', true);
                const element2 = new MyElement2();
                expect(element2).toHaveProperty('inherit');
                expect(element2).toHaveProperty('override', 42);
                expect(element2).toHaveProperty('newProp', false);
            });

            it('should inherit and reduce the prototype chain with decorator', () => {
                class BaseElement extends DNA.Component {
                    @DNA.property({
                        type: String,
                    })
                    inherit?: string;

                    @DNA.property()
                    override = 42;
                }

                @DNA.customElement(getComponentName())
                class MyElement extends BaseElement {
                    @DNA.property()
                    override = 84;

                    @DNA.property()
                    newProp = true;
                }

                @DNA.customElement(getComponentName())
                class MyElement2 extends BaseElement {
                    @DNA.property()
                    newProp = false;
                }

                const element = new MyElement();
                expect(element).toHaveProperty('inherit');
                expect(element).toHaveProperty('override', 84);
                expect(element).toHaveProperty('newProp', true);
                const element2 = new MyElement2();
                expect(element2).toHaveProperty('inherit');
                expect(element2).toHaveProperty('override', 42);
                expect(element2).toHaveProperty('newProp', false);
            });
        });

        describe('#observe', () => {
            it('should observe property changes', () => {
                const listener = vi.fn();
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get properties() {
                            return {
                                testProp: {
                                    defaultValue: 42,
                                },
                            };
                        }

                        declare testProp?: number;
                    }
                );
                const element = new MyElement();

                expect(listener).not.toHaveBeenCalled();
                element.testProp = 100;
                expect(listener).not.toHaveBeenCalled();
                element.observe('testProp', listener);
                element.testProp = 84;
                expect(listener).toHaveBeenCalled();
                expect(listener).toHaveBeenCalledWith(100, 84, 'testProp');
            });

            it('should throw for undeclared properties', () => {
                const listener = vi.fn();
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        declare testProp?: number;
                    }
                );
                const element = new MyElement();

                expect(() => element.observe('testProp', listener)).toThrow(new Error('Missing property testProp'));
            });
        });

        describe('#unobserve', () => {
            it('should unobserve property changes', () => {
                const listener = vi.fn();
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        static get properties() {
                            return {
                                testProp: {
                                    defaultValue: 42,
                                },
                            };
                        }

                        declare testProp?: number;
                    }
                );

                const element = new MyElement();
                expect(listener).not.toHaveBeenCalled();
                element.observe('testProp', listener);
                element.testProp = 84;
                expect(listener).toHaveBeenCalled();
                element.unobserve('testProp', listener);
                element.testProp = 150;
                expect(listener).toHaveBeenCalledOnce();
            });

            it('should throw for undeclared properties', () => {
                const listener = vi.fn();
                const MyElement = DNA.define(
                    getComponentName(),
                    class extends DNA.Component {
                        declare testProp?: number;
                    }
                );

                const element = new MyElement();
                expect(() => element.unobserve('testProp', listener)).toThrow(new Error('Missing property testProp'));
            });
        });
    },
    10 * 1000
);
