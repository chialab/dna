'use strict';

var cwd = process.cwd();
var path = require('path');
var generator = require('../node_modules/es6-workflow/lib/gendoc.js').generate;

var files = [
    'dna-attributes-component.next.js',
    'dna-base-component.next.js',
    'dna-component.next.js',
    'dna-config.next.js',
    'dna-events-component.next.js',
    'dna-helper.next.js',
    'dna-library.next.js',
    'dna-mixed-component.next.js',
    'dna-style-component.next.js',
    'dna-template-component.next.js',
].map(function (f) {
    return path.join(cwd, 'src', f)
});
generator(files);
