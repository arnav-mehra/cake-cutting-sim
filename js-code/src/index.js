import { clear_log, log, animate_log } from './log.js';
import { execute_code } from './runner.js';
import { code, n } from './input_vars.js';
import { regen_vals_button, run_code_button } from './constants.js';
import { regen_agents, regen_valuations, reinit_allocations } from './cake_vars.js';

// ACTIONS

const run_code = () => {
    const lines = code.split('\n');
    const logged_code = lines.map((line, i) => {
        const prev_line = i === 0 ? null : lines[i - 1];
        const prev_line_complete = !prev_line || [';', '}', '{'].includes(prev_line.trimEnd().split('').last());
        const exec_log_prefix = prev_line_complete ? `logged_exec(${i}); ` : '';
        return exec_log_prefix + line;
    }).join('\n');

    regen_agents();
    reinit_allocations();

    clear_log();
    try {
        execute_code(logged_code);
    } catch (err) {
        alert("Code errored. Check console.");
        console.error(err);
        return;
    }
    console.log(log);
    animate_log(n);
};

run_code_button.addEventListener('click', e => {
    run_code();
});

regen_vals_button.addEventListener('click', e => {
    regen_valuations();
});

// INIT VALUATIONS

regen_valuations();