import { getModule } from './helpers.js';

let DNA, wrapper;

describe('Component', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
        wrapper = DNA.DOM.createElement('div');
        wrapper.ownerDocument.body.appendChild(wrapper);
    });

    beforeEach(() => {
        wrapper.innerHTML = '';
    });

    describe('#new', () => {
        it('should create a node', () => {
            const TestElement = class extends DNA.Component { };
            DNA.define('test-component', TestElement);

            const elem = new TestElement();
            expect(elem).to.be.an.instanceof(DNA.DOM.get('HTMLElement'));
            expect(elem.is).to.be.equal('test-component');
            expect(elem.tagName).to.be.equal('TEST-COMPONENT');
        });

        it('should extend a native node', () => {
            const TestElement = class extends DNA.Component { };
            DNA.define('test-component2', TestElement, {
                extends: 'article',
            });

            const elem = new TestElement();
            expect(elem).to.be.an.instanceof(DNA.DOM.get('HTMLElement'));
            expect(elem.is).to.be.equal('test-component2');
            expect(elem.tagName).to.be.equal('ARTICLE');
            expect(elem.getAttribute('is')).to.be.equal('test-component2');
        });

        it('should throw if element is not defined', () => {
            const TestElement = class extends DNA.Component { };

            expect(() => new TestElement).to.throw(TypeError, 'Illegal constructor.');
        });

        it('should setup properties', () => {
            const TestElement = class extends DNA.Component {
                get properties() {
                    return {
                        myCustomProp1: {
                            attribute: 'custom-prop',
                        },
                    };
                }

                @DNA.property() myCustomProp2 = '';
                @DNA.property() myCustomProp3 = '';
            };

            DNA.define('test-component3', TestElement);

            const element = new TestElement();

            expect(element).to.have.property('myCustomProp1');
            expect(element).to.have.property('myCustomProp2');
            expect(element).to.have.property('myCustomProp3');
            expect(element).to.not.have.property('myCustomProp4');
        });

        it('should initialize properties', () => {
            const TestElement = class extends DNA.Component {
                get properties() {
                    return {
                        myCustomProp1: {
                            attribute: 'custom-prop',
                        },
                    };
                }

                @DNA.property() myCustomProp2 = 'test';
                @DNA.property() myCustomProp3 = '';
            };

            DNA.define('test-component4', TestElement);

            const element = new TestElement({
                myCustomProp1: 42,
                myCustomProp2: 'toast',
            });

            expect(element.myCustomProp1, 42);
            expect(element.myCustomProp2, 'toast');
        });

        it('should connect already connected nodes', () => {
            let connected = false;
            const TestElement = class extends DNA.Component {
                connectedCallback() {
                    super.connectedCallback();
                    connected = true;
                }
            };

            wrapper.innerHTML = '<test-component5></test-component5>';
            expect(connected).to.be.false;
            DNA.define('test-component5', TestElement);
            DNA.upgrade(wrapper);
            expect(connected).to.be.true;

        });
    });

    describe('#connectedCallback', () => {
        it.skip('should connect on appendChild', () => {
            //
        });

        it.skip('should connect on replaceChild', () => {
            //
        });

        it.skip('should connect on insertBefore', () => {
            //
        });

        it.skip('should NOT connect if not moved', () => {
            //
        });

        it.skip('should render on connect', () => {
            //
        });
    });

    describe('#disconnectedCallback', () => {
        it.skip('should disconnect on removeChild', () => {
            //
        });

        it.skip('should disconnect and reconnect on replaceChild', () => {
            //
        });

        it.skip('should disconnect and reconnect on insertBefore', () => {
            //
        });

        it.skip('should NOT disconnect if not moved', () => {
            //
        });
    });

    describe('#attributeChangedCallback', () => {
        it.skip('should handle attribute changes on setAttribute', () => {
            //
        });

        it.skip('should handle attribute changes on removeAttribute', () => {
            //
        });

        it.skip('should NOT handle attribute if nothing changed on setAttribute', () => {
            //
        });
    });

    describe('#propertyChangedCallback', () => {
        it.skip('should handle property changes on assignment', () => {
            //
        });

        it.skip('should handle property changes on deletion', () => {
            //
        });

        it.skip('should should re-render on property changes', () => {
            //
        });

        it.skip('should NOT handle property if nothing changed on assignment', () => {
            //
        });
    });

    describe('#appendChild', () => {
        it.skip('should append and connect child', () => {
            //
        });

        it.skip('should move and connect a child from a parent', () => {
            //
        });
    });

    describe('#removeChild', () => {
        it.skip('should remove and disconnect a child', () => {
            //
        });
    });

    describe('#insertBefore', () => {
        it.skip('should insert and connect a child before another', () => {
            //
        });

        it('should insert and connect a child (and remove it from the previous parent) before another', () => {
            //
        });

        it('should do nothing when child is already before another', () => {
            //
        });
    });

    describe('#replaceChild', () => {
        it.skip('should reaplce and connect child in a parent', () => {
            //
        });

        it.skip('should reaplce and connect a child (and remove it from the previous parent) in a parent', () => {
            //
        });

        it.skip('should do nothing if the node is the same', () => {
            //
        });
    });

    describe('#observe', () => {
        it.skip('should observe property changes', () => {
            //
        });
    });

    describe('#unobserve', () => {
        it.skip('should unobserve property changes', () => {
            //
        });
    });

    describe('#dispatchEvent', () => {
        it.skip('should dispatch an event', () => {
            //
        });

        it.skip('should create and dispatch a custom event', () => {
            //
        });
    });

    describe('#delegate', () => {
        it.skip('should delegate an event', () => {
            //
        });
    });

    describe('#undelegate', () => {
        it.skip('should undelegate an event', () => {
            //
        });
    });

    describe('attributes', () => {
        let element, TestElement;

        before(() => {
            TestElement = class extends DNA.Component {
                @DNA.property({ attribute: 'title' }) title = '';
            };

            DNA.define('test-component9', TestElement);
        });

        beforeEach(() => {
            element = new TestElement({
                title: 'DNA',
            });
        });

        describe('#getAttribute', () => {
            it('should get an empty attribute', () => {
                expect(element.getAttribute('missing')).to.be.null;
            });

            it('should get an attribute', () => {
                expect(element.getAttribute('title')).to.be.equal('DNA');
            });
        });

        describe('#setAttribute', () => {
            it('should set an attribute', () => {
                element.setAttribute('missing', 'DNA');
                expect(element.getAttribute('missing')).to.be.equal('DNA');
            });

            it('should set an attribute and update the property', () => {
                element.setAttribute('title', 'WebComponents');
                expect(element.title).to.be.equal('WebComponents');
            });
        });

        describe('#hasAttribute', () => {
            it.skip('should return `true` if element has an attribute', () => {
                //
            });

            it.skip('should return `false` if element has an attribute', () => {
                //
            });
        });

        describe('#removeAttribute', () => {
            it.skip('should remove an attribute', () => {
                //
            });

            it('should remove an attribute and update the property', () => {
                //
            });
        });
    });
});
