import './dna-properties.next.js';

/* globals describe, before, it, assert */
describe('Unit: DNAPropertiesComponent', () => {
    let elem;

    before((done) => {
        let temp = document.createElement('div');
        temp.innerHTML = `
            <test-properties-component
                name="Alan"
                last-name="Turing">
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
    });
});
