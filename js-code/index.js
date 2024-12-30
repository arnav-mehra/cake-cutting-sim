import { PlottedValuation } from './valuation.js';
import { range, assert } from './util.js';

const n = 5;
const detail = 10;
const scale_x = 120;
const scale_y = 30;
const base_color = 'red';

const gen_agents = () => {
    return new Set(range(1, n));
}

const gen_valuations = () => {
    const entries = range(1, n).map(i => (
        [i, new PlottedValuation(document.body, base_color, scale_x, scale_y, detail)]
    ))
    return Object.fromEntries(entries);
};

const init_allocations = () => {
    const entries = range(1, n).map(i => [i, []]);
    return Object.fromEntries(entries);
};

const N = gen_agents();
const V = gen_valuations();
const A = init_allocations();
const R = [];
const S = {};

const allocate_proportionally = () => {
    let N_rem = new Set(N);
    let curr_start = 0;

    for (let i of range(1, n)) {
        const marks = N_rem.map(i => [ V[i].mark(curr_start, 1 / n), i ]);    
        const [ mark, j ] = marks.minBy(x => x[0]);
        assert(mark != Infinity, "Not enough cake left! This should never happen!");

        N_rem = N_rem.subtract(j);
        A[i] = A[i].pushed([curr_start, mark]);
        S[i] = j;
        curr_start = mark;
    }

    R.push([curr_start, 1]);
};

allocate_proportionally();

Object.entries(S).forEach(([i, j]) => {
    A[i].forEach(interval => {
        console.log("highlighting ", j, interval)
        V[j].highlight(interval, 'green');
    })
});

range(1, n).forEach(i => {
    R.forEach(interval => {
        console.log("highlighting " , i, interval)
        V[i].highlight(interval, 'gray');
    })
});
