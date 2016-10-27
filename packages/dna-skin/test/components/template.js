import { Shim, mix, prop, ComponentMixin, PropertiesMixin, TemplateMixin } from '../../index.js';

class TestComponent extends mix(new Shim(self.HTMLElement)).with(ComponentMixin, PropertiesMixin, TemplateMixin) {
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
        return '${this.title ? `<h1>${this.title}</h1><br>` : \'\'}Hello, ${this.fullname}';
    }
}

export class TestComponent2 extends TestComponent {
    get template() {
        return '<span class="dna-test">Hello DNA!</span>';
    }
}

export class TestComponent3 extends TestComponent {
    get template() {
        return {};
    }
}

export class TestComponent4 extends TestComponent {
    get template() {
        return ' \
            <svg> \
                <circle r="${this.radius}" stroke="black" stroke-width="3" fill="red" /> \
            </svg> \
        ';
    }

    get properties() {
        return {
            radius: Number,
        };
    }
}

export class TestComponent5 extends TestComponent {
    get template() {
        return ' \
            <span class="dna-test">Hello DNA!</span> \
            <test-vdom-placeholder></test-vdom-placeholder> \
            <figure is="test2-vdom-placeholder"></figure> \
        ';
    }
}

export class TestPlaceholder extends mix(new Shim(self.HTMLElement)).with(ComponentMixin, PropertiesMixin) {
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

export class Test2Placeholder extends mix(new Shim(self.HTMLElement)).with(ComponentMixin, PropertiesMixin) {
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
