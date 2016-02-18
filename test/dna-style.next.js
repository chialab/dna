import { DNAStyleComponent } from '../src/dna-style-component.next.js';
import { Register } from '../src/dna-library.next.js';

class TestComponent extends DNAStyleComponent {
    createdCallback() {
        super.createdCallback();
        this.innerHTML = '<h1>DNA TESTS</h1>';
    }
}

let css = 'h1 { color: #5F9EA0; }';

export class TestComponent1 extends TestComponent {
    static get css() {
        return function () {
            return '.test1-component ' + css;
        }
    }
}

export var Test1 = Register('test1-component', {
    prototype: TestComponent1
});

export class TestComponent2 extends TestComponent {
    static get css() {
        return '.test2-component ' + css;
    }
}

export var Test2 = Register('test2-component', {
    prototype: TestComponent2
});

export class TestComponent3 extends TestComponent {}

TestComponent3.css = '.test3-component ' + css;

export var Test3 = Register('test3-component', {
    prototype: TestComponent3
});
