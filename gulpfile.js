/* eslint-env node */

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

const gulp = require('gulp');
const del = require('del');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rollup = require('rollup-stream');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const karma = require('karma');
const path = require('path');
const glob = require('glob');

const env = process.env;
const srcs = ['packages/**/*.js'];
const karmaConfig = path.resolve('./karma.conf.js');

const packages = glob.sync('packages/*/').map((pkg) => path.basename(pkg));

const entries = [];
packages.forEach((pkg) => {
    glob.sync(path.join('packages', pkg, 'index.js'))
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
    let rollupConfig = require('./rollup.config.js');
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
        let dirname = path.dirname(entry);
        let distFile = path.basename(entry).replace('index', path.basename(dirname));
        let distPath = path.join(dirname, 'dist');
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

gulp.task('lint', lint);
gulp.task('unit', ['lint'], unit);
gulp.task('unit-server', ['lint'], unitServer);
gulp.task('unit-watch', ['lint'], unitWatch);
gulp.task('js-min', jsMin);
gulp.task('js-min-watch', ['js-min'], jsMinWatch);
gulp.task('dist', ['lint', 'unit'], jsMin);

gulp.task('default', ['build']);
