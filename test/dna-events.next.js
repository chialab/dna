import { DNAEventsComponent } from '../src/dna-events-component.next.js';
import { Register } from '../src/dna-library.next.js';

export class TestComponent extends DNAEventsComponent {
    static get events() {
        return {
            'click button': 'onClick',
            'change input': 'onInputChange',
            'customEvent': 'onCustomEvent'
        }
    }

    createdCallback() {
        super.createdCallback();
        this.innerHTML = `
            <button id="button">Click</button>
            <input type="text" id="input" value="Test">
        `;
    }

    attachedCallback() {
        super.attachedCallback();
        this.trigger('customEvent', {
            data: 1234
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

export var Test = Register('test-events-component', {
    prototype: TestComponent
});
