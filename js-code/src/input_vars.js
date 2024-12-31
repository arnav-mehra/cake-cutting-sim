import { code_input, n_input } from './constants.js';

export let n = 5;

export let code = (
`let N_rem = new Set(N);
let curr_start = 0;

for (let i of range(1, n)) {
    const marks = N_rem.map(i => [ V[i].mark(curr_start, 1 / n), i ]);    
    const [ mark, j ] = marks.minBy(x => x[0]);
    assert(mark != Infinity, "Impossible, not enough cake left!");

    N_rem = N_rem.subtract(j);
    A[j] = A[j].pushed([curr_start, mark]);
    curr_start = mark;
}`
);

n_input.value = n;
n_input.addEventListener('input', e => {
    n = Number(e.target.value);
});

code_input.value = code;
code_input.addEventListener('input', e => {
    code = e.target.value;
});