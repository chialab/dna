import { Component, customElement, HTML, property } from '@chialab/dna';

@customElement('x-test')
export class TestElement extends Component {
    active?: boolean;

    @property({
        type: Number,
    })
    width: number = 2;

    @property({
        type: String,
    })
    title: string = 'test';

    get computed(): string {
        return this.getInnerPropertyValue('computed');
    }
    set computed(value) {
        this.setInnerPropertyValue('computed', value);
    }
}

new TestElement().focus();

@customElement('x-test-builtin', { extends: 'details' })
export class TestBuiltinElement extends HTML.Details {
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
