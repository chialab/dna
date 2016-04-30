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
};

function build(file) {
    let base = path.basename(file);
    packageJSON.build.main = file;
    packageJSON.build.bundleName = base;
    return myBuilder.run(packageJSON).then(() => {
        let code = fs.readFileSync(path.join(cwd, `dist/${base}`), 'utf8');
        code = code.replace('this.__DNA__VERSION__', `'${version}'`);
        fs.writeFileSync(path.join(cwd, `dist/${base}`), code);
    });
}

Promise.all([
    'src/dna.js',
    'src/plugins/dna.angular.js',
    'src/plugins/dna.webcomponents.js',
    'src/plugins/dna.vdom-webcomponents.js',
].map(build)).then(() => {
    // eslint-disable-next-line
    console.log('DNA generated!');
}, (err) => {
    // eslint-disable-next-line
    console.error(err);
});
