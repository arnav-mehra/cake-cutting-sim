Set.prototype.map = function(callback) {
    return [...this].map(callback);
}

Set.prototype.subtract = function(...els) {
    const res = new Set(this)
    els.forEach(el => res.delete(el));
    return res;
}

Set.prototype.copy = function() {
    return new Set(this);
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

Array.prototype.zipWith = function(arr) {
    return this.map((x1, i) => ([x1, arr[i]]));
}

Array.prototype.copy = function() {
    return this.slice();
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

export const sleep = (t) => {
    return new Promise((res, rej) => setTimeout(res, t));
};

export const subintervals = (interval, subs) => {
    const len = interval[1] - interval[0];
    const sub_len = len / subs;
    return range(0, subs - 1).map(i => {
        const start = sub_len * i + interval[0];
        const end = sub_len * (i + 1) + interval[0];
        return [start, end]
    })
};