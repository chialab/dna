import {
    Create as create,
    Extend as extend,
    Register as register,
} from '../src/dna-library.next.js';
import { DNABaseComponent } from '../src/dna-base-component.next.js';

/* globals describe, before, it, assert */
describe('Unit: DNALibrary', () => {
    it('should throws exception for missing param in extend method', () => {
        let wrapper = () => {
            extend(undefined, {
                createdCallback() {},
            });
        };
        assert.throws(wrapper, TypeError);
    });

    it('should extend two classes', () => {
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
        let superComponent = extend(DNABaseComponent, SuperClass);
        let subComponent = extend(superComponent, SubClass);
        let Test = register('test1-library-component', {
            prototype: subComponent,
        });
        let instance = new Test();
        assert.equal(instance.name, 'Alan');
        assert.equal(instance.lastName, 'Turing');
        assert.equal(instance.fullName, 'Alan Turing');
        assert.equal(instance.reverseName(), 'gniruT nalA');
        assert.equal(instance.age, 43);
    });

    it('should extend two prototypes', () => {
        let SuperClass = {
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
        let SubClass = {
            createdCallback() {
                this.age = '43';
                return SuperClass.createdCallback.call(this);
            },
            get age() {
                return this.__age;
            },
            set age(a) {
                this.__age = parseInt(`${a}`);
                return this.__age;
            },
        };
        let superComponent = extend(DNABaseComponent, SuperClass);
        let subComponent = extend(superComponent, SubClass);
        let Test = register('test2-library-component', {
            prototype: subComponent,
        });
        let instance = new Test();
        assert.equal(instance.name, 'Alan');
        assert.equal(instance.lastName, 'Turing');
        assert.equal(instance.fullName, 'Alan Turing');
        assert.equal(instance.reverseName(), 'gniruT nalA');
        assert.equal(instance.age, 43);
    });

    it('should throws exception for missing tagName param during creation', () => {
        let wrapper = () => {
            create({
                prototype: {
                    createdCallback() {},
                },
            });
        };
        assert.throws(wrapper, Error, 'Missing or bad typed `tagName` property');
    });

    it('should throws exception for missing tagName param during creation', () => {
        let wrapper = () => {
            create('test3-library-component');
        };
        let wrapper2 = () => {
            create('test3-library-component', {});
        };
        let wrapper3 = () => {
            create('test3-library-component', 10);
        };
        assert.throws(wrapper, Error, 'Missing prototype');
        assert.throws(wrapper2, Error, 'Missing prototype');
        assert.throws(wrapper3, Error, 'Missing prototype');
    });

    it('should create an element', () => {
        let Test = create('test3-library-component', {
            prototype: {
                createdCallback() {
                    this.name = 'Alan';
                    this.lastName = 'Turing';
                    this.age = '43';
                },
                get age() {
                    return this.__age;
                },
                set age(a) {
                    this.__age = parseInt(`${a}`);
                    return this.__age;
                },
                get fullName() {
                    return `${this.name} ${this.lastName}`;
                },
                reverseName() {
                    return this.fullName.split('').reverse().join('');
                },
            },
        });
        let instance = new Test();
        assert.equal(instance.name, 'Alan');
        assert.equal(instance.lastName, 'Turing');
        assert.equal(instance.fullName, 'Alan Turing');
        assert.equal(instance.reverseName(), 'gniruT nalA');
        assert.equal(instance.age, 43);
    });
});
