Set.prototype.map = function(callback) {
    return [...this].map(callback);
}

Set.prototype.subtract = function(...els) {
    const res = new Set(this)
    els.forEach(el => res.delete(el));
    return res;
}

Array.prototype.pushed = function(...a) {
    this.push(...a);
    return this;
}

Array.prototype.sum = function() {
    return this.reduce((a, b) => a + b, 0);
}

Array.prototype.last = function() {
    return this[this.length - 1];
}

Array.prototype.minBy = function(transform) {
    const init = [Infinity, -1];
    return this.reduce((res, x) => transform(x) < transform(res) ? x : res, init);
}

Array.prototype.accumulateLeft = function() {
    const res = [];
    this.forEach((x, i) => {
        res.push(i === 0 ? x : prev + x);
    });
    return res;
}

export const gen_rands = (n) => {
    return new Array(n).fill(0).map(_ => Math.random());
}

export const range = (start, end) => {
    return new Array(end - start + 1).fill(0).map((_, i) => i + start);
}

export const assert = (cond, msg) => {
    if (!cond) {
        throw new Error(msg);
    }
}