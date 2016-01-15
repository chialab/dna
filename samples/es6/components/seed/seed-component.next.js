import { DNABaseComponent } from 'dna/components';
import template from './seed-component.html';
import css from './seed-component.css';

export class SeedComponent extends DNABaseComponent {
    static get tagName() {
        return 'seed-component';
    }

    static get template() {
        return template;
    }

    static get css() {
        return css;
    }

    static get attributes() {
        return ['owner', 'type'];
    }

    static get bindEvents() {
        return {
            'click button': 'grow'
        }
    }

    get type() {
        return this.__type || 'Opium';
    }

    set type(t) {
        return this.__type = t;
    }

    get growth() {
        return this.__growth || 0;
    }

    set growth(val) {
        return this.__growth = val;
    }

    createdCallback() {
        DNABaseComponent.prototype.createdCallback.apply(this, arguments);
    }

    attachedCallback() {
        DNABaseComponent.prototype.attachedCallback.apply(this, arguments);
        this.style.width = this.parentNode.offsetWidth + 'px';
    }

    grow() {
        if (this.growth < this.states.length - 1) {
            this.growth++;
        }
    }

    isDead() {
        return this.state === 'dead :(';
    }

    get states() {
        return ['planted', 'sprouted', 'flowered', 'wilted', 'dead :('];
    }

    get state() {
        return this.states[this.growth];
    }
}
