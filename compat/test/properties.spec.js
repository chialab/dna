import { prop, define, render, DOM, BaseComponent } from '@chialab/dna/compat';
import { getComponentName } from '../../test/helpers.js';

describe('Compat', () => {
    let wrapper, TestComponent1, TestComponent2;

    describe('Properties', () => {
        before(() => {
            DOM.lifeCycle(true);
            wrapper = DOM.createElement('div');
            wrapper.ownerDocument.body.appendChild(wrapper);

            class TestComponent extends BaseComponent {
                get properties() {
                    return {
                        name: prop.STRING.attribute(),
                        title: prop.STRING.attribute(),
                    };
                }
            }

            TestComponent1 = class TestComponent1 extends TestComponent {
                static get observedAttributes() {
                    return ['name', 'last-name', 'married', 'age', 'var', 'validbool'];
                }

                get properties() {
                    return {
                        lastName: prop.STRING.attribute('last-name'),
                        married: prop.BOOLEAN,
                        age: prop.NUMBER
                            .validate((val) => val >= 0)
                            .attribute()
                            .observe('onAgeChanged'),
                        var: prop.STRING.attribute(),
                        type: prop.NUMBER.default(2),
                        validbool: prop.BOOLEAN.attribute('validbool'),
                    };
                }

                constructor(...args) {
                    super(...args);
                    this.ageChanged = 0;
                }

                onAgeChanged() {
                    this.ageChanged += 1;
                }
            };

            TestComponent2 = class TestComponent2 extends TestComponent {
                static get observedAttributes() {
                    return ['title', 'id', 'alt', 'var', 'mine', 'my-var', 'my-let', 'my-const'];
                }

                get properties() {
                    return {
                        id: prop.STRING.attribute(),
                        alt: prop.STRING.attribute(),
                        var: prop.NUMBER.attribute(),
                        mine: prop.NUMBER.attribute(),
                        myVar: prop.BOOLEAN.attribute('my-var'),
                        myVar2: prop.BOOLEAN.attribute('my-let'),
                        myVar3: prop.ANY
                            .default(false)
                            .attribute('my-const')
                            .getter(this.handleProp)
                            .setter((val) => !!val)
                            .dispatch('changed'),
                    };
                }

                handleProp(val) {
                    if (val) {
                        return 'DNA Test';
                    }
                    return false;
                }
            };

            define(getComponentName(), TestComponent1);
            define(getComponentName(), TestComponent2);
        });

        describe('handle property validation', () => {
            let elem;
            before(() => {
                elem = render(wrapper, TestComponent1);
            });

            it('should throw if invalid type', () => {
                let fn = () => elem.age = 'Hello';
                assert.throws(fn, 'Invalid `Hello` value for `age` property');
            });

            it('should throw if invalid value', () => {
                let fn = () => elem.age = -1;
                assert.throws(fn, 'Invalid `-1` value for `age` property');
            });

            it('should accept null/undefined values', () => {
                elem.age = 51;
                assert.equal(elem.age, 51);
                elem.age = null;
                assert.equal(elem.age, null);
                elem.age = undefined;
                assert.equal(elem.age, undefined);
            });

            it('should accept string value as boolean when string equals property name or empty string', () => {
                DOM.setAttribute(elem, 'validbool', 'validbool');
                assert.equal(elem.validbool, true);
            });
        });

        describe('handle properties on initialization', () => {
            it('init element\'s properties', () => {
                let elem = render(wrapper, TestComponent1, {
                    name: 'Alan',
                    lastName: 'Turing',
                    var: '1234',
                    married: true,
                });
                assert.equal(elem.name, 'Alan');
                assert.equal(elem.lastName, 'Turing');
                assert.equal(elem.married, true);
                assert.equal(elem.var, '1234');
                assert.equal(elem.type, 2);
            });

            it('observe property changes', () => {
                let elem = render(wrapper, TestComponent1, {
                    name: 'Alan',
                    lastName: 'Turing',
                    var: '1234',
                    married: true,
                });
                let changedSingle = 0;
                let callback = () => {
                    changedSingle++;
                    elem.unobserveProperty('age', callback);
                };
                elem.observeProperty('age', callback);
                elem.age = 41;
                elem.age = 51;
                assert.equal(elem.age, 51);
                assert.equal(elem.ageChanged, 2);
                assert.equal(changedSingle, 1);
            });
        });

        describe('handle props 2 attrs', () => {
            let elem;
            before(() => {
                elem = render(wrapper, TestComponent2);
            });

            it('check sync between property and attribute', () => {
                elem.title = 'DNA Test';
                assert.equal(elem.node.getAttribute('title'), 'DNA Test');
            });

            it('check sync between custom property and attribute', () => {
                elem.var = 1234;
                elem.id = 'dna-test';
                assert.equal(elem.node.getAttribute('var'), '1234');
                assert.equal(elem.node.getAttribute('id'), 'dna-test');
            });

            it('check sync between custom computed property and attribute', () => {
                elem.myVar = true;
                assert.equal(elem.node.getAttribute('my-var'), '');
                elem.myVar = false;
                assert.equal(elem.node.getAttribute('my-var'), null);
            });

            it.skip('check sync between custom computed property with setter and attribute', () => {
                elem.myVar3 = true;
                assert.equal(elem.node.getAttribute('my-const'), 'DNA Test');
            });

            it('dispatch event', () => {
                let triggered = 0;
                elem.node.addEventListener('changed', (ev) => {
                    let data = ev.detail;
                    if (data.component === elem &&
                        data.property === 'myVar3' &&
                        data.oldValue === true &&
                        data.newValue === false) {
                        triggered++;
                    }
                });
                elem.myVar3 = true;
                elem.myVar3 = false;
                assert.equal(triggered, 1);
            });
        });

        describe('handle attrs 2 props', () => {
            let elem;
            before(() => {
                elem = render(wrapper, TestComponent2);
                DOM.setAttribute(elem, 'alt', 'DNA Test 2');
                DOM.setAttribute(elem, 'mine', '1234');
                DOM.setAttribute(elem, 'my-let', '');
            });

            it('check sync between attribute and property', () => {
                assert.equal(elem.node.getAttribute('alt'), 'DNA Test 2');
                assert.equal(elem.alt, 'DNA Test 2');
            });

            it('check sync between custom attribute and property', () => {
                assert.equal(elem.node.getAttribute('mine'), 1234);
                assert.equal(elem.mine, 1234);
            });

            it('check sync between custom computed attribute and property', () => {
                assert.equal(elem.node.getAttribute('my-let'), '');
                assert.equal(elem.myVar2, true);
            });
        });

        describe('handle attrs 2 props on initialization', () => {
            let elem;
            before(() => {
                elem = new TestComponent2();
                elem.node.setAttribute('alt', 'DNA Test 2');
                elem.node.setAttribute('mine', '1234');
                elem.node.setAttribute('my-let', '');
                DOM.appendChild(wrapper, elem);
            });

            it('check sync between attribute and property', () => {
                assert.equal(elem.node.getAttribute('alt'), 'DNA Test 2');
                assert.equal(elem.alt, 'DNA Test 2');
            });

            it('check sync between custom attribute and property', () => {
                assert.equal(elem.node.getAttribute('mine'), 1234);
                assert.equal(elem.mine, 1234);
            });

            it('check sync between custom computed attribute and property', () => {
                assert.equal(elem.node.getAttribute('my-let'), '');
                assert.equal(elem.myVar2, true);
            });
        });
    });
});
