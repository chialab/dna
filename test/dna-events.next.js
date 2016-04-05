import { DNAEventsComponent } from '../src/dna-events-component.next.js';

export class TestComponent extends DNAEventsComponent {
    static get events() {
        return {
            customEvent: 'onCustomEvent',
            'click button': 'onClick',
            'click span': function(ev, span) {
                this.clickedSpan = span;
                this.clickedSpanEvent = ev;
            },
            'change input': 'onInputChange',
        };
    }

    createdCallback() {
        super.createdCallback();
        this.innerHTML = `
            <button id="button">Click</button>
            <input type="text" id="input" value="Test" />
            <span>Hold me</span>
        `;
    }

    attachedCallback() {
        super.attachedCallback();
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
