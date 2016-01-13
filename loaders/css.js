exports.fetch = function(load) {
    return fetchText(load.address);
}

exports.translate = function (load) {
    return 'export default function css() { return `' + load.source + '`; }';
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
