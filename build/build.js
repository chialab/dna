'use strict';

const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const minify = require('uglify-js').minify;
const fs = require('fs');

let packageJSON = require('../package.json');
let version = packageJSON.version;

rollup({
    entry: 'src/dna.js',
    plugins: [
        babel({
            presets: 'es2015-rollup',
            compact: true,
            plugins: [
                ['transform-es2015-classes', {
                    loose: true,
                }],
            ],
        }),
        uglify({}, minify),
    ],
    external: [],
}).then((bundle) => {
    let result = bundle.generate({
        sourceMap: true,
        sourceMapFile: 'dna.map',
        moduleName: 'DNA',
        format: 'umd',
        globals: {
            'google/incremental-dom': 'IncrementalDOM',
            'skin-template/src/template.js': 'Skin',
        },
    });
    fs.stat('dist', (err) => {
        if (err) {
            fs.mkdirSync('dist');
        }
        result.code = result.code.replace('self.__DNA__VERSION__', `'${version}'`);
        fs.writeFileSync('dist/dna.js', `${result.code}
//# sourceMappingURL=dna.js.map`);
        fs.writeFileSync('dist/dna.js.map', result.map.toString());
    });
}).catch((err) => {
    console.log(err);
});
