import { Component, customElement, extend } from '@chialab/dna';

@customElement('x-test')
export class TestElement extends Component { }
new TestElement().focus();

@customElement('x-test-bultin')
export class TestBuiltinElement extends extend(HTMLDetailsElement) { }

if (new TestBuiltinElement().open === true) {
    new TestBuiltinElement().focus();
}
