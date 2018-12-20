import { BaseComponent } from '../../index.js';
import { isFunction } from '@chialab/proteins';

class TestComponent extends BaseComponent {
    get template() {
        return '<h1>DNA TESTS</h1><h3>test</h3>';
    }
    constructor(...args) {
        super(...args);
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

h3 {
    color: blue;
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

    constructor(...args) {
        super(...args);
        this.node.classList.add('active');
    }
}

export class TestComponent3 extends TestComponent {
    get css() {
        return `
#before1:before {
    content: "Hello";
}

#before2:before {
    content: attr(id);
}

#before3:before {
    content: "Hello world";
}

#before4:before {
    content: "attr(id)";
}

#before5:before {
    content: "♜";
}

#before6:before {
    content: "hello-world";
}
`;
    }

    get template() {
        return '<span id="before1"></span><span id="before2"></span><span id="before3"></span><span id="before4"></span><span id="before5"></span><span id="before6"></span>';
    }

    constructor(...args) {
        super(...args);
        this.node.classList.add('active');
    }
}


export class TestComponent4 extends TestComponent {
    get css() {
        return `
@charset "UTF-8";

/*
        /* strip */
  /*
        */

:host {
    color: #5F9EA0;
}

:host > * {
    background-color: #5F9EA0;
}

@keyframes anim {
    0% { top: 0; }
    100% { top: 10px; }
}`;
    }
}
