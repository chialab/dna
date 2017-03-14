import { BaseComponent } from '../../index.js';
import { isFunction } from '../../src/lib/typeof.js';

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
@charset "UTF-8";

/*

CSS Created by Chialab.it

*/

:host {
    color: #5F9EA0;
}

:host > * {
    background-color: #5F9EA0;
}

@media (min-width: 0) {
    h1, h2 {
        color: inherit;
    }
}

@keyframes anim {
    0% { top: 0; }
    100% { top: 10px; }
}`;
    }
}

export class TestComponent2 extends TestComponent {
    get css() {
        return `
:host(.active) {
    color: #5F9EA0;
}

:host(.active) > * {
    background-color: #5F9EA0;
}

@media (min-width: 0) {
    h1, h2 {
        color: inherit;
    }
}`;
    }

    constructor() {
        super();
        this.node.classList.add('active');
    }
}
