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
            return `:host ${css}`;
        };
    }
}

export class TestComponent2 extends TestComponent {
    static get css() {
        return `:host ${css}`;
    }
}

export class TestComponent3 extends TestComponent {}

TestComponent3.css = `:host ${css}`;
