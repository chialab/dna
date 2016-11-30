import { isFunction, BaseComponent } from '../../index.js';

class TestComponent extends BaseComponent {
    get template() {
        return '<h1>DNA TESTS</h1>';
    }
    constructor() {
        super();
        if (this.node && isFunction(this.node.createShadowRoot)) {
            this.node.createShadowRoot();
        }
    }
}

export class TestComponent1 extends TestComponent {
    get css() {
        return `
        :host {
            color: #5F9EA0;
        }

        h1, h2 {
            color: inherit;
        }`;
    }
}

export class TestComponent2 extends TestComponent {
    get css() {
        return `
        :host(.active) {
            color: #5F9EA0;
        }

        h1, h2 {
            color: inherit;
        }`;
    }

    constructor() {
        super();
        this.node.classList.add('active');
    }
}
