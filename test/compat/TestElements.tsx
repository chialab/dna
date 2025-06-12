import { Component, customElement, define, property } from '@chialab/dna';

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
