import { shim, mix, prop, MIXINS } from '../../index.js';

export class TestComponent1 extends mix(shim(self.HTMLElement)).with(MIXINS.ComponentMixin, MIXINS.PropertiesMixin) {
    static get observedAttributes() {
        return ['name', 'last-name', 'married', 'age', 'var'];
    }

    get properties() {
        return {
            name: prop.STRING.attribute(),
            lastName: prop.STRING.attribute('last-name'),
            married: prop.BOOLEAN.attribute(),
            age: prop.NUMBER.attribute(),
            var: prop.STRING.attribute(),
            type: prop.NUMBER.default(2),
        };
    }
}

export class TestComponent2 extends  mix(shim(self.HTMLElement)).with(MIXINS.ComponentMixin, MIXINS.PropertiesMixin) {
    static get observedAttributes() {
        return ['title', 'id', 'alt', 'var', 'mine', 'my-var', 'my-var2', 'my-var3'];
    }

    get properties() {
        return [{
            title: prop.STRING.attribute(),
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
        }];
    }

    handleProp(val) {
        if (val) {
            return 'DNA Test';
        }
        return false;
    }
}
