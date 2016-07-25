'use strict';

const cwd = process.cwd();
const path = require('path');
const generator = require('../node_modules/es6-workflow/lib/gendoc.js').generate;

let files = [
    'dna-attributes-component.js',
    'dna-base-component.js',
    'dna-events-component.js',
    'dna-mixed-component.js',
    'dna-properties-component.js',
    'dna-style-component.js',
    'dna-template-component.js',
    'vdom/dna-vdom-component.js',
    'vdom/dna-vdom-base-component.js',
].map((f) => path.join(cwd, 'src', f));

generator(files);
