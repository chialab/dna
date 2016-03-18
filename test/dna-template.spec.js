(function () {
    describe('Unit: DNATemplateComponent', function() {
        var elem1, elem2, elem3;

        before(function (done) {
            System.transpiler = 'plugin-babel';
            System.import('./test/dna-template.next.js').then(function (mod) {
                elem1 = new mod.Test1();
                elem2 = new mod.Test2();
                elem3 = new mod.Test3();
                done();
            }, function (err) {
                done();
            });
        });

        it('should handle `template` getter property as function with interpolation', function() {
            document.body.appendChild(elem1);
            assert.equal(elem1.innerHTML, 'Hello, ');
            elem1.name = 'Alan';
            elem1.lastName = 'Turing';
            assert.equal(elem1.innerHTML, 'Hello, Alan Turing');
        });

        it('should handle `template` getter property as string', function() {
            document.body.appendChild(elem2);
            assert.equal(elem2.innerHTML, '<span>Hello DNA!</span>');
        });

        it('should handle `template` property as string', function() {
            document.body.appendChild(elem3);
            assert.equal(elem3.innerHTML, '<span>Hello DNA!</span>');
        });

    });
})();
