import { Shim, mix, prop, ComponentMixin, PropertiesMixin } from '../library.js';

export class TestComponent1 extends mix(new Shim(self.HTMLElement)).with(ComponentMixin, PropertiesMixin) {
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
        };
    }
}

export class TestComponent2 extends  mix(new Shim(self.HTMLElement)).with(ComponentMixin, PropertiesMixin) {
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
