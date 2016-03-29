(function() {
    /* globals describe, before, it, assert */
    describe('Unit: DNAPropertiesComponent', function() {
        var elem;

        before(function(done) {
            System.transpiler = 'plugin-babel';
            System.import('./test/dna-properties.next.js').then(function(mod) {
                var temp = document.createElement('div');
                temp.innerHTML = '<test-properties-component name="Alan" last-name="Turing"></test-properties-component>';
                document.body.appendChild(temp);
                setTimeout(function() {
                    elem = temp.firstElementChild;
                    done();
                }, 1000);
            }, function() {
                done();
            });
        });

        it('init element\'s properties', function() {
            assert.equal(elem.name, 'Alan');
            assert.equal(elem.lastName, 'Turing');
        });
    });
}());
