import { Component, customElement, define, type EventHandler, fires, HTML, property } from '@chialab/dna';

@customElement('test-compat-1')
export class TestCompat1 extends Component {
    render() {
        return (
            <>
                <span>{this.childNodesBySlot(null)}</span>
                <div>{this.childNodesBySlot('children')}</div>
            </>
        );
    }
}

@customElement('test-compat-2-title')
export class TestCompatTitle2 extends Component {
    render() {
        return (
            <span class="title">
                <slot>Untitled</slot>
            </span>
        );
    }
}

@customElement('test-compat-2')
export class TestCompat2 extends Component {
    render() {
        return (
            <>
                <div class="layout-header">
                    <test-compat-2-title>
                        <slot name="title" />
                    </test-compat-2-title>
                </div>
                <div class="layout-body">
                    <slot />
                </div>
            </>
        );
    }
}

@customElement('test-compat-card-3')
export class TestCompatCard3 extends Component {
    render() {
        return <slot />;
    }
}

export class TestCompat3 extends Component {
    @property()
    collapsed = false;

    render() {
        if (this.collapsed) {
            return <slot />;
        }
        return (
            <test-compat-card-3>
                <slot />
            </test-compat-card-3>
        );
    }
}

export function defineTestCompat3() {
    return define('test-compat-3', TestCompat3);
}

@customElement('test-compat-4')
export class TestCompat4 extends Component {
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

@customElement('test-compat-5')
export class TestCompat5 extends Component {
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

@customElement('test-compat-6', {
    extends: 'a',
})
export class TestCompat6 extends HTML.Anchor {
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

declare module '@chialab/dna' {
    namespace JSX {
        interface CustomElements {
            'test-compat-1': TestCompat1;
            'test-compat-2': TestCompat2;
            'test-compat-3': TestCompat3;
            'test-compat-4': TestCompat4;
            'test-compat-5': TestCompat5;
            'test-compat-6': TestCompat6 & {
                extends: 'a';
            };
        }
    }
}
