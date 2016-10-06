import { mix } from '../../src/helpers/mixins.js';
import { Component } from '../../src/dna-component.js';
import { EventsMixin } from '../../src/dna-events-component.js';

export class TestComponent extends mix(Component).with(EventsMixin) {
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

    constructor() {
        super();
        this.innerHTML = `
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
