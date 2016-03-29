'use strict';

const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');
const myBuilder = require('../node_modules/es6-workflow/lib/builder.js');

let cwd = process.cwd();
let packageJSON = require('../package.json');
let content = {};
let version = packageJSON.version;

packageJSON.build = {
    bundleName: 'dna.lite.js',
    globalName: 'DNA',
    rollup: true,
    sourceMaps: false,
};

// generate lite
myBuilder.run(packageJSON).then(() => {
    let code = fs.readFileSync(path.join(cwd, 'dist/dna.lite.js'), 'utf8');
    code = code.replace('__DNA__VERSION__', `'${version}'`);
    fs.writeFileSync(path.join(cwd, 'dist/dna.lite.js'), code);

    // generate standard
    content = UglifyJS.minify([
        path.join(cwd, 'node_modules/dna-polyfills/src/array/foreach.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/array/from.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/array/is-array.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/dom/class-list.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/object/set-prototype-of.js'),
        path.join(cwd, 'dist/dna.lite.js'),
    ]);

    fs.writeFileSync(path.join(cwd, 'dist/dna.js'), content.code);

    // generate full
    content = UglifyJS.minify([
        path.join(cwd, 'node_modules/virtual-dom/dist/virtual-dom.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/extra/custom-elements.js'),
        path.join(cwd, 'dist/dna.js'),
    ]);

    fs.writeFileSync(path.join(cwd, 'dist/dna.full.js'), content.code);


    // dist plugins
    let plugindDir = path.join(cwd, 'dist/plugins');
    if (!fs.existsSync(plugindDir)) {
        fs.mkdirSync(plugindDir);
    }

    [
        'dna.angular.js',
    ].forEach((plugin) => {
        fs.writeFileSync(
            path.join(plugindDir, plugin),
            UglifyJS.minify(path.join(cwd, `src/plugins/${plugin}`)).code);
    });
    // eslint-disable-next-line
    console.log('DNA generated!');
});
