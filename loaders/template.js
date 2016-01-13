exports.translate = function (load) {
    return 'export default function template() { return `' + load.source + '` }';
}
