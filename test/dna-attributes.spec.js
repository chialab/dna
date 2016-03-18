(function() {
    describe('Unit: DNAAttributesComponent', function() {
        var elem;

        before(function (done) {
            System.transpiler = 'plugin-babel';
            System.import('./test/dna-attributes.next.js').then(function (mod) {
                elem = new mod.Test();
                document.body.appendChild(elem);
                done();
            }, function (err) {
                done();
            });
        });

        it('check sync between property and attribute', function() {
            elem.title = 'DNA Test';
            assert.equal(elem.getAttribute('title'), 'DNA Test');
        });

        it('check sync between attribute and property', function() {
            elem.setAttribute('alt', 'DNA Test 2')
            assert.equal(elem.alt, 'DNA Test 2');
        });

        it('check sync between invented property and attribute', function() {
            elem.var = 1234;
            assert.equal(elem.getAttribute('var'), '1234');
        });

        it('check sync between invented attribute and property', function() {
            elem.setAttribute('mine', '1234')
            assert.equal(elem.mine, '1234');
        });

        it('check sync between invented composed property and attribute', function() {
            elem.myVar = true;
            assert.equal(elem.getAttribute('my-var'), '');
        });

        it('check sync between invented composed attribute and property', function() {
            elem.setAttribute('my-var2', 'true')
            assert.equal(elem.myVar2, 'true');
        });

        it('check sync between invented composed property with setter and attribute', function() {
            elem.myVar3 = true;
            assert.equal(elem.getAttribute('my-var3'), 'DNA Test');
        });

    });
}());
