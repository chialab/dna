export function matches(element, selector) {
    let f = element.matches ||
        element.webkitMatchesSelector ||
        element.mozMatchesSelector ||
        element.msMatchesSelector ||
        function(s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };
    return f.call(element, selector);
}
