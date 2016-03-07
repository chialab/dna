var fs = require('fs'),
    path = require('path'),
    UglifyJS = require('uglify-js'),
    myBuilder = require('../node_modules/es6-workflow/lib/builder.js');

var cwd = process.cwd();
var packageJSON = require('../package.json');
var content = {};
var version = packageJSON.version;

packageJSON.build = {
    bundleName: 'dna.lite.js',
    globalName: 'DNA',
    rollup: true,
    sourceMaps: false
};

// generate lite
myBuilder.run(packageJSON).then(function () {
    var code = fs.readFileSync(path.join(cwd, 'dist/dna.lite.js'), 'utf8');
    code = code.replace('__DNA__VERSION__', "'" + version + "'");
    fs.writeFileSync(path.join(cwd, 'dist/dna.lite.js'), code);

    // generate standard
    content = UglifyJS.minify([
        path.join(cwd, 'node_modules/dna-polyfills/src/array/foreach.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/array/from.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/array/is-array.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/dom/class-list.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/object/set-prototype-of.js'),
        path.join(cwd, 'dist/dna.lite.js')
    ]);

    fs.writeFileSync(path.join(cwd, 'dist/dna.js'), content.code);

    // generate full
    content = UglifyJS.minify([
        path.join(cwd, 'node_modules/virtual-dom/dist/virtual-dom.js'),
        path.join(cwd, 'node_modules/dna-polyfills/src/extra/custom-elements.js'),
        path.join(cwd, 'dist/dna.js')
    ]);

    fs.writeFileSync(path.join(cwd, 'dist/dna.full.js'), content.code);

    console.log('DNA generated!');
});
