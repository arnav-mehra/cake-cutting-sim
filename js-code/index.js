import { Valuation } from './valuation.js';
import { range } from './util.js';

const gen_agents = (n, detail) => {
    return range(1, n).map(_ => new Valuation(detail));
};

const allocate_proportionally = (V) => {
    const n = V.length;
    const prop = 1 / n;

    const allocs = {};
    let curr_start = 0;
    for (let _ of range(1, n)) {
        const [mark, j] = V.map((v, j) => allocs[j] ? Infinity : v.mark(curr_start, prop)).min();
        if (mark == Infinity) {
            throw new Error("Not enough cake left! This should never happen!");
        }

        allocs[j] = [curr_start, mark];
        curr_start = mark;
    }
    const residue = [curr_start, 1];

    return [allocs, residue];
};


const agents = gen_agents(5, 10);
// console.log(agents);
const [alloc, residue] = allocate_proportionally(agents);
console.log(alloc);
console.log(residue);


// console.log(v.segments)
// console.log(v.values)

// const value = 0.5;
// const start = 0;
// const end = v.mark(start, value);

// console.log(end)
// console.log(v.eval(start,end))
// console.log(v.segments)
// console.log(v.mark(end,value))