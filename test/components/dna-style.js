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

    createdCallback() {
        super.createdCallback();
    }
}

export class TestComponent2 extends TestComponent {
    static get css() {
        return `:host(.active) ${css}`;
    }

    createdCallback() {
        super.createdCallback();
        this.classList.add('active');
    }
}

export class TestComponent3 extends TestComponent {
    createdCallback() {
        super.createdCallback();
        this.classList.add('disabled');
    }
}

TestComponent3.css = `:host { display: block; } :host(.disabled) ${css}`;
