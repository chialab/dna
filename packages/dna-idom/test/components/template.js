import { shim, mix, prop, MIXINS, IDOM } from '../../index.js';

class TestComponent extends mix(shim(self.HTMLElement)).with(MIXINS.ComponentMixin, MIXINS.PropertiesMixin, MIXINS.TemplateMixin, MIXINS.IDomTemplateMixin) {
    get properties() {
        return {
            name: String,
            lastName: String,
            title: String,
        };
    }

    get fullname() {
        return `${this.name ? `${this.name} ` : ''}${this.lastName || ''}`;
    }
}

export class TestComponent1 extends TestComponent {
    get template() {
        return () => {
            if (this.title) {
                IDOM.elementOpen('h1');
                IDOM.text(this.title);
                IDOM.elementClose('h1');
                IDOM.elementVoid('br');
            }
            IDOM.text(`Hello, ${this.fullname}`);
        };
    }
}

export class TestComponent2 extends TestComponent {
    get template() {
        return () => {
            <span class="dna-test">Hello DNA!</span>;
        };
    }
}

export class TestComponent3 extends TestComponent {
    get template() {
        return {};
    }
}

export class TestComponent4 extends TestComponent {
    get template() {
        return () => {
            IDOM.elementOpen('svg');
            IDOM.elementVoid('circle', null, [
                'stroke', 'black',
                'stroke-width', '3',
                'fill', 'red',
            ],
                'r', this.radius
            );
            IDOM.elementClose('svg');
        };
    }

    get properties() {
        return {
            radius: Number,
        };
    }
}

export class TestComponent5 extends TestComponent {
    get template() {
        return () => {
            IDOM.elementOpen('span', null, ['class', 'dna-test']);
            IDOM.text('Hello DNA!');
            IDOM.elementClose('span');
            IDOM.elementOpen('test-vdom-placeholder');
            IDOM.elementClose('test-vdom-placeholder');
            IDOM.elementOpen('figure', null, ['is', 'test2-vdom-placeholder']);
            IDOM.elementClose('figure');
        };
    }
}

export class TestPlaceholder extends mix(shim(self.HTMLElement)).with(MIXINS.ComponentMixin, MIXINS.PropertiesMixin) {
    static get observedAttributes() {
        return ['value'];
    }

    get properties() {
        return {
            value: prop.NUMBER.attribute(),
        };
    }

    constructor() {
        super();
        this.value = 6;
    }
}

export class Test2Placeholder extends mix(shim(self.HTMLElement)).with(MIXINS.ComponentMixin, MIXINS.PropertiesMixin) {
    static get observedAttributes() {
        return ['value'];
    }

    get properties() {
        return {
            value: Number,
        };
    }

    constructor() {
        super();
        this.value = 11;
    }
}
