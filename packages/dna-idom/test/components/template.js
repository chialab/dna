import { prop, BaseComponent, IDOM } from '../../index.js';

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

const TEMPLATE1 = function() {
    return [
        this.title && [<h1>{this.title}</h1>,<br />],
        <span>Hello, {this.fullname}</span>,
    ];
};

export class TestComponent1 extends TestComponent {
    get template() {
        return TEMPLATE1;
    }
}

const TEMPLATE2 = function() {
    return <span class="dna-test">Hello DNA!</span>;
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

const TEMPLATE4 = function() {
    IDOM.elementOpen('svg');
    IDOM.elementOpenStart('circle');
    IDOM.attr('stroke', 'black');
    IDOM.attr('stroke-width', '3');
    IDOM.attr('fill', 'red');
    IDOM.attr('r', this.radius);
    IDOM.elementOpenEnd();
    IDOM.elementClose('circle');
    IDOM.elementClose('svg');
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

const TEMPLATE5 = function() {
    return [
        <span class="dna-test">Hello Dna!</span>,
        <test-vdom-placeholder />,
        <figure is="test2-vdom-placeholder" />,
    ];
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
