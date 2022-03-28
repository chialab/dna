// eslint-disable-next-line import/no-unresolved
import { window, Component, customElement, extend } from '@chialab/dna';

@customElement('x-test')
export class TestElement extends Component {
    active?: boolean;
}
new TestElement().focus();

@customElement('x-test-builtin', { extends: 'details' })
export class TestBuiltinElement extends extend(window.HTMLDetailsElement) {
    /**
     * Active prop.
     */
    active?: boolean;
}

if (new TestBuiltinElement().open === true) {
    new TestBuiltinElement().focus();
}

declare module '@chialab/dna' {
    namespace JSX {
        interface CustomElements {
            'x-test': TestElement;
            'x-test-builtin': TestBuiltinElement & {
                extends: 'details';
            };
        }
    }
}
