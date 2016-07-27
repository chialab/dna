import { mix } from 'mixwith';
import { DNAComponent } from '../../src/dna-component.js';
import { DNAPropertiesComponent, DNAPropertiesMixin } from '../../src/dna-properties-component.js';
import { DNAVDomMixin } from '../../src/vdom/dna-vdom-component.js';
import h from 'snabbdom/h';

class TestComponent extends mix(DNAComponent).with(DNAPropertiesMixin, DNAVDomMixin) {
    static get observedProperties() {
        return ['name', 'lastName', 'title'];
    }
    get fullname() {
        return `${this.name ? `${this.name} ` : ''}${this.lastName || ''}`;
    }
}

export class TestComponent1 extends TestComponent {
    static get template() {
        return function() {
            return [
                this.title ? h('h1', {}, this.title) : '',
                this.title ? h('br') : '',
                `Hello, ${this.fullname}`,
            ];
        };
    }
}

export class TestComponent2 extends TestComponent {
    static get template() {
        return h('span.dna-test', {}, 'Hello DNA!');
    }
}

export class TestComponent3 extends TestComponent {
    static get template() {
        return 4;
    }
}

export class TestComponent4 extends TestComponent {
    static get observedProperties() {
        return ['radius'];
    }
    static get template() {
        return function() {
            return h('svg', {},
                [
                    h('circle', {
                        attrs: {
                            r: this.radius,
                            stroke: 'black',
                            'stroke-width': '3',
                            fill: 'red',
                        },
                    }),
                ]);
        };
    }
}

export class TestComponent5 extends TestComponent {
    static get template() {
        return [
            h('span.dna-test', {}, 'Hello DNA!'),
            h('test-vdom-placeholder'),
            h('figure', {
                attrs: {
                    is: 'test2-vdom-placeholder',
                },
            }),
        ];
    }
}

export class TestPlaceholder extends DNAPropertiesComponent {
    static get observedProperties() {
        return ['value'];
    }

    constructor() {
        super();
        this.value = 6;
    }
}

export class Test2Placeholder extends DNAPropertiesComponent {
    static get observedProperties() {
        return ['value'];
    }

    constructor() {
        super();
        this.value = 11;
    }
}
