'use strict';

const cwd = process.cwd();
const path = require('path');
const generator = require('../node_modules/es6-workflow/lib/gendoc.js').generate;

let files = [
    'dna-attributes-component.js',
    'dna-base-component.js',
    'dna-component.js',
    'dna-config.js',
    'dna-events-component.js',
    'dna-helper.js',
    'dna-mixed-component.js',
    'dna-properties-component.js',
    'dna-style-component.js',
    'dna-template-component.js',
    'extra/dna-vdom-component.js',
    'extra/dna-vdom-base-component.js',
].map((f) => path.join(cwd, 'src', f));

generator(files);
