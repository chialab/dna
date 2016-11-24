/**
 * Copyright 2016 Chialab. All Rights Reserved.
 *
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var gulp = require('gulp');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rollup = require('rollup-stream');
var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var includePaths = require('rollup-plugin-includepaths');
var multiEntry = require('rollup-plugin-multi-entry');
var eslint = require('gulp-eslint');
var sourcemaps = require('gulp-sourcemaps');
var karma = require('karma');
var path = require('path');
var fs = require('fs');
var jsdoc = require('gulp-jsdoc3');
var toMarkdown = require('gulp-to-markdown');
var glob = require('glob');
var exec = require('child_process').exec;

var env = process.env;
var moduleName = 'DNA';
var srcs = ['packages/**/*.js'];
var karmaConfig = path.resolve('./karma.conf.js');
var TMP_DOC = './.tmp-jsdoc/';
var DOC = './api/';

var packages = glob.sync('packages/*/').map(function(pkg) {
    return path.basename(pkg);
});
var packageNames = packages.map(function(pkg) {
    return pkg.replace(/^dna\-/, '@dnajs/');
});
var entries = packages.map(function(pkg) {
    var fileName = path.join('packages', pkg, 'index.js');
    if (fs.existsSync(fileName)) {
        return fileName;
    }
}).filter(function(pkg) {
    return !!pkg;
});

function cleanDoc() {
    return del([TMP_DOC, DOC]);
}

function unit(done) {
    env.NODE_ENV = 'test';
    new karma.Server({
        configFile: karmaConfig,
        singleRun: true,
    }, done).start();
}

function unitServer(done) {
    env.NODE_ENV = 'test';
    new karma.Server({
        configFile: karmaConfig,
        browsers: [],
        singleRun: false,
    }, done).start();
}

function unitWatch(done) {
    env.NODE_ENV = 'test';
    new karma.Server({
        configFile: karmaConfig,
        browsers: ['Chrome', 'Firefox'],
    }, done).start();
}

function lint() {
    return gulp.src(srcs)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function bundle(format, entryFileName) {
    return rollup({
        entry: entryFileName,
        sourceMap: true,
        plugins: [
            multiEntry(),
            includePaths({
                paths: ['packages', 'node_modules'],
            }),
            env.min === 'true' ? uglify({
                output: {
                    comments: /@license/,
                },
            }) : {},
            babel(),
        ],
        format,
        moduleName,
    });
}

function jsMinWatch() {
    gulp.watch(srcs, ['js-min']);
}

function jsMin() {
    env.NODE_ENV = 'production';
    env.min = true;

    return entries.map((entry) => {
        var dirname = path.dirname(entry);
        var distFile = path.basename(dirname) + '.js';
        var distPath = path.join(dirname, 'dist');
        // add observer
        var observer = path.join(dirname, 'observer.js');
        if (fs.existsSync(observer)) {
            entry = [entry, observer];
        }
        return del([distPath]).then(() =>
            bundle('umd', entry)
                .pipe(source(distFile))
                .pipe(buffer())
                .pipe(sourcemaps.init({
                    loadMaps: true,
                }))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(distPath))
        );
    });
}

function jsDoc(cb) {
    // return cleanDoc()
        // .then(function() {
        gulp.src(srcs, { read: false })
            .pipe(jsdoc({
                templates: {
                    default: {
                        mainPageTitle: 'DNA',
                        includeDate: false,
                        useLongnameInNav: true,
                    }
                },
                opts: {
                    template: path.resolve('./docstemplate'),
                    destination: TMP_DOC,
                },
            }, cb));
        // });
}

