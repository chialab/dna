import { DNAStyleComponent } from '../src/dna-style-component.next.js';
import { DNAHelper } from '../src/dna-helper.next.js';

class TestComponent extends DNAStyleComponent {
    createdCallback() {
        super.createdCallback();
        this.innerHTML = '<h1>DNA TESTS</h1>';
    }
}

let css = 'h1 { color: #5F9EA0; }';

export class TestComponent1 extends TestComponent {
    static get css() {
        return function() {
            return `.test1-style-component ${css}`;
        };
    }
}

export const Test1 = DNAHelper.register('test1-style-component', {
    prototype: TestComponent1,
});

export class TestComponent2 extends TestComponent {
    static get css() {
        return `.test2-style-component ${css}`;
    }
}

export const Test2 = DNAHelper.register('test2-style-component', {
    prototype: TestComponent2,
});

export class TestComponent3 extends TestComponent {}

TestComponent3.css = `.test3-style-component ${css}`;

export const Test3 = DNAHelper.register('test3-style-component', {
    prototype: TestComponent3,
});
