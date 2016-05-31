'use strict';

const fs = require('fs');
const path = require('path');
const myBuilder = require('../node_modules/es6-workflow/lib/builder.js');

let cwd = process.cwd();
let packageJSON = require('../package.json');
let version = packageJSON.version;

packageJSON.build = {
    globalName: 'DNA',
    rollup: true,
    sourceMaps: false,
    dest: 'lib',
};

function build(file) {
    let base = path.basename(file);
    packageJSON.build.main = file;
    packageJSON.build.bundleName = base;
    return myBuilder.run(packageJSON).then(() => {
        let code = fs.readFileSync(path.join(cwd, `lib/${base}`), 'utf8');
        code = code.replace('this.__DNA__VERSION__', `'${version}'`);
        fs.writeFileSync(path.join(cwd, `lib/${base}`), code);
    });
}

Promise.all([
    'src/dna.js',
    'src/dna-next.js',
    'src/plugins/dna.angular.js',
    'src/plugins/dna.elements.js',
    'src/plugins/dna.vdom.js',
    'src/plugins/dna.vdom-elements.js',
].map(build)).then(() => {
    // eslint-disable-next-line
    console.log('DNA generated!');
}, (err) => {
    // eslint-disable-next-line
    console.error(err);
});
