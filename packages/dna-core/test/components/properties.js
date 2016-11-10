import { shim, mix, prop, MIXINS } from '../../index.js';

export class TestComponent1 extends mix(shim(self.HTMLElement)).with(MIXINS.ComponentMixin, MIXINS.PropertiesMixin) {
    static get observedAttributes() {
        return ['name', 'last-name', 'married', 'age', 'var'];
    }

    get properties() {
        return {
            name: prop(String).attribute(),
            lastName: prop(String).attribute('last-name'),
            married: prop(Boolean).attribute(),
            age: prop(Number).attribute(),
            var: prop(String).attribute(),
            type: prop(Number).default(2),
        };
    }
}

export class TestComponent2 extends  mix(shim(self.HTMLElement)).with(MIXINS.ComponentMixin, MIXINS.PropertiesMixin) {
    static get observedAttributes() {
        return ['title', 'id', 'alt', 'var', 'mine', 'my-var', 'my-var2', 'my-var3'];
    }

    get properties() {
        return [{
            title: prop(String).attribute(),
            id: prop(String).attribute(),
            alt: prop(String).attribute(),
            var: prop(Number).attribute(),
            mine: prop(Number).attribute(),
            myVar: prop(Boolean).attribute('my-var'),
            myVar2: prop(Boolean).attribute('my-var2'),
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
