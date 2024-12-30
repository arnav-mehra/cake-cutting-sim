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

Array.prototype.min = function() {
    const init = [Infinity, -1];
    return this.reduce((res, x, i) => x < res[0] ? [x, i] : res, init);
}

Array.prototype.accumulateLeft = function() {
    const res = [];
    this.forEach((x, i) => {
        const prev = i === 0 ? 0 : res.last();
        res.push(prev + x);
    });
    return res;
}

export const gen_rands = (n) => {
    return new Array(n).fill(0).map(_ => Math.random());
}

export const range = (start, end) => {
    return new Array(end - start + 1).fill(0).map((_, i) => i + start);
}