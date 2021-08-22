import type { VProperties } from '@chialab/dna';
import { Component, customElement, extend } from '@chialab/dna';

@customElement('x-test')
export class TestElement extends Component {
    active?: boolean;
}
new TestElement().focus();

@customElement('x-test-bultin')
export class TestBuiltinElement extends extend(HTMLDetailsElement) {
    active?: boolean;
}

if (new TestBuiltinElement().open === true) {
    new TestBuiltinElement().focus();
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'x-test': VProperties<TestElement>;
            'x-test-bultin': VProperties<TestBuiltinElement>;
        }
    }

    interface HTMLElementTagNameMap {
        'x-test': TestElement;
        'x-test-bultin': TestBuiltinElement;
    }
}
