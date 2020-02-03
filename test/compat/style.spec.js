import { define, render, DOM, BaseComponent } from '../../dist/adapters/compat/dna.js';

const WRAPPER = document.body;

class TestComponent extends BaseComponent {
    get template() {
        return '<h1>DNA TESTS</h1><h3>test</h3>';
    }
    constructor(...args) {
        super(...args);
        if (this.node && typeof this.node.createShadowRoot === 'function') {
            this.node.createShadowRoot();
        }
    }
}

class TestComponent1 extends TestComponent {
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

class TestComponent2 extends TestComponent {
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

class TestComponent3 extends TestComponent {
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


class TestComponent4 extends TestComponent {
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

define('test1-style-component', TestComponent1);
define('test2-style-component', TestComponent2, {
    extends: 'div',
});
define('test3-style-component', TestComponent3);
define('test4-style-component', TestComponent4);

DOM.lifeCycle(true);

function normalizeContent(content) {
    return content.replace(/^("|')/, '').replace(/("|')$/, '');
}

describe.skip('[Compat] StyleComponent', () => {
    let elem1, elem2, elem3, elem4, h3;
    before(() => {
        elem1 = render(WRAPPER, TestComponent1);
        h3 = document.createElement('h3');
        WRAPPER.appendChild(h3);
        elem2 = render(WRAPPER, TestComponent2);
        elem3 = render(WRAPPER, TestComponent3);
        elem4 = render(WRAPPER, TestComponent4);
    });

    it.skip('should handle `css` getter property', () => {
        let style = window.getComputedStyle((elem1.node.shadowRoot || elem1.node).querySelector('h1'));
        let styleH3 = window.getComputedStyle((elem1.node.shadowRoot || elem1.node).querySelector('h3'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
        assert.equal(style.backgroundColor, 'rgb(95, 158, 160)');
        assert.equal(styleH3.color, 'rgb(0, 0, 255)');
        let styleOutside = window.getComputedStyle(h3);
        assert.equal(styleOutside.color, 'rgb(0, 0, 0)');
    });

    it.skip('should handle `css` getter property with state', () => {
        let style = window.getComputedStyle((elem2.node.shadowRoot || elem2.node).querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
        assert.equal(style.backgroundColor, 'rgb(95, 158, 160)');
    });

    it.skip('should handle `css` with content getter property', () => {
        let root = elem3.node.shadowRoot || elem3.node;
        let before1 = window.getComputedStyle(root.querySelector('#before1'), ':before');
        let before2 = window.getComputedStyle(root.querySelector('#before2'), ':before');
        let before3 = window.getComputedStyle(root.querySelector('#before3'), ':before');
        let before4 = window.getComputedStyle(root.querySelector('#before4'), ':before');
        let before5 = window.getComputedStyle(root.querySelector('#before5'), ':before');
        let before6 = window.getComputedStyle(root.querySelector('#before6'), ':before');
        assert.equal(normalizeContent(before1.content), 'Hello');
        assert.oneOf(normalizeContent(before2.content), ['before2', 'attr(id)']);
        assert.equal(normalizeContent(before3.content), 'Hello world');
        assert.equal(normalizeContent(before4.content), 'attr(id)');
        assert.equal(normalizeContent(before5.content), '♜');
        assert.equal(normalizeContent(before6.content), 'hello-world');
    });

    it.skip('should handle `css` comments', () => {
        let style = window.getComputedStyle((elem4.node.shadowRoot || elem4.node).querySelector('h1'));
        assert.equal(style.color, 'rgb(95, 158, 160)');
        assert.equal(style.backgroundColor, 'rgb(95, 158, 160)');
    });
});
