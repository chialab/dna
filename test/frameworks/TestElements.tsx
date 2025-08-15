import { Component, customElement, define, type EventHandler, fires, HTML, property } from '@chialab/dna';

@customElement('test-frameworks-title')
export class TestElementTitle extends Component {
    render() {
        return (
            <span class="title">
                <slot>Untitled</slot>
            </span>
        );
    }
}

@customElement('test-frameworks-card')
export class TestElementCard extends Component {
    render() {
        return <slot />;
    }
}

@customElement('test-frameworks-1')
export class TestElement1 extends Component {
    render() {
        return (
            <>
                <span>{this.childNodesBySlot(null)}</span>
                <div>{this.childNodesBySlot('children')}</div>
            </>
        );
    }
}

@customElement('test-frameworks-2')
export class TestElement2 extends Component {
    render() {
        return (
            <>
                <div class="layout-header">
                    <test-frameworks-title>
                        <slot name="title" />
                    </test-frameworks-title>
                </div>
                <div class="layout-body">
                    <slot />
                </div>
            </>
        );
    }
}

export class TestElement3 extends Component {
    @property()
    collapsed = false;

    render() {
        if (this.collapsed) {
            return <slot />;
        }
        return (
            <test-frameworks-card>
                <slot />
            </test-frameworks-card>
        );
    }
}

@customElement('test-frameworks-4')
export class TestElement4 extends Component {
    @property()
    switch = false;

    render() {
        return (
            <>
                <div class="parent-1">{this.switch ? <slot /> : 'Empty'}</div>
                <div class="parent-2">{!this.switch ? <slot /> : 'Empty'}</div>
            </>
        );
    }
}

@customElement('test-frameworks-5')
export class TestElement5 extends Component {
    @property({
        event: 'stringchange',
    })
    stringProp?: string;

    @property()
    booleanProp?: boolean;

    @property()
    numericProp?: number;

    @property()
    objectProp?: object;

    @property()
    defaultValue = 0;

    @fires()
    onstringchange?: EventHandler<CustomEvent<string>>;

    render() {
        return (
            <>
                <slot />
                <span class="text">{this.stringProp}</span>
                {this.booleanProp ? <span class="boolean">true</span> : ''}
                <span class="number">{this.numericProp}</span>
                <span class="object">{JSON.stringify(this.objectProp)}</span>
                <slot name="icon" />
            </>
        );
    }
}

@customElement('test-frameworks-6', {
    extends: 'a',
})
export class TestElement6 extends HTML.Anchor {
    @property({
        event: 'stringchange',
    })
    stringProp?: string;

    @property()
    booleanProp?: boolean;

    @property()
    numericProp?: number;

    @property()
    objectProp?: object;

    @property()
    defaultValue = 0;

    @fires()
    onstringchange?: EventHandler<CustomEvent<string>>;

    render() {
        return (
            <>
                <slot />
                <span class="text">{this.stringProp}</span>
                {this.booleanProp ? <span class="boolean">true</span> : ''}
                <span class="number">{this.numericProp}</span>
                <span class="object">{JSON.stringify(this.objectProp)}</span>
                <slot name="icon" />
            </>
        );
    }
}

export function defineTestElements() {
    return define('test-frameworks-3', TestElement3);
}

declare module '@chialab/dna' {
    namespace JSX {
        interface CustomElements {
            'test-frameworks-1': TestElement1;
            'test-frameworks-2': TestElement2;
            'test-frameworks-3': TestElement3;
            'test-frameworks-4': TestElement4;
            'test-frameworks-5': TestElement5;
            'test-frameworks-6': TestElement6 & {
                extends: 'a';
            };
        }
    }
}
