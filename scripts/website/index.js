const fs = require('fs');
const path = require('path');
const marked = require('marked');
const beautify = require('js-beautify').html;
const argv = require('yargs').argv;
const json = require('../../package.json');

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
    index: /^(readme|home)$/i,
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
    <title>${argv.title || json.name} | ${json.description}</title>
    <meta name="description" content="${argv.title || json.name} | ${json.description}">
    <meta name="theme-color" content="#263238">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="assets/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="assets/favicon-16x16.png" sizes="16x16">
    <link rel="stylesheet" href="assets/github.min.css">
    <link rel="stylesheet" href="assets/style.css">
    <title>DNA</title>
</head>
<body>
    <nav id="topbar">
        <a href="./" aria-label="Chialab Dev logo">
            <svg viewBox="0 0 49 31" width="64" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M47 15.76h-2.62c-1.34 0-1.73-1.1-2.92-2.43s-6.6-6.42-16.28-6.42c-10.25 0-15.09 4.17-16.55 5.32-.436.39-.94.696-1.49.9-.67.21-1.25-.25-2.22-2.17C3.604 8.178 2.85 5.164 2.7 2.09 2.61.93 2.27.59 1.79.5 1.12.38.48.59.45 1.89c.08 3.633.986 7.2 2.65 10.43 1.37 2.31 1.55 2.8 1.55 3.38 0 .58-.18 1.06-1.55 3.38C1.437 22.31.53 25.877.45 29.51c0 1.31.67 1.52 1.34 1.4.49-.09.82-.43.91-1.58.15-3.068.904-6.075 2.22-8.85 1-1.92 1.55-2.34 2.22-2.13.557.234 1.063.573 1.49 1 1.46 1.16 6.3 5.48 16.55 5.48 9.67 0 15.06-4.26 16.28-5.66 1.22-1.4 1.58-1.37 2.92-1.37H47c.88 0 1.49-.18 1.49-1 0-.82-.65-1.04-1.49-1.04zm-8.43 2.63c-.33.82-5.45 4.34-13.14 4.34-9.25 0-14.6-4-16.21-5.92-.274-.285-.428-.665-.43-1.06.005-.377.16-.737.43-1 1.61-1.92 7-5.82 16.21-5.82 7.7 0 12.81 4.34 13.14 5.17.127.355.088.748-.106 1.07-.193.325-.52.544-.894.6H34c-1 0-1.52-1.28-2.25-2.19-.84-1.446-2.333-2.39-4-2.53-1.307-.046-2.576.44-3.52 1.346-.94.907-1.475 2.156-1.48 3.464.005 1.314.537 2.57 1.477 3.488.94.917 2.21 1.42 3.523 1.392 1.55.16 3.07-.51 4-1.76.488-.77 1.34-1.23 2.25-1.22h3.56c.73 0 1.25-.07.97.63h.04zm-8.28-2.69c0 1.414-1.146 2.56-2.56 2.56-1.414 0-2.56-1.146-2.56-2.56 0-1.414 1.146-2.56 2.56-2.56 1.4.022 2.525 1.16 2.53 2.56h.03z" fill-rule="evenodd"></path></svg>
        </a>
        <a href="./">Home</a>
        <a href="${json.repository.url}">Source</a>
        <a href="${json.bugs.url}">Issues</a>
        <a href="https://www.chialab.io">Chialab.io</a>
    </nav>
    ${content}
    <script src="assets/highlight.min.js"></script>
    <script src="assets/javascript.min.js"></script>
    <script src="assets/typescript.min.js"></script>
    <script src="assets/css.min.js"></script>
    <script src="assets/scss.min.js"></script>
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
