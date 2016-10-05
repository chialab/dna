export class Wrapper {
    constructor(name) {
        let elem = document.createElement('div');
        if (name) {
            elem.id = name;
        }
        document.body.appendChild(elem);
        return elem;
    }
}
