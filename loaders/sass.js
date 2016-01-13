var sass;

if (typeof window !== 'undefined') {
    var head = document.getElementsByTagName('head')[0];
    var SassLoader = new Promise(function (resolve, reject) {
        var script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = resolve;
            script.onerror = reject;
            script.onabort = reject;

        head.appendChild(script);
        script.src = window.SASS_CDN || 'https://cdn.rawgit.com/medialize/sass.js/master/dist/sass.sync.js';
    });

    SassLoader.then(function () {
        sass = Sass;
        // Turn on source maps
        sass.options({
            // Embed included contents in maps
            sourceMapContents: true,
            // Embed sourceMappingUrl as data uri
            sourceMapEmbed: true,
            // Disable sourceMappingUrl in css output
            sourceMapOmitUrl: false
        });
    }, function () {
        console.log('Unable to load SASS');
    });

    exports.fetch = function(load) {
        return SassLoader.then(function () {
            return loadStyle(load.address);
        });
    }

    exports.translate = function (load) {
        return 'export default function css() { return `' + load.source + '`; }';
    }
}

function fetchText(url) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                resolve(request.responseText);
            } else {
                reject(new Error('Request error for "' + url + '" with status ' + request.status));
            }
        };

        request.onerror = function(e) {
            reject(e);
        };

        request.send();
    });
}

function loadStyle(url) {
    return fetchText(url).then(function(data) {
        return new Promise(function(resolve, reject) {
            sass.compile(data, {
                inputPath: url
            }, function(result) {
                var successful = result.status === 0;
                if (successful) {
                    resolve(result.text);
                } else {
                    reject(result.formatted);
                }
            });
        });
    });
};
