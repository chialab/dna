import { prop, BaseComponent } from '../../index.js';

class TestComponent extends BaseComponent {
    get properties() {
        return {
            name: prop.STRING.attribute(),
            title: prop.STRING.attribute(),
        };
    }
}

export class TestComponent1 extends TestComponent {
    static get observedAttributes() {
        return ['name', 'last-name', 'married', 'age', 'var'];
    }

    get properties() {
        return {
            lastName: prop.STRING.attribute('last-name'),
            married: prop.BOOLEAN,
            age: prop.NUMBER
                .validate((val) => val >= 0)
                .attribute()
                .observe('onAgeChanged'),
            var: prop.STRING.attribute(),
            type: prop.NUMBER.default(2),
        };
    }

    constructor() {
        super();
        this.ageChanged = 0;
    }

    onAgeChanged() {
        this.ageChanged += 1;
    }
}

export class TestComponent2 extends TestComponent {
    static get observedAttributes() {
        return ['title', 'id', 'alt', 'var', 'mine', 'my-var', 'my-var2', 'my-var3'];
    }

    get properties() {
        return {
            id: prop.STRING.attribute(),
            alt: prop.STRING.attribute(),
            var: prop.NUMBER.attribute(),
            mine: prop.NUMBER.attribute(),
            myVar: prop.BOOLEAN.attribute('my-var'),
            myVar2: prop.BOOLEAN.attribute('my-var2'),
            myVar3: prop.ANY
                .default(false)
                .attribute('my-var3')
                .getter(this.handleProp)
                .setter((val) => !!val)
                .dispatch('changed'),
        };
    }

    handleProp(val) {
        if (val) {
            return 'DNA Test';
        }
        return false;
    }
}
