(function () {
    describe('Unit: DNALibrary', function() {
        var DNALibrary, DNABaseComponent;

        before(function (done) {
            System.transpiler = 'plugin-babel';
            System.import('./src/dna-library.next.js').then(function (module) {
                DNALibrary = module;
                System.import('./src/dna-base-component.next.js').then(function (module) {
                    DNABaseComponent = module.DNABaseComponent;
                    done();
                }, function (err) {
                    done();
                });
            }, function (err) {
                done();
            });
        });

        it('should extend a prototype', function() {
            var superClass = function () {};
            superClass.attributes = ['name', 'lastName'];
            superClass.prototype = {
                createdCallback: function () {
                    this.name = 'Alan';
                    this.lastName = 'Turing';
                },
                get fullName() {
                    return this.name + ' ' + this.lastName;
                },
                reverseName: function () {
                    return this.fullName.split('').reverse().join('');
                }
            }
            var subClass = function () {};
            subClass.prototype = {
                createdCallback: function () {
                    this.age = '43';
                    return superClass.prototype.createdCallback.call(this);
                },
                get age() {
                    return this.__age;
                },
                set age(a) {
                    return this.__age = parseInt(a + '');
                }
            }
            var superComponent = DNALibrary.Extend(DNABaseComponent, superClass);
            var subComponent = DNALibrary.Extend(superComponent, subClass);
            var ctr = DNALibrary.Register('tets-library-component', {
                prototype: subComponent
            });
            var instance = new ctr();
            assert.equal(instance.name, 'Alan');
            assert.equal(instance.lastName, 'Turing');
            assert.equal(instance.fullName, 'Alan Turing');
            assert.equal(instance.reverseName(), 'gniruT nalA');
            assert.equal(instance.age, 43);
        });

    });
})();
