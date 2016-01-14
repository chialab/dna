function escapeCSS(css) {
    return css
        .replace(/(["\\])/g, '\\$1')
        .replace(/[\f]/g, "\\f")
        .replace(/[\b]/g, "\\b")
        .replace(/[\n]/g, "\\n")
        .replace(/[\t]/g, "\\t")
        .replace(/[\r]/g, "\\r")
        .replace(/[\u2028]/g, "\\u2028")
        .replace(/[\u2029]/g, "\\u2029");
}

if (typeof window !== 'undefined') {
    exports.fetch = function(load) {
        return fetchText(load.address);
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

    exports.translate = function(load) {
        return 'export default function css() { return "' + escapeCSS(load.source) + '"; }';
    }
} else {
    exports.translate = function(load) {
        return 'def' + 'ine(function css() { return "' + escapeCSS(load.source) + '"; })';
    }
}
