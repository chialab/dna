import * as DNALibrary from '../src/dna-library.next.js';
import { DNABaseComponent } from '../src/dna-base-component.next.js';

/* globals describe, before, it, assert */
describe('Unit: DNALibrary', () => {
    it('should extend a prototype', () => {
        let SuperClass = function() {};
        SuperClass.attributes = ['name', 'lastName'];
        SuperClass.prototype = {
            createdCallback() {
                this.name = 'Alan';
                this.lastName = 'Turing';
            },
            get fullName() {
                return `${this.name} ${this.lastName}`;
            },
            reverseName() {
                return this.fullName.split('').reverse().join('');
            },
        };
        let SubClass = function() {};
        SubClass.prototype = {
            createdCallback() {
                this.age = '43';
                return SuperClass.prototype.createdCallback.call(this);
            },
            get age() {
                return this.__age;
            },
            set age(a) {
                this.__age = parseInt(`${a}`);
                return this.__age;
            },
        };
        let superComponent = DNALibrary.Extend(DNABaseComponent, SuperClass);
        let subComponent = DNALibrary.Extend(superComponent, SubClass);
        let Ctr = DNALibrary.Register('test-library-component', {
            prototype: subComponent,
        });
        let instance = new Ctr();
        assert.equal(instance.name, 'Alan');
        assert.equal(instance.lastName, 'Turing');
        assert.equal(instance.fullName, 'Alan Turing');
        assert.equal(instance.reverseName(), 'gniruT nalA');
        assert.equal(instance.age, 43);
    });
});
