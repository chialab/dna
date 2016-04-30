import { DNAStyleComponent } from '../../src/dna-style-component.js';

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

export class TestComponent2 extends TestComponent {
    static get css() {
        return `.test2-style-component ${css}`;
    }
}

export class TestComponent3 extends TestComponent {}

TestComponent3.css = `.test3-style-component ${css}`;