function docMD() {
    function clearSpaces(str) {
        return str.replace(/^\s*/, '')
            .replace(/\s*$/, '');
    }

    return gulp.src(path.join(TMP_DOC, '**/*.html'))
        .pipe(toMarkdown({
            gfm: true,
            converters: [
                { filter: ['div', 'section', 'header', 'article', 'footer', 'nav'], replacement: function(content) { return content; } },
                { filter: ['h1'], replacement: function(content) { return ''; } },
                { filter: ['h2'], replacement: function(content) { return '# ' + content; } },
                { filter: ['dl'], replacement: function(content) { return '\n\n' + content; } },
                { filter: ['td'], replacement: function(content, node) {
                    return '| ' +
                        clearSpaces(content).replace(/\s*\|\s*/g, ', ') +
                        ' ' +
                        (!node.nextElementSibling ? '|' : '');
                    }
                },
                { filter: ['dt'], replacement: function(content, node) {
                        return '**' + clearSpaces(content) + '** ';
                    },
                },
                { filter: ['dd'], replacement: function(content, node) {
                        if (node.className === 'tag-source') {
                            return content.replace(/^\*\s*/m, '> ');
                        }
                        return clearSpaces(content) + '\n';
                    },
                },
                { filter: function(node) { return node.className === 'type-signature' }, replacement: function(content) { return content ? '*' + clearSpaces(content) + '*' : ''; } },
                { filter: function(node) { return node.className === 'ancestors' }, replacement: function(content) { return content; } },
                { filter: function(node) { return node.className === 'signature' }, replacement: function(content) { return content; } },
                { filter: function(node) { return node.className === 'param-type' }, replacement: function(content) { return content; } },
            ],
        }))
        .pipe(gulp.dest(DOC));
}

function symlinks(f, t) {
    t = t.replace('@dnajs/', '');
    if (!fs.existsSync('./node_modules/@dnajs')) {
        fs.mkdirSync('./node_modules/@dnajs');
    }
    if (!fs.existsSync('./node_modules/@dnajs/' + t)) {
        fs.symlinkSync(
            path.resolve('./packages/' + f),
            './node_modules/@dnajs/' + t,
            'dir'
        );
    }
}

const installing = {};

function loadModule(name) {
    if (!installing[name]) {
        installing[name] = new Promise(function(resolve, reject) {
            exec('npm install ' + name, function(error) {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
    return installing[name];
}

function dependencies() {
    var sym = [];
    return Promise.all(
        packages.map(function(pkg) {
            var json = path.join('packages', pkg, 'package.json');
            if (fs.existsSync(json)) {
                var data = require(path.resolve(json));
                if (data.dependencies) {
                    let loads = [];
                    for (let k in data.dependencies) {
                        if (packageNames.indexOf(k) !== -1) {
                            sym.push(k);
                        } else {
                            loads.push(loadModule(k + '@' + data.dependencies[k]));
                        }
                    }
                    return Promise.all(loads);
                }
            }
            return Promise.resolve();
        })
    ).then(function() {
        sym.forEach(function(packageName) {
            let io = packageNames.indexOf(packageName);
            let packagePath = packages[io];
            if (packagePath) {
                symlinks(packagePath, packageName);
            }
        });
        return Promise.resolve();
    });
}

function publish(path, beta) {
    return new Promise(function(resolve, reject) {
        exec('cd ' + path + ' && npm publish --access public' + (beta ? ' --tag beta' : ''), function(error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

function publishModules(beta) {
    return Promise.all(
        packages.map(function(pkg) {
            var fullPath = path.resolve(path.join('packages', pkg));
            return publish(fullPath, beta);
        })
    );
}

gulp.task('unit', unit);
gulp.task('unit-server', unitServer);
gulp.task('unit-watch', unitWatch);
gulp.task('lint', lint);
gulp.task('js-min', jsMin);
gulp.task('js-min-watch', ['js-min'], jsMinWatch);
gulp.task('dist', ['lint', 'unit'], jsMin);
gulp.task('jsdocs', jsDoc);
gulp.task('docs', ['jsdocs'], docMD);
gulp.task('dependencies', dependencies);
gulp.task('post-install', ['dependencies']);
gulp.task('publish', function() {
    return publishModules();
});
gulp.task('publish-beta', function() {
    return publishModules(true);
});

gulp.task('default', ['build']);
