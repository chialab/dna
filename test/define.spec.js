/* eslint-env mocha */
import { getModule } from './module.js';

let DNA;

describe('registry', () => {
    before(async () => {
        DNA = await getModule();
    });

    it('should define a tag', () => {
        const TestElement = class extends DNA.Component { };
        DNA.define('test-define', TestElement);

        expect(DNA.registry.has('test-define')).to.be.true;
        expect(DNA.registry.get('test-define').name).to.be.equal('test-define');
        expect(DNA.registry.get('test-define').constructor).to.be.equal(TestElement);
        expect(DNA.registry.get('test-define').extends).to.be.undefined;
    });

    it('should extend a native tag', () => {
        const TestElement = class extends DNA.Component { };
        DNA.define('test-define2', TestElement, {
            extends: 'article',
        });

        expect(DNA.registry.has('test-define2')).to.be.true;
        expect(DNA.registry.get('test-define2').name).to.be.equal('test-define2');
        expect(DNA.registry.get('test-define2').constructor).to.be.equal(TestElement);
        expect(DNA.registry.get('test-define2').extends).to.be.equal('article');
    });

    it('should not return undefined component', () => {
        expect(DNA.registry.has('test-define3')).to.be.false;
        expect(DNA.registry.get('test-define3')).to.be.null;
    });

    it('should return a list of defined component', () => {
        const class1 = class extends DNA.Component { };
        const class2 = class extends DNA.Component { };
        const class3 = class extends DNA.Component { };
        DNA.define('test-define4', class1);
        DNA.define('test-define5', class2);
        DNA.define('test-define6', class3);

        const entries = DNA.registry.entries();
        expect(entries.length).to.be.above(2);
        expect(entries[entries.length - 3].constructor).to.be.equal(class1);
        expect(entries[entries.length - 2].constructor).to.be.equal(class2);
        expect(entries[entries.length - 1].constructor).to.be.equal(class3);
    });

    it('should throw if constructor is not valid', () => {
        expect(() => {
            DNA.define('test-define7', Object);
        }).to.throw(TypeError, 'constructor does not extends HTMLElement');
    });

    it('should throw if the tag has been already defined', () => {
        DNA.define('test-define8', class extends DNA.Component { });
        expect(() => {
            DNA.define('test-define8', class extends DNA.Component { });
        }).to.throw(Error, '"test-define8" tag has already been defined');
    });

    it('should throw if the Component has been already defined', () => {
        const TestElement = class extends DNA.Component { };
        DNA.define('test-define9', TestElement);
        expect(() => {
            DNA.define('test-define10', TestElement);
        }).to.throw(Error, 'constructor has already been defined');
    });

    it('should validate define input', () => {
        expect(() => {
            DNA.define(null, null);
        }).to.throw(TypeError, 'the name provided is not a string');

        expect(() => {
            DNA.define('test-define', null);
        }).to.throw(TypeError, 'the constructor provided is not a class');
    });
});
