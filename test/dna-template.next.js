import { DNAMixedComponent } from '../src/dna-mixed-component.next.js';
import { DNAPropertiesComponent } from '../src/dna-properties-component.next.js';
import { DNATemplateComponent } from '../src/dna-template-component.next.js';

class TestComponent extends DNAMixedComponent {
    static get behaviors() {
        return [DNAPropertiesComponent, DNATemplateComponent];
    }
    static get properties() {
        return ['name', 'lastName'];
    }
    get fullname() {
        return `${this.name ? `${this.name} ` : ''}${this.lastName || ''}`;
    }
}

export class TestComponent1 extends TestComponent {
    static get template() {
        return function() {
            return `Hello, ${this.fullname}`;
        };
    }
}

export class TestComponent2 extends TestComponent {
    static get template() {
        return '<span>Hello DNA!</span>';
    }
}

export class TestComponent3 extends TestComponent {}

TestComponent3.template = '<span>Hello DNA!</span>';
