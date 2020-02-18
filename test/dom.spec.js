import { getModule, spyFunction } from './helpers.js';

let DNA;

describe('DOM', function() {
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

    describe('#isDocument', () => {
        it('should return `true` to for documents', () => {
            const element = DNA.DOM.createElement('div');
            expect(DNA.DOM.isDocument(element.ownerDocument)).to.be.true;
        });

        it('should return `false` to for nodes', () => {
            const element = DNA.DOM.createElement('div');
            expect(DNA.DOM.isDocument(element)).to.be.false;
        });
    });

    describe('#isText', () => {
        it('should return `true` to for texts', () => {
            const node = DNA.DOM.createTextNode('hello');
            expect(DNA.DOM.isText(node)).to.be.true;
        });

        it('should return `false` to for elements', () => {
            const element = DNA.DOM.createElement('div');
            expect(DNA.DOM.isText(element)).to.be.false;
        });
    });

    describe('#isElement', () => {
        it('should return `true` to for elements', () => {
            const element = DNA.DOM.createElement('div');
            expect(DNA.DOM.isElement(element)).to.be.true;
        });

        it('should return `false` to for texts', () => {
            const node = DNA.DOM.createTextNode('hello');
            expect(DNA.DOM.isElement(node)).to.be.false;
        });
    });

    describe('#parse', () => {
        it('should return dom for html', () => {
            const nodes = DNA.DOM.parse('<h1>hello</h1>');
            expect(nodes).to.have.lengthOf(1);
            const element = nodes[0];
            expect(DNA.DOM.isElement(element)).to.be.true;
            expect(element.tagName).to.be.equal('H1');
            expect(element.textContent).to.be.equal('hello');
        });

        it('should return `false` to for texts', () => {
            const node = DNA.DOM.createTextNode('hello');
            expect(DNA.DOM.isElement(node)).to.be.false;
        });
    });

    describe('#createElement', () => {
        it('should create an element', () => {
            const element = DNA.DOM.createElement('div');
            expect(element.tagName).to.be.equal('DIV');
            expect(element.namespaceURI).to.be.equal('http://www.w3.org/1999/xhtml');
        });

        it('should create a defined element', () => {
            const TestElement = class extends DNA.Component { };
            DNA.define('test-domcreate', TestElement);

            const element = DNA.DOM.createElement('test-domcreate');
            expect(element.is).to.be.equal('test-domcreate');
            expect(element.tagName).to.be.equal('TEST-DOMCREATE');
        });

        it('should create and extend a native element', () => {
            const TestElement = class extends DNA.Component { };
            DNA.define('test-domcreate2', TestElement, {
                extends: 'article',
            });

            const element = DNA.DOM.createElement('article', { is: 'test-domcreate2' });
            expect(element.is).to.be.equal('test-domcreate2');
            expect(element.tagName).to.be.equal('ARTICLE');
            expect(element.getAttribute('is')).to.be.equal('test-domcreate2');
        });
    });

    describe('#createElementNS', () => {
        it('should create SVG element', () => {
            const element = DNA.DOM.createElementNS('http://www.w3.org/2000/svg', 'svg');
            expect(element.tagName).to.be.equal('svg');
            expect(element.namespaceURI).to.be.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('#appendChild', () => {
        it('should append a child to a parent', () => {
            const child = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(wrapper, child);
            expect(child.parentNode).to.be.equal(wrapper);
        });

        it('should move a child from a parent to another parent', () => {
            const parent = DNA.DOM.createElement('div');
            const child = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(parent, child);
            expect(child.parentNode).to.be.equal(parent);
            DNA.DOM.appendChild(wrapper, child);
            expect(parent.childNodes).to.have.lengthOf(0);
            expect(child.parentNode).to.be.equal(wrapper);
        });
    });

    describe('#removeChild', () => {
        it('should remove a child from a parent', () => {
            const child = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(wrapper, child);
            expect(child.parentNode).to.be.equal(wrapper);
            DNA.DOM.removeChild(wrapper, child);
            expect(child.parentNode).to.be.null;
            expect(wrapper.childNodes).to.have.lengthOf(0);
        });
    });

    describe('#insertBefore', () => {
        it('should insert a child before another', () => {
            const child1 = DNA.DOM.createElement('div');
            const child2 = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(wrapper, child1);
            DNA.DOM.insertBefore(wrapper, child2, child1);
            expect(child1.parentNode).to.be.equal(wrapper);
            expect(child2.parentNode).to.be.equal(wrapper);
            expect(wrapper.childNodes[0]).to.be.equal(child2);
            expect(wrapper.childNodes[1]).to.be.equal(child1);
        });

        it('should insert a child (and remove it from the previous parent) before another', () => {
            const parent = DNA.DOM.createElement('div');
            const child1 = DNA.DOM.createElement('div');
            const child2 = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(parent, child2);
            expect(child2.parentNode).to.be.equal(parent);
            DNA.DOM.appendChild(wrapper, child1);
            DNA.DOM.insertBefore(wrapper, child2, child1);
            expect(parent.childNodes).to.have.lengthOf(0);
            expect(child1.parentNode).to.be.equal(wrapper);
            expect(child2.parentNode).to.be.equal(wrapper);
            expect(wrapper.childNodes[0]).to.be.equal(child2);
            expect(wrapper.childNodes[1]).to.be.equal(child1);
        });

        it('should do nothing when child is already before another', () => {
            const child1 = DNA.DOM.createElement('div');
            const child2 = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(wrapper, child1);
            DNA.DOM.appendChild(wrapper, child2);
            DNA.DOM.insertBefore(wrapper, child1, child2);
            expect(child1.parentNode).to.be.equal(wrapper);
            expect(child2.parentNode).to.be.equal(wrapper);
            expect(wrapper.childNodes[0]).to.be.equal(child1);
            expect(wrapper.childNodes[1]).to.be.equal(child2);
        });
    });

    describe('#replaceChild', () => {
        it('should reaplce a child in a parent', () => {
            const child1 = DNA.DOM.createElement('div');
            const child2 = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(wrapper, child1);
            expect(child1.parentNode).to.be.equal(wrapper);
            DNA.DOM.replaceChild(wrapper, child2, child1);
            expect(child1.parentNode).to.be.null;
            expect(child2.parentNode).to.be.equal(wrapper);
            expect(wrapper.childNodes).to.have.lengthOf(1);
            expect(wrapper.childNodes[0]).to.be.equal(child2);
        });

        it('should reaplce a child (and remove it from the previous parent) in a parent', () => {
            const parent = DNA.DOM.createElement('div');
            const child1 = DNA.DOM.createElement('div');
            const child2 = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(parent, child2);
            expect(child2.parentNode).to.be.equal(parent);
            DNA.DOM.appendChild(wrapper, child1);
            expect(child1.parentNode).to.be.equal(wrapper);
            DNA.DOM.replaceChild(wrapper, child2, child1);
            expect(parent.childNodes).to.have.lengthOf(0);
            expect(child1.parentNode).to.be.null;
            expect(child2.parentNode).to.be.equal(wrapper);
            expect(wrapper.childNodes).to.have.lengthOf(1);
            expect(wrapper.childNodes[0]).to.be.equal(child2);
        });

        it('should do nothing if the node is the same', () => {
            const child = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(wrapper, child);
            expect(child.parentNode).to.be.equal(wrapper);
            DNA.DOM.replaceChild(wrapper, child, child);
            expect(child.parentNode).to.be.equal(wrapper);
            expect(wrapper.childNodes).to.have.lengthOf(1);
        });
    });

    describe('#getAttribute', () => {
        it('should get an empty node attribute', () => {
            const element = DNA.DOM.createElement('button');
            expect(DNA.DOM.getAttribute(element, 'type')).to.be.null;
        });

        it('should get a node attribute', () => {
            const element = DNA.DOM.createElement('button');
            element.setAttribute('type', '1');
            expect(DNA.DOM.getAttribute(element, 'type')).to.be.equal('1');
        });
    });

    describe('#setAttribute', () => {
        it('should set a node attribute', () => {
            const element = DNA.DOM.createElement('button');
            DNA.DOM.setAttribute(element, 'type', '1');
            expect(element.getAttribute('type')).to.be.equal('1');
        });
    });

    describe('#hasAttribute', () => {
        it('should return `true` if node has an attribute', () => {
            const element = DNA.DOM.createElement('button');
            DNA.DOM.setAttribute(element, 'type', '1');
            expect(DNA.DOM.hasAttribute(element, 'type')).to.be.true;
        });

        it('should return `false` if node has an attribute', () => {
            const element = DNA.DOM.createElement('button');
            expect(DNA.DOM.hasAttribute(element, 'type')).to.be.false;
        });
    });

    describe('#removeAttribute', () => {
        it('should remove a node attribute', () => {
            const element = DNA.DOM.createElement('button');
            DNA.DOM.setAttribute(element, 'type', '1');
            expect(DNA.DOM.getAttribute(element, 'type')).to.be.equal('1');
            DNA.DOM.removeAttribute(element, 'type');
            expect(DNA.DOM.getAttribute(element, 'type')).to.be.null;
        });
    });

    describe('#isConnected', () => {
        it('return `true` if element is connected', () => {
            const child = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(wrapper, child);
            expect(DNA.DOM.isConnected(child)).to.be.true;
        });

        it('return `true` if element is disconnected', () => {
            const child = DNA.DOM.createElement('div');
            expect(DNA.DOM.isConnected(child)).to.be.false;
        });
    });

    describe('#isConnected', () => {
        it('return `true` if element is connected', () => {
            const child = DNA.DOM.createElement('div');
            DNA.DOM.appendChild(wrapper, child);
            expect(DNA.DOM.isConnected(child)).to.be.true;
        });

        it('return `true` if element is disconnected', () => {
            const child = DNA.DOM.createElement('div');
            expect(DNA.DOM.isConnected(child)).to.be.false;
        });
    });

    describe('#define', () => {
        it('should define a native constructor', () => {
            const DNAHTMLElement = class { };
            const DNAHTMLElementShim = DNA.DOM.define('DNAHTMLElement', DNAHTMLElement);
            expect(DNAHTMLElementShim.prototype).to.be.equal(DNAHTMLElement.prototype);
            const Proxy = DNA.DOM.get('DNAHTMLElement');
            expect(new Proxy).to.be.an.instanceof(DNAHTMLElementShim);
        });

        it('should update an already proxied class', () => {
            const DNAHTMLElementShim1 = DNA.DOM.define('DNAHTMLElement', class { });
            const Proxy = DNA.DOM.get('DNAHTMLElement');
            expect(new Proxy).to.be.an.instanceof(DNAHTMLElementShim1);
            const DNAHTMLElementShim2 = DNA.DOM.define('DNAHTMLElement', class { });
            expect(DNAHTMLElementShim1).to.not.equal(DNAHTMLElementShim2);
            expect(new Proxy).to.be.an.instanceof(DNAHTMLElementShim2);
            expect(new Proxy).to.not.be.an.instanceof(DNAHTMLElementShim1);
        });
    });

    describe('#dispatchEvent', () => {
        it('should dispatch custom events', () => {
            const listener = spyFunction(() => { });
            wrapper.addEventListener('click', listener);
            DNA.DOM.dispatchEvent(wrapper, 'click');
            expect(listener.invoked).to.be.true;
        });

        it('should dispatch custom events with details', () => {
            const details = {};
            const listener = spyFunction((event) => event.detail);
            wrapper.addEventListener('click', listener);
            DNA.DOM.dispatchEvent(wrapper, 'click', details);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.equal(details);
        });

        it('should dispatch custom events that does bubble', () => {
            const details = {};
            const listener = spyFunction((event) => event.bubbles);
            const child = DNA.DOM.createElement('button');
            DNA.DOM.appendChild(wrapper, child);
            wrapper.addEventListener('click', listener);
            DNA.DOM.dispatchEvent(child, 'click', details, true);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.true;
        });

        it('should dispatch custom events that is canceleable', () => {
            const details = {};
            const listener = spyFunction((event) => event.cancelable);
            const child = DNA.DOM.createElement('button');
            DNA.DOM.appendChild(wrapper, child);
            wrapper.addEventListener('click', listener);
            DNA.DOM.dispatchEvent(child, 'click', details, true, true);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.true;
        });

        it('should dispatch custom events that does not bubble', () => {
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(button);
            const listener1 = spyFunction((event) => event.bubbles);
            const listener2 = spyFunction((event) => event.bubbles);
            wrapper.addEventListener('click', listener1);
            button.addEventListener('click', listener2);
            DNA.DOM.dispatchEvent(button, 'click', null, false);
            expect(listener1.invoked).to.be.false;
            expect(listener2.invoked).to.be.true;
            expect(listener2.response).to.be.false;
        });

        it('should dispatch custom events that is not canceleable', () => {
            const details = {};
            const listener = spyFunction((event) => event.cancelable);
            const child = DNA.DOM.createElement('button');
            DNA.DOM.appendChild(wrapper, child);
            wrapper.addEventListener('click', listener);
            DNA.DOM.dispatchEvent(child, 'click', details, true, false);
            expect(listener.invoked).to.be.true;
            expect(listener.response).to.be.false;
        });

        it('should validate dispatch input', () => {
            expect(() => {
                DNA.DOM.dispatchEvent(null);
            }).to.throw(TypeError, 'The provided element must be a Node');

            expect(() => {
                DNA.DOM.dispatchEvent(wrapper, null);
            }).to.throw(TypeError, 'The provided object must be an Event');

            expect(() => {
                DNA.DOM.dispatchEvent(wrapper, 'click', null, null, null, null);
            }).to.throw(TypeError);

            expect(() => {
                DNA.DOM.dispatchEvent(wrapper, 'click', null, true, null, null);
            }).to.throw(TypeError);

            expect(() => {
                DNA.DOM.dispatchEvent(wrapper, 'click', null, true, true, null);
            }).to.throw(TypeError);
        });
    });

    describe.skip('#dispatchAyncEvent', () => {
        it('should trigger an event and return a Promise', () => {
            //
        });
    });

    describe('#delegateEventListener', () => {
        it('should add delegate a listener', () => {
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(button);
            const listener = spyFunction(() => { });
            DNA.DOM.delegateEventListener(wrapper, 'click', 'button', listener);
            DNA.DOM.delegateEventListener(wrapper, 'mouseenter', 'button', listener);
            button.click();
            DNA.DOM.dispatchEvent(button, 'mouseenter');

            expect(listener.invoked).to.be.true;
            expect(listener.count).to.be.equal(2);
        });

        it('should validate delegation input', () => {
            expect(() => {
                DNA.DOM.delegateEventListener(false, false, false, false);
            }).to.throw(TypeError, 'The provided element must be a Node');

            expect(() => {
                DNA.DOM.delegateEventListener(wrapper, false, false, false);
            }).to.throw(TypeError, 'The provided event name must be a string');

            expect(() => {
                DNA.DOM.delegateEventListener(wrapper, 'click', false, false);
            }).to.throw(TypeError, 'The provided selector must be a string');

            expect(() => {
                DNA.DOM.delegateEventListener(wrapper, 'click', 'button', false);
            }).to.throw(TypeError, 'The provided callback must be a function');
        });

        it('should stop propagation', () => {
            const child = DNA.DOM.createElement('div');
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(child);
            child.appendChild(button);
            const listener1 = spyFunction(() => { });
            const listener2 = spyFunction((event) => {
                event.stopPropagation();
            });
            const listener3 = spyFunction(() => { });
            const listener4 = spyFunction(() => { });
            DNA.DOM.delegateEventListener(child, 'click', 'div', listener1);
            DNA.DOM.delegateEventListener(child, 'click', 'button', listener2);
            DNA.DOM.delegateEventListener(child, 'click', 'button', listener3);
            DNA.DOM.delegateEventListener(child, 'click', null, listener4);
            button.click();

            expect(listener1.invoked).to.be.false;
            expect(listener2.invoked).to.be.true;
            expect(listener3.invoked).to.be.true;
            expect(listener4.invoked).to.be.false;
        });

        it('should immediately stop propagation', () => {
            const child = DNA.DOM.createElement('div');
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(child);
            child.appendChild(button);
            const listener1 = spyFunction(() => { });
            const listener2 = spyFunction((event) => {
                event.stopImmediatePropagation();
            });
            const listener3 = spyFunction(() => { });
            const listener4 = spyFunction(() => { });
            DNA.DOM.delegateEventListener(child, 'click', 'div', listener1);
            DNA.DOM.delegateEventListener(child, 'click', 'button', listener2);
            DNA.DOM.delegateEventListener(child, 'click', 'button', listener3);
            DNA.DOM.delegateEventListener(child, 'click', null, listener4);
            button.click();

            expect(listener1.invoked).to.be.false;
            expect(listener2.invoked).to.be.true;
            expect(listener3.invoked).to.be.false;
            expect(listener4.invoked).to.be.false;
        });
    });

    describe('#undelegateEventListener', () => {
        it('should remove a delegated event listener', () => {
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(button);
            const listener = spyFunction(() => { });
            const listener2 = spyFunction(() => { });
            DNA.DOM.delegateEventListener(wrapper, 'click', 'button', listener);
            DNA.DOM.delegateEventListener(wrapper, 'click', 'button', listener2);
            button.click();
            DNA.DOM.undelegateEventListener(wrapper, 'click', 'button', listener2);
            button.click();

            expect(listener.count).to.be.equal(2);
            expect(listener2.count).to.be.equal(1);
        });

        it.skip('should do nothing if there are no delegations', () => {
            //
        });

        it.skip('should do nothing if there are no delegations for an event', () => {
            //
        });

        it('should validate undelegateEventListener input', () => {
            expect(() => {
                DNA.DOM.undelegateEventListener(false, false, false, false);
            }).to.throw(TypeError, 'The provided element must be a Node');

            expect(() => {
                DNA.DOM.undelegateEventListener(wrapper, false, false, false);
            }).to.throw(TypeError, 'The provided event name must be a string');

            expect(() => {
                DNA.DOM.undelegateEventListener(wrapper, 'click', false, false);
            }).to.throw(TypeError, 'The provided selector must be a string');

            expect(() => {
                DNA.DOM.undelegateEventListener(wrapper, 'click', 'button', false);
            }).to.throw(TypeError, 'The provided callback must be a function');
        });
    });

    describe('#undelegateAllEventListeners', () => {
        it('should remove all delegated event listeners', () => {
            const button = DNA.DOM.createElement('button');
            wrapper.appendChild(button);
            const listener = spyFunction(() => { });
            DNA.DOM.delegateEventListener(wrapper, 'click', 'button', listener);
            DNA.DOM.delegateEventListener(wrapper, 'mouseenter', 'button', listener);
            button.click();
            DNA.DOM.dispatchEvent(button, 'mouseenter');
            DNA.DOM.undelegateAllEventListeners(wrapper);
            button.click();
            DNA.DOM.dispatchEvent(button, 'mouseenter');

            expect(listener.count).to.be.equal(2);
        });

        it('should validate undelegateAllEventListeners input', () => {
            expect(() => {
                DNA.DOM.undelegateEventListener(null, null, null, null);
            }).to.throw(TypeError, 'The provided element must be a Node');
        });

        it.skip('should throw if argument is not a Node', () => {
            //
        });
    });
});
