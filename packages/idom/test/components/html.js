import { BaseComponent, IDOM, trust } from '../../index.js';

// eslint-disable-next-line
const h = IDOM.h;

export class TestBaseHTMLComponent extends BaseComponent {
    get properties() {
        return {
            content: String,
        };
    }

    get template() {
        return () => <p>{trust(this.content)}</p>;
    }
}
