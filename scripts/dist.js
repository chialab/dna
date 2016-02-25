var fs = require('fs'),
    path = require('path'),
    UglifyJS = require('uglify-js');

var cwd = process.cwd();

var content = UglifyJS.minify([
    path.join(cwd, 'node_modules/virtual-dom/dist/virtual-dom.js'),
    path.join(cwd, 'node_modules/dna-polyfills/src/extra/custom-elements.js'),
    path.join(cwd, 'dist/dna-components.js')
], {
    outSourceMap: 'dna-components.full.js.map'
});

fs.writeFileSync(path.join(cwd, 'dist/dna-components.full.js'), content.code);
fs.writeFileSync(path.join(cwd, 'dist/dna-components.full.js.map'), content.map);
