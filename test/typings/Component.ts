import { Component, HTML, customElement, listen, property } from '@chialab/dna';

@customElement('x-test')
export class TestElement extends Component {
    active?: boolean;

    @property({
        type: Number,
    })
    width = 2;

    @property({
        type: String,
    })
    title = 'test';

    get computed(): string {
        return this.getInnerPropertyValue('computed');
    }
    set computed(value) {
        this.setInnerPropertyValue('computed', value);
    }

    @property()
    private privateSymbol = 1;

    @listen('click')
    handleClick(event: MouseEvent) {}

    @listen('click')
    protected handleClick2(event: MouseEvent) {}

    @listen('click')
    private handleClick3(event: MouseEvent) {}
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
