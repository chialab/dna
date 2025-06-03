import { Component, type EventHandler, HTML, customElement, fires, listen, property } from '@chialab/dna';

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

    @fires()
    onselected?: EventHandler<CustomEvent<boolean>>;

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

new TestElement().onselected = (event) => {
    const selected: boolean = event.detail;
    // @ts-expect-error This is a test.
    const label: string = event.detail;

    return { selected, label };
};

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
