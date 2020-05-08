import { Component, customElements, useState, hook, DOM, html, render } from '@chialab/dna/hooks.js';
import { wait } from '../helpers';

describe('[Hooks]', () => {
    describe('hook', () => {
        let wrapper;

        before(() => {
            wrapper = DOM.createElement('div');
            wrapper.ownerDocument.body.appendChild(wrapper);
        });

        it('should handle useState', async () => {
            const Counter = hook('my-hook', () => {
                const [count, setCount] = useState(0);
                return html`Using DNA! Count: ${count} <button onclick=${() => setCount(count + 1)}>Count</button>`;
            });

            class App extends Component {
                render() {
                    return html`<${Counter} />`;
                }
            }

            customElements.define('my-app', App);

            const app = render(wrapper, new App());
            const hookElement = app.querySelector('div[is="my-hook"]');

            // haunted render is async
            await wait(200);

            expect(hookElement).to.be.instanceof(Counter);
            expect(hookElement.innerHTML).to.be.equal('Using DNA! Count: 0 <button>Count</button>');

            const button = hookElement.querySelector('button');
            button.click();

            await wait(200);

            expect(hookElement.innerHTML).to.be.equal('Using DNA! Count: 1 <button>Count</button>');
        });
    });
});
