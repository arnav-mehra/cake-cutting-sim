import { regen_vals_button, run_code_button } from './constants.js';
import { code, n } from './input_vars.js';
import { clear_log, log, animate_log } from './log.js';
import { regen_agents, regen_cake, regen_valuations, reinit_allocations } from './cake_vars.js';
import { run_algo_code } from './algo_runner.js';

// ACTIONS

const trigger_algo_code = () => {
    const lines = code
        .split('\n')
        .map(line => line.split("//")[0].trimStart().trimEnd());
    const logged_code = lines
        .map((line, i) => {
            const has_alphanums = line.replace(/[^a-z0-9]/gi, '').length > 0;
            const exec_log_prefix = has_alphanums ? `logged_exec(${i}); ` : '';
            return exec_log_prefix + line;
        })
        .join('\n');

    regen_cake();
    regen_agents();
    reinit_allocations();

    clear_log();
    try {
        run_algo_code(logged_code);
    } catch (err) {
        alert("Code errored. Check console.");
        console.error(err);
        return;
    }
    console.log(log);
    animate_log(n);
};

run_code_button.addEventListener('click', e => {
    trigger_algo_code();
});

regen_vals_button.addEventListener('click', e => {
    regen_valuations();
});

// INIT VALUATIONS

regen_valuations();