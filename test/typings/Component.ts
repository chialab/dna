import { Component, customElement, type EventHandler, fires, HTML, property } from '@chialab/dna';

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

    @fires()
    onselected?: EventHandler<CustomEvent<boolean>>;
}

@customElement('x-test-builtin', { extends: 'details' })
export class TestBuiltinElement extends HTML.Details {
    /**
     * Active prop.
     */
    active?: boolean;
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
