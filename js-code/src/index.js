import { PlottedValuation } from './valuation.js';
import { range, assert } from './util.js';

// CONSTANTS

const detail = 10;
const scale_x = 120;
const scale_y = 30;

const base_color = 'red';
const alloc_color = 'green';
const residue_color = 'gray';

const n_input = document.getElementById('n-input');
const code_input = document.getElementById('code-input');
const visual_cont = document.getElementById('visual-cont');
const run_code_button = document.getElementById('run-code-button');
const regen_vals_button = document.getElementById('regen-vals-button');

// VARIABLES

let n = 5;
let code = (
`let N_rem = new Set(N);
let curr_start = 0;

for (let i of range(1, n)) {
    const marks = N_rem.map(i => [ V[i].mark(curr_start, 1 / n), i ]);    
    const [ mark, j ] = marks.minBy(x => x[0]);
    assert(mark != Infinity, "Impossible, not enough cake left!");

    N_rem = N_rem.subtract(j);
    A[i] = A[i].pushed([curr_start, mark]);
    S[i] = j;
    curr_start = mark;
}

R.push([curr_start, 1]);`
);

const gen_agents = () => {
    return new Set(range(1, n));
};

const gen_valuations = () => {
    const entries = range(1, n).map(i => (
        [i, new PlottedValuation(visual_cont, base_color, scale_x, scale_y, detail)]
    ))
    return Object.fromEntries(entries);
};

const init_allocations = () => {
    const entries = range(1, n).map(i => [i, []]);
    return Object.fromEntries(entries);
};

let N = gen_agents();
let V = gen_valuations();
let A = init_allocations();
let R = [];
let S = {};

// INPUT BINDING

code_input.value = code;
code_input.addEventListener('input', e => {
    code = e.target.value;
});

n_input.value = n;
n_input.addEventListener('input', e => {
    n = Number(e.target.value);
});

// ACTIONS

const run_code = () => {
    const lined_code = code.split('\n').map((line, i) => (
        line.replaceAll(".eval(", ".logged_eval(log, " + i + ",")
            .replaceAll(".mark(", ".logged_mark(log, " + i + ",")
    )).join('\n');

    N = gen_agents();
    A = init_allocations();
    R = [];
    S = {};

    const log = [];
    try {
        eval(lined_code);
    } catch (err) {
        alert("Code errored: ", err);
    }

    highlight_allocations();
    highlight_residue();
};

run_code_button.addEventListener('click', e => {
    run_code();
});

const regen_valuations = () => {
    V?.forEach(v => v.destroy());
    V = gen_valuations();
};

regen_vals_button.addEventListener('click', e => {
    regen_valuations();
});

// HIGHLIGHT RESULTS

const highlight_allocations = () => {
    Object.entries(S).forEach(([i, j]) => {
        A[i].forEach(interval => {
            console.log("highlighting ", j, interval)
            V[j].highlight(interval, alloc_color);
        })
    });
};

const highlight_residue = () => {
    range(1, n).forEach(i => {
        R.forEach(interval => {
            console.log("highlighting " , i, interval)
            V[i].highlight(interval, residue_color);
        })
    });
};