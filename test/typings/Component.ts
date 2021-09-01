import { Component, customElement, extend } from '@chialab/dna';

@customElement('x-test')
export class TestElement extends Component {
    active?: boolean;
}
new TestElement().focus();

@customElement('x-test-bultin')
export class TestBuiltinElement extends extend(HTMLDetailsElement) {
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
            'x-test-bultin': [TestBuiltinElement, {
                extends: 'details';
            }];
        }
    }
}
