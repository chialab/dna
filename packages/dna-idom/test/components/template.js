import { prop, BaseComponent } from '../../index.js';

class TestComponent extends BaseComponent {
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

/* eslint-disable no-unused-vars */
const TEMPLATE1 = function(IDOM) {
    return <test1-template-component>
        {this.title && [<h1>{this.title}</h1>,<br />]}
        Hello, {this.fullname}
    </test1-template-component>;
};

export class TestComponent1 extends TestComponent {
    get template() {
        return TEMPLATE1;
    }
}

/* eslint-disable no-unused-vars */
const TEMPLATE2 = function(IDOM) {
    return <test2-template-component>
        <span class="dna-test">Hello DNA!</span>
    </test2-template-component>;
};

export class TestComponent2 extends TestComponent {
    get template() {
        return TEMPLATE2;
    }
}

export class TestComponent3 extends TestComponent {
    get template() {
        return {};
    }
}

/* eslint-disable no-unused-vars */
const TEMPLATE4 = function(IDOM) {
    return <test4-template-component>
        <svg>
            <circle stroke="black" stroke-width="3" fill="red" r={this.radius} />
        </svg>
    </test4-template-component>;
};

export class TestComponent4 extends TestComponent {
    get template() {
        return TEMPLATE4;
    }

    get properties() {
        return {
            radius: Number,
        };
    }
}

/* eslint-disable no-unused-vars */
const TEMPLATE5 = function(IDOM) {
    return <test5-template-component>
        <span class="dna-test">Hello Dna!</span>
        <test-vdom-placeholder />
        <figure is="test2-vdom-placeholder" />
    </test5-template-component>;
};

export class TestComponent5 extends TestComponent {
    get template() {
        return TEMPLATE5;
    }
}

export class TestPlaceholder extends BaseComponent {
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

export class Test2Placeholder extends BaseComponent {
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
