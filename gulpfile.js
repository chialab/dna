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
var eslint = require('gulp-eslint');
var sourcemaps = require('gulp-sourcemaps');
var karma = require('karma');
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var exec = require('child_process').exec;

var env = process.env;
var moduleName = 'DNA';
var srcs = ['packages/**/*.js'];
var karmaConfig = path.resolve('./karma.conf.js');

var packages = glob.sync('packages/*/').map(function(pkg) {
    return path.basename(pkg);
});
var packageNames = packages.map(function(pkg) {
    return pkg.replace(/^dna\-/, '@dnajs/');
});
var entries = [];
packages.forEach(function(pkg) {
    glob.sync(path.join('packages', pkg, 'index*.js'))
        .forEach((path) => {
            entries.push(path);
        });
});

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
    delete require.cache[path.resolve('./rollup.config.js')];
    var rollupConfig = require('./rollup.config.js');
    rollupConfig.entry = entryFileName;
    rollupConfig.sourceMap = true;
    rollupConfig.format = format;
    return rollup(rollupConfig);
}

function jsMinWatch() {
    gulp.watch(srcs, ['js-min']);
}

function jsMin() {
    env.NODE_ENV = 'production';
    env.min = true;

    return entries.map((entry) => {
        var dirname = path.dirname(entry);
        var distFile = path.basename(entry).replace('index', path.basename(dirname));
        var distPath = path.join(dirname, 'dist');
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
gulp.task('publish', function() {
    return publishModules();
});
gulp.task('publish-beta', function() {
    return publishModules(true);
});

gulp.task('default', ['build']);
