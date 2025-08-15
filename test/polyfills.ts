if (!Array.prototype.at) {
    Array.prototype.at = function (index) {
        if (index < 0) {
            return this[this.length + index];
        }
        return this[index];
    };
}
