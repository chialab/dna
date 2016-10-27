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
var eslint = require('gulp-eslint');
var sourcemaps = require('gulp-sourcemaps');
var karma = require('karma');
var path = require('path');
var fs = require('fs');
var jsdoc = require('gulp-jsdoc3');

var env = process.env;
var entries = ['packages/dna/index.js', 'packages/dna/dna-idom.js', 'packages/dna/dna-mutations.js'];
var moduleName = 'DNA';
var srcs = entries.concat(['src/**/*.js']);
var karmaConfig = path.resolve('./karma.conf.js');

function clean() {
    return del(['dist/']);
}

function cleanDoc() {
    return del(['docs/']);
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

    return entries.map((entry) =>
        bundle('umd', entry)
            .pipe(source(entry.replace('packages/dna/', '')))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true,
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist'))
    );
}

function jsDist() {
    return clean()
        .then(jsMin);
}

function jsDoc() {
    return cleanDoc()
        .then(function() {
            return gulp.src(['README.md'].concat(srcs), { read: false })
                .pipe(jsdoc({
                    opts: {
                        destination: './docs',
                    },
                }));
        });
}

gulp.task('clean', clean);
gulp.task('unit', unit);
gulp.task('unit-server', unitServer);
gulp.task('unit-watch', unitWatch);
gulp.task('lint', lint);
gulp.task('js-min', jsMin);
gulp.task('js-min-watch', ['js-min'], jsMinWatch);
gulp.task('js-dist', jsDist);
gulp.task('dist', ['lint', 'unit'], jsDist);
gulp.task('docs', jsDoc);

gulp.task('default', ['build']);
