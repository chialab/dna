import { DNABaseComponent, DNAComponents } from 'dna/components';
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

    get bindEvents() {
        return {
            'click button': 'grow'
        }
    }

    createdCallback() {
        this.growth = 0;
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
        this.innerHTML = this.render();
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
