import { register } from '../src/libs/dna.elements.js';
import { TestComponent } from './components/dna-properties.js';

register('test-properties-component', TestComponent);

/* globals describe, before, it, assert */
describe('Unit: DNAPropertiesComponent', () => {
    let elem;

    before((done) => {
        let temp = document.createElement('div');
        temp.innerHTML = `
            <test-properties-component
                name="Alan"
                last-name="Turing"
                married>
            </test-properties-component>`;
        document.body.appendChild(temp);
        setTimeout(() => {
            elem = temp.firstElementChild;
            done();
        }, 1000);
    });

    it('init element\'s properties', () => {
        assert.equal(elem.name, 'Alan');
        assert.equal(elem.lastName, 'Turing');
        assert.equal(elem.married, true);
    });

    it('observe properties changes', () => {
        let changedSingle = false;
        let changedAll = false;
        elem.observeProperty('age', () => {
            changedSingle = true;
        });
        elem.observeProperties(() => {
            changedAll = true;
        });
        elem.age = 41;
        assert(changedSingle);
        assert(changedAll);
    });
});
