import _decorate from '@babel/runtime/helpers/decorate';
import * as DNA from '@chialab/dna';
import { __decorate } from 'tslib';
import { describe, expect, it, vi } from 'vitest';
import { getComponentName } from './helpers.js';

describe(
    'property',
    () => {
        describe('@property', () => {
            it('should define a property', () => {
                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = undefined;
                    }
                };

                __decorate([DNA.property()], MyElement.prototype, 'testProp', undefined);
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

                expect(new MyElement()).toHaveProperty('testProp', undefined);
            });

            it('should update component on a property change', () => {
                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = 42;
                    }

                    render() {
                        return this.testProp;
                    }
                };

                __decorate([DNA.property()], MyElement.prototype, 'testProp', undefined);
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

                const elem = new MyElement();
                document.body.appendChild(elem);
                expect(elem.textContent).toBe('42');
                elem.testProp = 84;
                expect(elem.textContent).toBe('84');
                document.body.removeChild(elem);
            });

            it('should not update component on a property change if not requested', () => {
                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = 42;
                    }

                    render() {
                        return this.testProp;
                    }
                };

                __decorate([DNA.property({ update: false })], MyElement.prototype, 'testProp', undefined);
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

                const elem = new MyElement();
                document.body.appendChild(elem);
                expect(elem.textContent).toBe('42');
                elem.testProp = 84;
                expect(elem.textContent).toBe('42');
                document.body.removeChild(elem);
            });

            it('should define a property with a defaultValue', () => {
                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = 42;
                    }
                };

                __decorate([DNA.property()], MyElement.prototype, 'testProp', undefined);
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 42);
            });

            it('should define a property with single type checker', () => {
                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = undefined;
                    }
                };

                __decorate(
                    [
                        DNA.property({
                            type: String,
                        }),
                    ],
                    MyElement.prototype,
                    'testProp',
                    undefined
                );
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

                const elem = new MyElement();
                expect(() => (elem.testProp = 42)).toThrow(TypeError);
            });

            it('should define a property with multiple type checkers', () => {
                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = undefined;
                    }
                };

                __decorate(
                    [
                        DNA.property({
                            type: [String, Boolean],
                        }),
                    ],
                    MyElement.prototype,
                    'testProp',
                    undefined
                );
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

                const elem = new MyElement();
                elem.testProp = 'string';
                expect(elem).toHaveProperty('testProp', 'string');

                elem.testProp = true;
                expect(elem).toHaveProperty('testProp', true);

                expect(() => (elem.testProp = 42)).toThrow(TypeError);
            });

            it('should define a property with custom validation', () => {
                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = undefined;
                    }
                };

                __decorate(
                    [
                        DNA.property({
                            type: [String, Boolean],
                            validate(value) {
                                if (typeof value === 'string') {
                                    return value !== 'invalid';
                                }

                                return true;
                            },
                        }),
                    ],
                    MyElement.prototype,
                    'testProp',
                    undefined
                );
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

                const elem = new MyElement();
                elem.testProp = 'string';
                expect(elem).toHaveProperty('testProp', 'string');

                elem.testProp = true;
                expect(elem).toHaveProperty('testProp', true);

                expect(() => (elem.testProp = 42)).toThrow(TypeError);
                expect(() => (elem.testProp = 'invalid')).toThrow(TypeError);
            });

            it('should define a property with custom getter', () => {
                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = 42;
                    }
                };

                __decorate(
                    [
                        DNA.property({
                            getter(value) {
                                return value * 2;
                            },
                        }),
                    ],
                    MyElement.prototype,
                    'testProp',
                    undefined
                );
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 84);

                elem.testProp = 2;
                expect(elem).toHaveProperty('testProp', 4);
            });

            it('should define a property with custom setter', () => {
                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = 42;
                    }
                };

                __decorate(
                    [
                        DNA.property({
                            attribute: false,
                            setter(value) {
                                return value / 2;
                            },
                        }),
                    ],
                    MyElement.prototype,
                    'testProp',
                    undefined
                );
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 42);

                elem.testProp = 2;
                expect(elem).toHaveProperty('testProp', 1);
            });

            it('should define a property with decorated accessor', () => {
                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = 42;
                    }

                    get testProp() {
                        return this.getInnerPropertyValue('testProp') * 2;
                    }

                    set testProp(value) {
                        this.setInnerPropertyValue('testProp', value);
                    }
                };

                __decorate([DNA.property()], MyElement.prototype, 'testProp', undefined);
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 84);

                elem.testProp = 2;
                expect(elem).toHaveProperty('testProp', 4);
            });

            it('should define a property with a single observer', () => {
                const listener = vi.fn();

                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = 42;
                    }
                };

                __decorate(
                    [
                        DNA.property({
                            observe: listener,
                        }),
                    ],
                    MyElement.prototype,
                    'testProp',
                    undefined
                );
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

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

                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = 42;
                    }

                    listener(...args) {
                        listener(...args);
                    }
                };

                __decorate([DNA.property()], MyElement.prototype, 'testProp', undefined);
                __decorate([DNA.observe('testProp')], MyElement.prototype, 'listener', undefined);
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

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

                let MyParent = class MyParent extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = 42;
                    }

                    listener(...args) {
                        listener(...args);
                    }
                };

                MyParent = __decorate([DNA.customElement(getComponentName())], MyParent);
                __decorate([DNA.property()], MyParent.prototype, 'testProp', undefined);
                __decorate([DNA.observe('testProp')], MyParent.prototype, 'listener', undefined);

                let MyElement = class MyElement extends MyParent {
                    listener2(...args) {
                        listener2(...args);
                    }
                };

                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);
                __decorate([DNA.observe('testProp')], MyElement.prototype, 'listener2', undefined);

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
                            constructor(...args) {
                                super(...args);

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

                let MyElement = class MyElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.testProp = 42;
                    }
                };

                __decorate(
                    [
                        DNA.property({
                            observers: [listener1, listener2],
                        }),
                    ],
                    MyElement.prototype,
                    'testProp',
                    undefined
                );
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

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
        });

        describe('properties getter', () => {
            it('should define a property', () => {
                const MyElement = class extends DNA.Component {
                    static get properties() {
                        return {
                            testProp: String,
                        };
                    }
                };

                DNA.define(getComponentName(), MyElement);

                expect(new MyElement()).toHaveProperty('testProp', undefined);
            });

            it('should define a property with a defaultValue', () => {
                const MyElement = class extends DNA.Component {
                    static get properties() {
                        return {
                            testProp: {
                                defaultValue: 42,
                            },
                        };
                    }
                };

                DNA.define(getComponentName(), MyElement);

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 42);
            });

            it('should define a property with single type checker', () => {
                const MyElement = class extends DNA.Component {
                    static get properties() {
                        return {
                            testProp: {
                                type: String,
                            },
                        };
                    }
                };

                DNA.define(getComponentName(), MyElement);

                const elem = new MyElement();
                expect(() => (elem.testProp = 42)).toThrow(TypeError);
            });

            it('should define a property with multiple type checkers', () => {
                const MyElement = class extends DNA.Component {
                    static get properties() {
                        return {
                            testProp: {
                                type: [String, Boolean],
                            },
                        };
                    }
                };

                DNA.define(getComponentName(), MyElement);

                const elem = new MyElement();
                elem.testProp = 'string';
                expect(elem).toHaveProperty('testProp', 'string');

                elem.testProp = true;
                expect(elem).toHaveProperty('testProp', true);

                expect(() => (elem.testProp = 42)).toThrow(TypeError);
            });

            it('should define a property with custom validation', () => {
                const MyElement = class extends DNA.Component {
                    static get properties() {
                        return {
                            testProp: {
                                type: [String, Boolean],
                                validate(value) {
                                    if (typeof value === 'string') {
                                        return value !== 'invalid';
                                    }

                                    return true;
                                },
                            },
                        };
                    }
                };

                DNA.define(getComponentName(), MyElement);

                const elem = new MyElement();
                elem.testProp = 'string';
                expect(elem).toHaveProperty('testProp', 'string');

                elem.testProp = true;
                expect(elem).toHaveProperty('testProp', true);

                expect(() => (elem.testProp = 42)).toThrow(TypeError);
                expect(() => (elem.testProp = 'invalid')).toThrow(TypeError);
            });

            it('should define a property with custom getter', () => {
                const MyElement = class extends DNA.Component {
                    static get properties() {
                        return {
                            testProp: {
                                defaultValue: 42,
                                getter(value) {
                                    return value * 2;
                                },
                            },
                        };
                    }
                };

                DNA.define(getComponentName(), MyElement);

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 84);

                elem.testProp = 2;
                expect(elem).toHaveProperty('testProp', 4);
            });

            it('should define a property with custom setter', () => {
                const MyElement = class extends DNA.Component {
                    static get properties() {
                        return {
                            testProp: {
                                attribute: false,
                                defaultValue: 42,
                                setter(value) {
                                    return value / 2;
                                },
                            },
                        };
                    }
                };

                DNA.define(getComponentName(), MyElement);

                const elem = new MyElement();
                expect(elem).toHaveProperty('testProp', 42);

                elem.testProp = 2;
                expect(elem).toHaveProperty('testProp', 1);
            });

            it('should define a property with a single observer', () => {
                const listener = vi.fn();

                const MyElement = class extends DNA.Component {
                    static get properties() {
                        return {
                            testProp: {
                                defaultValue: 42,
                                observe: listener,
                            },
                        };
                    }
                };
                DNA.define(getComponentName(), MyElement);

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

                const MyElement = class extends DNA.Component {
                    static get properties() {
                        return {
                            testProp: {
                                defaultValue: 42,
                                observers: [listener1, listener2],
                            },
                        };
                    }
                };
                DNA.define(getComponentName(), MyElement);

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
                    static get properties() {
                        return {
                            inherit: String,
                            override: {
                                defaultValue: 42,
                            },
                        };
                    }
                }

                class MyElement extends BaseElement {
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
                }
                DNA.define(getComponentName(), MyElement);

                class MyElement2 extends BaseElement {
                    static get properties() {
                        return {
                            newProp: {
                                defaultValue: false,
                            },
                        };
                    }
                }
                DNA.define(getComponentName(), MyElement2);

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
                const BaseElement = class BaseElement extends DNA.Component {
                    constructor(...args) {
                        super(...args);
                        this.override = 42;
                    }
                };

                __decorate(
                    [
                        DNA.property({
                            type: String,
                        }),
                    ],
                    BaseElement.prototype,
                    'inherit',
                    undefined
                );
                __decorate([DNA.property()], BaseElement.prototype, 'override', undefined);

                let MyElement = class MyElement extends BaseElement {
                    constructor(...args) {
                        super(...args);
                        this.override = 84;
                        this.newProp = true;
                    }
                };

                __decorate([DNA.property()], MyElement.prototype, 'override', undefined);
                __decorate([DNA.property()], MyElement.prototype, 'newProp', undefined);
                MyElement = __decorate([DNA.customElement(getComponentName())], MyElement);

                let MyElement2 = class MyElement2 extends BaseElement {
                    constructor(...args) {
                        super(...args);
                        this.newProp = false;
                    }
                };

                __decorate([DNA.property()], MyElement2.prototype, 'newProp', undefined);
                MyElement2 = __decorate([DNA.customElement(getComponentName())], MyElement2);

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

                const MyElement = class extends DNA.Component {
                    static get properties() {
                        return {
                            testProp: {
                                defaultValue: 42,
                            },
                        };
                    }
                };
                DNA.define(getComponentName(), MyElement);

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

                const MyElement = class extends DNA.Component {};
                DNA.define(getComponentName(), MyElement);

                const element = new MyElement();
                expect(() => element.observe('testProp', listener)).toThrow(Error, 'Missing property testProp');
            });
        });

        describe('#unobserve', () => {
            it('should unobserve property changes', () => {
                const listener = vi.fn();

                const MyElement = class extends DNA.Component {
                    static get properties() {
                        return {
                            testProp: {
                                defaultValue: 42,
                            },
                        };
                    }
                };
                DNA.define(getComponentName(), MyElement);

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

                const MyElement = class extends DNA.Component {};
                DNA.define(getComponentName(), MyElement);

                const element = new MyElement();
                expect(() => element.unobserve('testProp', listener)).toThrow(Error, 'Missing property testProp');
            });
        });
    },
    10 * 1000
);
