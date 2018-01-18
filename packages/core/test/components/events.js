import { BaseComponent } from '../../index.js';

export class TestComponent extends BaseComponent {
    get events() {
        return {
            'customEvent': 'onCustomEvent',
            'click button': 'onClick',
            'click span'(ev, span) {
                this.clickedSpan = span;
                this.clickedSpanEvent = ev;
            },
            'change input': 'onInputChange',
        };
    }

    get template() {
        return `
            <button id="button">Click</button>
            <input type="text" id="input" value="Test" />
            <span>Hold me</span>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.trigger('customEvent', {
            data: 1234,
        });
    }

    onClick(ev, element) {
        this.clicked = ev;
        this.clickedElement = element;
    }

    onInputChange(ev, element) {
        this.changed = ev;
        this.changedElement = element;
    }

    onCustomEvent(ev, element) {
        this.custom = ev;
        this.customElement = element;
    }
}


export class TestInvalidComponent extends BaseComponent {
    get events() {
        return {
            customEvent: 'undefined',
        };
    }
}

export class TestPropagationComponent extends BaseComponent {
    get template() {
        return `<div class="child1">
            <div class="child2">
                <div class="child4">
                    <div class="child5"></div>
                </div>
            </div>
            <div class="child3"></div>
        </div>`;
    }
}
