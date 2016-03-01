var myBuilder = require('../node_modules/es6-workflow/lib/builder.js');
var packageJSON = require('../package.json');

packageJSON.build = {
    bundleName: 'dna.js',
    globalName: 'DNA',
    rollup: true
};

myBuilder.run(packageJSON);
