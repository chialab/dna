const fs = require('fs');
const path = require('path');
const marked = require('marked');
const beautify = require('js-beautify').html;
const argv = require('yargs').argv;

const ASSETS_DIRECTORY = path.join(__dirname, 'assets');
const DOCS_DIRECTORY = path.join(process.cwd(), argv._[0]);
const OUTPUT_DIRECTORY = path.join(process.cwd(), argv.out);
const FILES = fs.readdirSync(DOCS_DIRECTORY);

if (fs.existsSync(OUTPUT_DIRECTORY)) {
    emptyDirSync(OUTPUT_DIRECTORY);
    fs.mkdirSync(OUTPUT_DIRECTORY);
} else {
    fs.mkdirSync(OUTPUT_DIRECTORY);
}

copyDirSync(ASSETS_DIRECTORY, OUTPUT_DIRECTORY);

const RENAMES = {
    index: /^README$/i,
};

const PARTIALS = FILES
    .filter((fileName) => fileName[0] === '_')
    .reduce((list, fileName) => {
        let file = path.join(DOCS_DIRECTORY, fileName);
        let contents = fs.readFileSync(file, 'utf8');
        let baseName = path.basename(fileName, path.extname(fileName));
        list[baseName.replace(/^_*/, '').replace(/_*$/, '').toLowerCase()] = marked(contents);
        return list;
    }, {});

const PAGES = FILES
    .filter((fileName) => fileName[0] !== '_')
    .reduce((list, fileName) => {
        let file = path.join(DOCS_DIRECTORY, fileName);
        let contents = fs.readFileSync(file, 'utf8');
        let pageName = path.basename(fileName, path.extname(fileName));
        for (let k in RENAMES) {
            if (RENAMES[k].test(pageName)) {
                pageName = k;
                break;
            }
        }
        let html = `<main>
        <div class="wrapper">
            <article>${marked(contents)}</article>
            ${PARTIALS.sidebar ? `<nav>${PARTIALS.sidebar}</nav>` : ''}
        </div>
</main>`;
        if (PARTIALS.header) {
            html = `<header><div class="wrapper">${PARTIALS.header}</div></header>\n${html}`;
        }
        if (PARTIALS.footer) {
            html += `\n<footer><div class="wrapper">${PARTIALS.footer}</div></footer>`;
        }
        list[`${pageName}.html`] = html;
        return list;
    }, {});

Object.keys(PAGES).forEach((pageName) => {
    let outFile = path.join(OUTPUT_DIRECTORY, pageName);
    fs.writeFileSync(outFile, template(PAGES[pageName]));
});

function template(content) {
    return beautify(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="assets/github.min.css">
    <link rel="stylesheet" href="assets/style.css">
    <title>DNA</title>
</head>
<body>
    ${content}
    <script src="assets/highlight.min.js"></script>
    <script src="assets/javascript.min.js"></script>
    <script src="assets/typescript.min.js"></script>
    <script src="assets/css.min.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>
</body>
</html>`);
}

function emptyDirSync(directory) {
    fs.readdirSync(directory).forEach((childName) => {
        let child = path.join(directory, childName);
        let stats = fs.statSync(child);
        if (stats.isDirectory()) {
            emptyDirSync(child);
        } else {
            fs.unlinkSync(child);
        }
    });
    fs.rmdirSync(directory);
}

function copyDirSync(directory, output) {
    output = path.join(output, path.basename(directory));
    fs.mkdirSync(output);
    fs.readdirSync(directory).forEach((childName) => {
        let child = path.join(directory, childName);
        let outChild = path.join(output, childName);
        let stats = fs.statSync(child);
        if (stats.isDirectory()) {
            copyDirSync(child, output);
        } else {
            fs.copyFileSync(child, outChild);
        }
    });
}
