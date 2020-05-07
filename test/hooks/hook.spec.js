import { useState, hook, DOM, html } from '@chialab/dna/hooks.js';

describe('[Hooks]', () => {
    describe('Root', () => {
        let wrapper;

        before(() => {
            wrapper = DOM.createElement('div');
            wrapper.ownerDocument.body.appendChild(wrapper);
        });

        it('should render simple element', () => {
            hook('myHook', () => {
                const [count, setCount] = useState(0);
                return html`Using DNA! Count: ${count} <button onclick=${() => setCount(count + 1)}>Count</button>`;
            }, { useShadowDOM: false });

        });
    });
});
