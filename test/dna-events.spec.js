(function () {
    describe('Unit: DNAEventsComponent', function() {
        var elem;

        before(function (done) {
            System.transpiler = 'plugin-babel';
            System.import('./test/dna-events.next.js').then(function (mod) {
                elem = new mod.Test();
                document.body.appendChild(elem);
                done();
            }, function (err) {
                done();
            });
        });

        it('should track custom event on element', function() {
            assert.equal(elem.customElement, elem);
            assert.equal(elem.custom instanceof Event, true);
            assert.equal(elem.custom.detail.data, 1234);
        });

        it('should track click on button element', function() {
            var button = elem.querySelector('button');
            button.click();
            assert.equal(elem.clickedElement, button);
            assert.equal(elem.clicked instanceof Event, true);
            assert.equal(elem.clicked.type, 'click');
        });

        it('should track changes on input element', function() {
            var input = elem.querySelector('input');
            input.value = 'DNA Tests';
            elem.trigger.call(input, 'change');
            assert.equal(elem.changedElement, input);
            assert.equal(elem.changed instanceof Event, true);
            assert.equal(elem.changed.type, 'change');
        });

    });
})();
