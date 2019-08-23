/* eslint-env mocha */
import { getModule, wait, spyPromise } from './helpers.js';

let DNA;

describe('registry', function() {
    this.timeout(10 * 1000);

    before(async () => {
        DNA = await getModule();
    });

    describe('#get', () => {
        it('should not return undefined component', () => {
            expect(DNA.get('test-define1')).to.be.null;
        });
    });

    describe('#define', () => {
        it('should define a tag', () => {
            const TestElement = class extends DNA.Component { };
            DNA.define('test-define2', TestElement);

            expect(DNA.get('test-define2').name).to.be.equal('test-define2');
            expect(DNA.get('test-define2').constructor).to.be.equal(TestElement);
            expect(DNA.get('test-define2').extends).to.be.undefined;
        });

        it('should extend a native tag', () => {
            const TestElement = class extends DNA.Component { };
            DNA.define('test-define3', TestElement, {
                extends: 'article',
            });

            expect(DNA.get('test-define3').name).to.be.equal('test-define3');
            expect(DNA.get('test-define3').constructor).to.be.equal(TestElement);
            expect(DNA.get('test-define3').extends).to.be.equal('article');
        });

        it('should throw if the tag has been already defined', () => {
            DNA.define('test-define4', class extends DNA.Component { });
            expect(() => {
                DNA.define('test-define4', class extends DNA.Component { });
            }).to.throw(Error, 'The registry already contains an entry with the same name');
        });

        it('should throw if the Component has been already defined', () => {
            const TestElement = class extends DNA.Component { };
            DNA.define('test-define5', TestElement);
            expect(() => {
                DNA.define('test-define6', TestElement);
            }).to.throw(Error, 'The registry already contains an entry with the constructor (or is otherwise already defined)');
        });

        it('should validate define input', () => {
            expect(() => {
                DNA.define(null, null);
            }).to.throw(SyntaxError, 'The provided name is not a valid Custom Element name');

            expect(() => {
                DNA.define('test', null);
            }).to.throw(SyntaxError, 'The provided name is not a valid Custom Element name');

            expect(() => {
                DNA.define('2-test', null);
            }).to.throw(SyntaxError, 'The provided name is not a valid Custom Element name');

            expect(() => {
                DNA.define('test-define', null);
            }).to.throw(TypeError, 'The referenced constructor is not a constructor');
        });
    });

    describe('#whenDefined', () => {
        it('should resolve a promise when an element is defined', async () => {
            const promise = spyPromise(DNA.whenDefined('test-define7'));
            DNA.define('test-define7', class extends DNA.Component { });
            await promise;
            expect(promise.resolved).to.be.true;
            expect(promise.response).to.be.undefined;
        });

        it('should return a resolved promise when an element has already been defined', async () => {
            DNA.define('test-define8', class extends DNA.Component { });
            const promise = spyPromise(DNA.whenDefined('test-define8'));
            await promise;
            expect(promise.resolved).to.be.true;
            expect(promise.response).to.be.undefined;
        });

        it('should not resolve for undefined element', async () => {
            const promise = spyPromise(DNA.whenDefined('test-define9'));
            expect(promise.pending).to.be.true;
            await wait(2000);
            expect(promise.pending).to.be.true;
        });
    });
});