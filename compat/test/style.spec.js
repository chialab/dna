import { window, define, render, DOM, BaseComponent } from '@chialab/dna/compat';
import { getComponentName } from '../../test/helpers.js';

function normalizeContent(content) {
    return content.replace(/^("|')/, '').replace(/("|')$/, '');
}

describe('Compat', () => {
    let wrapper;

    describe('Styles', () => {
        before(() => {
            DOM.lifeCycle(true);
            wrapper = DOM.createElement('div');
            wrapper.ownerDocument.body.appendChild(wrapper);
        });

        it('should handle `css` getter property', () => {
            class TestComponent extends BaseComponent {
                get template() {
                    return '<h1>DNA TESTS</h1><h3>test</h3>';
                }

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
            define(getComponentName(), TestComponent);

            let element = render(wrapper, TestComponent);
            let h3 = document.createElement('h3');
            wrapper.appendChild(h3);
            let style = window.getComputedStyle((element.node).querySelector('h1'));
            let styleH3 = window.getComputedStyle((element.node).querySelector('h3'));
            assert.equal(style.color, 'rgb(95, 158, 160)');
            assert.equal(style.backgroundColor, 'rgb(95, 158, 160)');
            assert.equal(styleH3.color, 'rgb(0, 0, 255)');
            let styleOutside = window.getComputedStyle(h3);
            assert.equal(styleOutside.color, 'rgb(0, 0, 0)');
        });

        it('should handle `css` getter property with state', () => {
            class TestComponent extends BaseComponent {
                get template() {
                    return '<h1>DNA TESTS</h1><h3>test</h3>';
                }

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

            define(getComponentName(), TestComponent, { extends: 'div' });

            let element = render(wrapper, TestComponent);
            let style = window.getComputedStyle((element.node).querySelector('h1'));
            assert.equal(style.color, 'rgb(95, 158, 160)');
            assert.equal(style.backgroundColor, 'rgb(95, 158, 160)');
        });

        it('should handle `css` with content getter property', () => {
            class TestComponent extends BaseComponent {
                get template() {
                    return '<span id="before1"></span><span id="before2"></span><span id="before3"></span><span id="before4"></span><span id="before5"></span><span id="before6"></span>';
                }

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

                constructor(...args) {
                    super(...args);
                    this.node.classList.add('active');
                }
            }

            define(getComponentName(), TestComponent);

            let element = render(wrapper, TestComponent);
            let root = element.node;
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

        it('should handle `css` comments', () => {
            class TestComponent extends BaseComponent {
                get template() {
                    return '<h1>DNA TESTS</h1><h3>test</h3>';
                }

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

            define(getComponentName(), TestComponent);

            let element = render(wrapper, TestComponent);
            let style = window.getComputedStyle((element.node).querySelector('h1'));
            assert.equal(style.color, 'rgb(95, 158, 160)');
            assert.equal(style.backgroundColor, 'rgb(95, 158, 160)');
        });
    });
});
