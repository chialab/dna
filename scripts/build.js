var fs = require('fs'),
    path = require('path'),
    UglifyJS = require('uglify-js'),
    myBuilder = require('../node_modules/es6-workflow/lib/builder.js');

var cwd = process.cwd();
var packageJSON = require('../package.json');
var content = {};

packageJSON.build = {
    bundleName: 'dna.lite.js',
    globalName: 'DNA',
    rollup: true
};

myBuilder.run(packageJSON).then(function () {
    content = UglifyJS.minify([
        path.join(cwd, 'node_modules/dna-polyfills/src/array/foreach.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/array/from.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/array/is-array.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/dom/class-list.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/object/set-prototype-of.js'),
        path.join(cwd, 'dist/dna.lite.js')
    ], {
        outSourceMap: 'dna.js.map'
    });

    fs.writeFileSync(path.join(cwd, 'dist/dna.js'), content.code);
    fs.writeFileSync(path.join(cwd, 'dist/dna.js.map'), content.map);

    content = UglifyJS.minify([
        path.join(cwd, 'node_modules/virtual-dom/dist/virtual-dom.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/extra/custom-elements.js'),
        path.join(cwd, 'dist/dna.js')
    ], {
        outSourceMap: 'dna.full.js.map'
    });

    fs.writeFileSync(path.join(cwd, 'dist/dna.full.js'), content.code);
    fs.writeFileSync(path.join(cwd, 'dist/dna.full.js.map'), content.map);

    console.log('DNA generated!');
});
