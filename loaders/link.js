exports.fetch = function(load, fetch) {
    return new Promise(function(resolve, reject) {
            var url = load.address,
                head = document.head || document.getElementsByTagName('head')[0];

            var script = document.createElement('script');
                script.type = 'text/javascript';
                script.onload = resolve;
                script.onerror = reject;
                script.onabort = reject;
                script.src = url;

            head.appendChild(script);
        })
        .then(function() {
            // return an empty module in the module pipeline itself
            return 'module.exports = function() { return window.Sass; }';
        });
}
