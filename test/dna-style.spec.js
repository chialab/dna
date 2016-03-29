(function() {
    /* globals describe, before, it, assert */
    describe('Unit: DNAStyleComponent', function() {
        var elem1;
        var elem2;
        var elem3;

        before(function(done) {
            System.transpiler = 'plugin-babel';
            System.import('./test/dna-style.next.js').then(function(mod) {
                elem1 = new mod.Test1();
                elem2 = new mod.Test2();
                elem3 = new mod.Test3();
                done();
            }, function() {
                done();
            });
        });

        it('should handle `css` getter property as function', function() {
            document.body.appendChild(elem1);
            var style = window.getComputedStyle(elem1.querySelector('h1'));
            assert.equal(style.color, 'rgb(95, 158, 160)');
        });

        it('should handle `css` getter property as string', function() {
            document.body.appendChild(elem2);
            var style = window.getComputedStyle(elem2.querySelector('h1'));
            assert.equal(style.color, 'rgb(95, 158, 160)');
        });

        it('should handle `css` property as string', function() {
            document.body.appendChild(elem3);
            var style = window.getComputedStyle(elem3.querySelector('h1'));
            assert.equal(style.color, 'rgb(95, 158, 160)');
        });
    });
}());
