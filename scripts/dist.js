var fs = require('fs'),
    path = require('path'),
    Concat = require('concat-with-sourcemaps');

var concat = new Concat(true, 'all.js', '\n');
var cwd = process.cwd();

concat.add('virtual-dom.js', fs.readFileSync(path.join(cwd, 'node_modules/virtual-dom/dist/virtual-dom.js'), 'utf8'));
concat.add('dna-custom-elements.js', fs.readFileSync(path.join(cwd, 'node_modules/dna-polyfills/src/extra/custom-elements.js'), 'utf8'));
concat.add('dna-components.js', fs.readFileSync(path.join(cwd, 'dist/dna-components.js'), 'utf8'), fs.readFileSync(path.join(cwd, 'dist/dna-components.js.map'), 'utf8'));


fs.writeFileSync(path.join(cwd, 'dist/dna-components.full.js'), concat.content);
