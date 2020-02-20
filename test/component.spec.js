import { getModule, spyFunction, getComponentName } from './helpers.js';

let DNA;

describe('Component', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    let wrapper;
    beforeEach(() => {
        wrapper = DNA.DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);
    });

    afterEach(() => {
        if (wrapper.parentNode) {
            wrapper.ownerDocument.body.removeChild(wrapper);
        }
    });

    describe('#new', () => {
        it('should create a node', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.define(is, TestElement);

            const element = new TestElement();
            expect(element).to.be.an.instanceof(DNA.DOM.get('HTMLElement'));
            expect(element.is).to.be.equal(is);
            expect(element.tagName).to.be.equal(is.toUpperCase());
        });

        it('should extend a native node', () => {
            const is = getComponentName();
            class TestElement extends DNA.Component { }
            DNA.define(is, TestElement, {
                extends: 'article',
            });

            const element = new TestElement();
            expect(element).to.be.an.instanceof(DNA.DOM.get('HTMLElement'));
            expect(element.is).to.be.equal(is);
            expect(element.tagName).to.be.equal('ARTICLE');
            expect(element.getAttribute('is')).to.be.equal(is);
        });

        it('should throw if element is not defined', () => {
            class TestElement extends DNA.Component { }
            expect(() => new TestElement()).to.throw(TypeError);
        });

        it('should setup properties', () => {
            class TestElement extends DNA.Component {
                get properties() {
                    return {
                        myCustomProp1: {
                            attribute: 'custom-prop',
                        },
                    };
                }

                @DNA.property() myCustomProp2 = '';
                @DNA.property() myCustomProp3 = '';
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();

            expect(element).to.have.property('myCustomProp1');
            expect(element).to.have.property('myCustomProp2');
            expect(element).to.have.property('myCustomProp3');
            expect(element).to.not.have.property('myCustomProp4');
        });

        it('should initialize properties', () => {
            class TestElement extends DNA.Component {
                get properties() {
                    return {
                        myCustomProp1: {
                            attribute: 'custom-prop',
                        },
                    };
                }

                @DNA.property() myCustomProp2 = 'test';
                @DNA.property() myCustomProp3 = '';
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement({
                myCustomProp1: 42,
                myCustomProp2: 'toast',
            });

            expect(element.myCustomProp1, 42);
            expect(element.myCustomProp2, 'toast');
        });

        it('should connect already connected nodes', () => {
            const is = getComponentName();
            let connected = false;
            class TestElement extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connected = true;
                }
            }

            wrapper.innerHTML = `<${is}></${is}>`;
            expect(connected).to.be.false;
            DNA.define(is, TestElement);
            DNA.upgrade(wrapper);
            expect(connected).to.be.true;
        });
    });

    describe('#connectedCallback|disconnectedCallback', () => {
        it('should connect on appendChild and disconnect on removeChild', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
            class TestElement extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            expect(connectedCallback.invoked).to.be.true;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.removeChild(wrapper, element);
            expect(disconnectedCallback.invoked).to.be.true;
        });

        it('should connect on replaceChild', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
            class TestElement extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }

                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            const child = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(wrapper, child);
            expect(disconnectedCallback.invoked).to.be.false;
            expect(connectedCallback.invoked).to.be.false;
            DNA.DOM.replaceChild(wrapper, element, child);
            expect(disconnectedCallback.invoked).to.be.false;
            expect(connectedCallback.invoked).to.be.true;
            DNA.DOM.replaceChild(wrapper, child, element);
            expect(disconnectedCallback.invoked).to.be.true;
            expect(connectedCallback.invoked).to.be.true;
            expect(disconnectedCallback.count).to.be.equal(1);
            expect(connectedCallback.count).to.be.equal(1);
        });

        it('should connect on insertBefore', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
            class TestElement extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }

                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            const child = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(wrapper, child);
            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.insertBefore(wrapper, element, child);
            expect(connectedCallback.invoked).to.be.true;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.insertBefore(wrapper, child, element);
            expect(connectedCallback.invoked).to.be.true;
            expect(connectedCallback.count).to.be.equal(1);
            expect(disconnectedCallback.invoked).to.be.false;
        });

        it('should connect if not moved', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
            class TestElement extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }

                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            expect(connectedCallback.invoked).to.be.true;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            expect(connectedCallback.count).to.be.equal(2);
            expect(disconnectedCallback.invoked).to.be.true;
        });

        it('should render on connect', () => {
            class TestElement extends DNA.Component {
                render() {
                    return DNA.html`<h1>test</h1>`;
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            expect(element.innerHTML).to.be.equal('');
            DNA.DOM.appendChild(wrapper, element);
            expect(element.innerHTML).to.be.equal('<h1>test</h1>');
        });
    });

    describe('#attributeChangedCallback', () => {
        it('should handle attribute changes on setAttribute', () => {
            const attributeChangedCallback = spyFunction((name, old, value) => [name, old, value]);
            class TestElement extends DNA.Component {
                static get observedAttributes() {
                    return ['title'];
                }

                attributeChangedCallback(...args) {
                    super.attributeChangedCallback(...args);
                    attributeChangedCallback(...args);
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            expect(attributeChangedCallback.invoked).to.be.false;
            element.setAttribute('title', 'test');
            expect(attributeChangedCallback.invoked).to.be.true;
            expect(attributeChangedCallback.response).to.be.deep.equal(['title', null, 'test']);
            element.setAttribute('title', 'test2');
            expect(attributeChangedCallback.response).to.be.deep.equal(['title', 'test', 'test2']);
        });

        it('should handle attribute changes on removeAttribute', () => {
            const attributeChangedCallback = spyFunction((name, old, value) => [name, old, value]);
            class TestElement extends DNA.Component {
                static get observedAttributes() {
                    return ['title'];
                }

                attributeChangedCallback(...args) {
                    super.attributeChangedCallback(...args);
                    attributeChangedCallback(...args);
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            expect(attributeChangedCallback.invoked).to.be.false;
            element.setAttribute('title', 'test');
            expect(attributeChangedCallback.invoked).to.be.true;
            expect(attributeChangedCallback.response).to.be.deep.equal(['title', null, 'test']);
            element.removeAttribute('title');
            expect(attributeChangedCallback.response).to.be.deep.equal(['title', 'test', null]);
        });

        it('should handle attribute if nothing changed on setAttribute', () => {
            const attributeChangedCallback = spyFunction((name, old, value) => [name, old, value]);
            class TestElement extends DNA.Component {
                static get observedAttributes() {
                    return ['title'];
                }

                attributeChangedCallback(...args) {
                    super.attributeChangedCallback(...args);
                    attributeChangedCallback(...args);
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            expect(attributeChangedCallback.invoked).to.be.false;
            element.setAttribute('title', 'test');
            expect(attributeChangedCallback.invoked).to.be.true;
            expect(attributeChangedCallback.response).to.be.deep.equal(['title', null, 'test']);
            element.setAttribute('title', 'test');
            expect(attributeChangedCallback.count).to.be.equal(2);
        });
    });

    describe('#propertyChangedCallback', () => {
        it('should handle property changes on assignment', () => {
            const propertyChangedCallback = spyFunction((name, old, value) => [name, old, value]);
            class TestElement extends DNA.Component {
                get properties() {
                    return {
                        age: {
                            types: [Number],
                        },
                    };
                }

                @DNA.property() title = '';

                propertyChangedCallback(...args) {
                    super.propertyChangedCallback(...args);
                    propertyChangedCallback(...args);
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            expect(propertyChangedCallback.invoked).to.be.false;
            element.title = 'test';
            expect(propertyChangedCallback.invoked).to.be.true;
            expect(propertyChangedCallback.response).to.be.deep.equal(['title', '', 'test']);
            element.title = 'test2';
            expect(propertyChangedCallback.response).to.be.deep.equal(['title', 'test', 'test2']);
            element.age = 42;
            expect(propertyChangedCallback.response).to.be.deep.equal(['age', undefined, 42]);
            element.setAttribute('title', 'test');
            expect(propertyChangedCallback.count).to.be.equal(3);
        });

        it('should NOT handle property changes on delete', () => {
            const propertyChangedCallback = spyFunction((name, old, value) => [name, old, value]);
            class TestElement extends DNA.Component {
                get properties() {
                    return {
                        age: {
                            types: [Number],
                        },
                    };
                }

                @DNA.property() title = '';

                propertyChangedCallback(...args) {
                    super.propertyChangedCallback(...args);
                    propertyChangedCallback(...args);
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            expect(propertyChangedCallback.invoked).to.be.false;
            element.title = 'test';
            expect(propertyChangedCallback.invoked).to.be.true;
            expect(propertyChangedCallback.response).to.be.deep.equal(['title', '', 'test']);
            delete element.title;
            expect(propertyChangedCallback.count).to.be.equal(1);
        });

        it('should should re-render on property changes', () => {
            class TestElement extends DNA.Component {
                @DNA.property() title = '';

                render() {
                    return DNA.html`<h1>${this.title}</h1>`;
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            DNA.DOM.appendChild(wrapper, element);
            expect(element.innerHTML).to.be.equal('<h1></h1>');
            element.title = 'test';
            expect(element.innerHTML).to.be.equal('<h1>test</h1>');
        });

        it('should NOT handle property if nothing changed on assignment', () => {
            const propertyChangedCallback = spyFunction((name, old, value) => [name, old, value]);
            class TestElement extends DNA.Component {
                get properties() {
                    return {
                        age: {
                            types: [Number],
                        },
                    };
                }

                @DNA.property() title = '';

                propertyChangedCallback(...args) {
                    super.propertyChangedCallback(...args);
                    propertyChangedCallback(...args);
                }
            }

            DNA.define(getComponentName(), TestElement);

            const element = new TestElement();
            expect(propertyChangedCallback.invoked).to.be.false;
            element.title = 'test';
            expect(propertyChangedCallback.invoked).to.be.true;
            expect(propertyChangedCallback.response).to.be.deep.equal(['title', '', 'test']);
            element.title = 'test';
            expect(propertyChangedCallback.count).to.be.equal(1);
        });
    });

    describe('#appendChild', () => {
        it('should append and connect child', () => {
            const connectedCallback = spyFunction();
            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(child);
            expect(connectedCallback.invoked).to.be.true;
        });

        it('should move and connect a child from a parent', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            DNA.DOM.appendChild(wrapper, child);
            expect(connectedCallback.invoked).to.be.true;
            expect(disconnectedCallback.invoked).to.be.false;
            element.appendChild(child);
            expect(connectedCallback.count).to.be.equal(2);
            expect(disconnectedCallback.invoked).to.be.true;
        });
    });

    describe('#removeChild', () => {
        it('should remove and disconnect a child', () => {
            const disconnectedCallback = spyFunction();
            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child = new TestChild();

            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(child);
            expect(disconnectedCallback.invoked).to.be.false;
            element.removeChild(child);
            expect(disconnectedCallback.invoked).to.be.true;
        });
    });

    describe('#insertBefore', () => {
        it('should insert and connect a child before another', () => {
            const connectedCallback = spyFunction();
            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(child1);
            element.insertBefore(child2, child1);
            expect(connectedCallback.invoked).to.be.true;
            expect(connectedCallback.count).to.be.equal(2);
        });

        it('should insert and connect a child (and remove it from the previous parent) before another', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            DNA.DOM.appendChild(wrapper, child2);
            element.appendChild(child1);
            element.insertBefore(child2, child1);
            expect(connectedCallback.invoked).to.be.true;
            expect(connectedCallback.count).to.be.equal(3);
            expect(disconnectedCallback.count).to.be.equal(1);
        });
    });

    describe('#replaceChild', () => {
        it('should reaplce and connect child in a parent', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            element.appendChild(child1);
            element.replaceChild(child2, child1);
            expect(connectedCallback.invoked).to.be.true;
            expect(connectedCallback.count).to.be.equal(2);
            expect(disconnectedCallback.count).to.be.equal(1);
        });

        it('should reaplce and connect a child (and remove it from the previous parent) in a parent', () => {
            const connectedCallback = spyFunction();
            const disconnectedCallback = spyFunction();
            class TestElement extends DNA.Component {}
            class TestChild extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connectedCallback();
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    disconnectedCallback();
                }
            }

            DNA.define(getComponentName(), TestElement);
            DNA.define(getComponentName(), TestChild);

            const element = new TestElement();
            const child1 = new TestChild();
            const child2 = new TestChild();

            expect(connectedCallback.invoked).to.be.false;
            expect(disconnectedCallback.invoked).to.be.false;
            DNA.DOM.appendChild(wrapper, element);
            DNA.DOM.appendChild(wrapper, child2);
            element.appendChild(child1);
            element.replaceChild(child2, child1);
            expect(connectedCallback.invoked).to.be.true;
            expect(connectedCallback.count).to.be.equal(3);
            expect(disconnectedCallback.count).to.be.equal(2);
        });
    });

    describe('attributes', () => {
        let element, TestElement;

        before(() => {
            TestElement = class extends DNA.Component {
                static get observedAttributes() {
                    return ['title', 'alias', 'age', 'flag'];
                }

                get properties() {
                    return {
                        age: {
                            types: [Number],
                        },
                    };
                }

                @DNA.property() title = '';
                @DNA.property({ attribute: 'alias' }) test = '';
                @DNA.property({ types: Boolean }) flag = false;
            };

            DNA.define(getComponentName(), TestElement);
        });

        beforeEach(() => {
            element = new TestElement({
                title: 'DNA',
                age: 42,
            });
        });

        describe('#getAttribute', () => {
            it('should get an empty attribute', () => {
                expect(element.getAttribute('missing')).to.be.null;
            });

            it('should get a string attribute', () => {
                expect(element.getAttribute('title')).to.be.equal('DNA');
            });

            it('should get a numeric attribute', () => {
                expect(element.getAttribute('age')).to.be.equal('42');
            });
        });

        describe('#setAttribute', () => {
            it('should set an attribute', () => {
                element.setAttribute('missing', 'DNA');
                expect(element.getAttribute('missing')).to.be.equal('DNA');
            });

            it('should set a string attribute and update the property', () => {
                element.setAttribute('title', 'WebComponents');
                expect(element.title).to.be.equal('WebComponents');
            });

            it('should set a string attribute and update the aliased property', () => {
                element.setAttribute('alias', 'WebComponents');
                expect(element.test).to.be.equal('WebComponents');
            });

            it('should set an empty attribute and update the boolean property', () => {
                element.setAttribute('flag', '');
                expect(element.flag).to.be.true;
                element.removeAttribute('flag');
                expect(element.flag).to.be.false;
                element.setAttribute('flag', 'flag');
                expect(element.flag).to.be.true;
            });

            it('should set a numeric attribute and update the property', () => {
                element.setAttribute('age', '42');
                expect(element.age).to.be.equal(42);
            });
        });

        describe('#hasAttribute', () => {
            it('should return `true` if element has an attribute', () => {
                expect(element.hasAttribute('title')).to.be.true;
            });

            it('should return `false` if element has an attribute', () => {
                expect(element.hasAttribute('missing')).to.be.false;
            });
        });

        describe('#removeAttribute', () => {
            it('should remove an attribute', () => {
                element.removeAttribute('title');
                expect(element.hasAttribute('title')).to.be.false;
            });

            it('should remove a string attribute and update the property', () => {
                element.removeAttribute('title');
                expect(element.title).to.be.null;
            });

            it('should remove a numeric attribute and update the property', () => {
                element.removeAttribute('age');
                expect(element.age).to.be.null;
            });
        });
    });
});
