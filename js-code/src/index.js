import { PlottedValuation } from './valuation.js';
import { range, assert, sleep } from './util.js';
import { clear_log, log, logged_object, logged_exec } from './log.js';

// CONSTANTS

const detail = 10;
const scale_x = 120;
const scale_y = 30;

const animation_step_delay = 500;
const animation_query_delay = 500;

const base_color = 'red';
const alloc_color = 'green';
const query_color = 'blue';

const n_input = document.getElementById('n-input');
const code_input = document.getElementById('code-input');
const visual_cont = document.getElementById('visual-cont');
const run_code_button = document.getElementById('run-code-button');
const regen_vals_button = document.getElementById('regen-vals-button');
const code_highlight = document.getElementById('code-highlight');

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
    A[j] = A[j].pushed([curr_start, mark]);
    curr_start = mark;
}`
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
    const obj = Object.fromEntries(entries);
    const logged_obj = logged_object("set-A", obj);
    return logged_obj;
};

let N = gen_agents();
let V = gen_valuations();
let A = init_allocations();

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
    const lines = code.split('\n');
    const logged_code = lines.map((line, i) => {
        const prev_line = i === 0 ? null : lines[i - 1];
        const prev_line_complete = !prev_line || [';', '}', '{'].includes(prev_line.trimEnd().split('').last());
        const exec_log_prefix = prev_line_complete ? `logged_exec(${i}); ` : '';
        return exec_log_prefix + line;
    }).join('\n');

    N = gen_agents();
    A = init_allocations();
    clear_log();

    try {
        eval(logged_code);
    } catch (err) {
        alert("Code errored. Check console.");
        console.error(err);
        return;
    }

    console.log(log);
    animate_log();
};

let hanging_highlights = [];

const animate_log = async () => {
    hanging_highlights.forEach(cleanup => {
        cleanup();
    });

    const A_highlights = Object.fromEntries(range(1, n).map(i => [i, []]));

    for (const [cmd, ...io] of log) {
        switch (cmd) {
            case 'exec': {
                const [ line_num ] = io;
                code_highlight.style.top = line_num * 24 + 'px';
                await sleep(animation_step_delay);
                break;
            }
            case 'eval': {
                const [ v, start, end, res ] = io;
                const cleanup = v.highlight([start, end], query_color);
                await sleep(animation_query_delay);
                cleanup();
                break;
            }
            case 'mark': {
                const [ v, start, val, res ] = io;
                const cleanup = v.highlight([start, res], query_color);
                await sleep(animation_query_delay);
                cleanup();
                break;
            }
            case 'set-A': {
                const [ i, intervals ] = io;
                A_highlights[i].forEach(cleanup => {
                    cleanup();
                });
                A_highlights[i] = intervals.map(interval => (
                    V[i].highlight(interval, alloc_color)
                ));
                await sleep(animation_query_delay);
                break;
            }
        }
    }

    hanging_highlights = Object
        .entries(A_highlights)
        .map(([_, val]) => val)
        .flat();
};

run_code_button.addEventListener('click', e => {
    run_code();
});

const regen_valuations = () => {
    Object.entries(V).forEach(([_, v]) => v.destroy());
    V = gen_valuations();
};

regen_vals_button.addEventListener('click', e => {
    regen_valuations();
});