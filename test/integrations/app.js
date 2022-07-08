/* eslint-disable-next-line import/no-unresolved */
import * as DNA from '@chialab/dna';

export class TestElement extends DNA.Component {
    static get properties() {
        return {
            prop: { type: String },
            ref: { type: Object },
        };
    }

    render() {
        return DNA.html`
            <span>
                <slot />
            </span>
            <div>
                <slot name="children" />
            </div>
            ${this.prop && DNA.html`<p>${this.prop}</p>`}
            ${this.ref && DNA.html`<p>${this.ref.title}</p>`}
        `;
    }
}

DNA.customElements.define('test-element-integration', TestElement);
