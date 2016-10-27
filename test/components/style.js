import { Shim, mix, ComponentMixin, StyleMixin } from '../library.js';

class TestComponent extends mix(new Shim(self.HTMLElement)).with(ComponentMixin, StyleMixin) {
    constructor() {
        super();
        this.innerHTML = '<h1>DNA TESTS</h1>';
    }
}

let css = 'h1 { color: #5F9EA0; }';

export class TestComponent1 extends TestComponent {
    get css() {
        return `.test1-style-component ${css}`;
    }
}

export class TestComponent2 extends TestComponent {
    get css() {
        return `.test2-style-component.active ${css}`;
    }

    constructor() {
        super();
        this.classList.add('active');
    }
}
