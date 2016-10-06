import { mix } from '../../src/helpers/mixins.js';
import { Component } from '../../src/dna-component.js';
import { PropertiesMixin } from '../../src/dna-properties-component.js';
import { prop } from '../../src/helpers/property.js';

export class TestComponent1 extends mix(Component).with(PropertiesMixin) {
    static get observedAttributes() {
        return ['name', 'last-name', 'married', 'age', 'var'];
    }

    get properties() {
        return {
            name: String,
            lastName: String,
            married: Boolean,
            age: Number,
            var: String,
        };
    }
}

export class TestComponent2 extends mix(Component).with(PropertiesMixin) {
    static get observedAttributes() {
        return ['title', 'id', 'alt', 'var', 'mine', 'my-var', 'my-var2', 'my-var3'];
    }

    get properties() {
        return {
            title: String,
            id: String,
            alt: String,
            var: Number,
            mine: Number,
            myVar: Boolean,
            myVar2: Boolean,
            myVar3: prop.ANY.default(false).before(this.handleProp),
        };
    }

    handleProp(val) {
        if (val) {
            return 'DNA Test';
        }
        return false;
    }
}
