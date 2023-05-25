// eslint-disable-next-line import/no-unresolved
import { window, Component, customElement, extend, property, observe, type Prop } from '@chialab/dna';

@customElement('x-test')
export class TestElement extends Component {
    @property() sample?: Prop<string>;
}
new TestElement().sample = 'Hello';

@customElement('x-test2')
export class TestElement2 extends Component {
    // override native prop
    @property() title!: Prop<string>;
}

@customElement('x-test3')
export class TestElement3 extends extend(window.HTMLDetailsElement) {
    // override native prop
    @property() open!: Prop<boolean>;
}

@customElement('x-test4')
export class TestElement4 extends Component {
    // override native prop
    @property() inherit?: Prop<boolean>;
}

@customElement('x-test5')
export class TestElement5 extends TestElement4 { }
new TestElement5().inherit = true;

// context
export class TestElement6 extends Component {
    @property({
        type: String,
        observe(this: TestElement6, oldValue, newValue) {
            this.check(oldValue, newValue);
        },
    }) sample?: Prop<string>;

    @observe('sample')
    check(oldValue: String|undefined, newValue: String) {
        return `${oldValue}/${newValue}`;
    }
}

export class TestElement7 extends Component {
    static get properties() {
        return {
            sample: {
                type: String,
            },
        };
    }

    check() {}
}
