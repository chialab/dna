import { Component, customElement, extend, property } from '@chialab/dna';

@customElement('x-test')
export class TestElement extends Component {
    @property() sample?: string;
}
new TestElement().sample = 'Hello';

@customElement('x-test2')
export class TestElement2 extends Component {
    // override native prop
    @property() title!: string;
}

@customElement('x-test3')
export class TestElement3 extends extend(HTMLDetailsElement) {
    // override native prop
    @property() open!: boolean;
}

@customElement('x-test4')
export class TestElement4 extends Component {
    // override native prop
    @property() inherit?: boolean;
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
    }) sample?: string;

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
