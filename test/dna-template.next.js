import { DNATemplateComponent } from '../src/dna-template-component.next.js';
import { Register } from '../src/dna-library.next.js';

class TestComponent extends DNATemplateComponent {
    get name() {
        return this.__name;
    }

    set name(n) {
        return this.__name = n;
    }

    get surname() {
        return this.__surname;
    }

    set surname(n) {
        return this.__surname = n;
    }

    get fullname() {
        return (this.name ? (this.name + ' ') : '') + (this.surname || '');
    }
}

export class TestComponent1 extends TestComponent {
    static get template() {
        return function () {
            return `Hello, ${this.fullname}`;
        }
    }
}

export var Test1 = Register('test1-template-component', {
    prototype: TestComponent1
});

export class TestComponent2 extends TestComponent {
    static get template() {
        return '<span>Hello DNA!</span>';
    }
}

export var Test2 = Register('test2-template-component', {
    prototype: TestComponent2
});

export class TestComponent3 extends TestComponent {}

TestComponent3.template = '<span>Hello DNA!</span>';

export var Test3 = Register('test3-template-component', {
    prototype: TestComponent3
});
