import { V } from "./cake_vars.js";
import { alloc_color, animation_query_delay, animation_step_delay, code_highlight, query_color, unalloc_color } from "./constants.js";
import { range, sleep } from "./util.js";

export const log = [];

export const logged_object = (op, obj) => {
    const logged_obj = {};
    Object.entries(obj).forEach(([key, default_val]) => {
        let val = default_val;
        Object.defineProperty(logged_obj, key, {
            get: function() {
                return val;
            },
            set: function(v) {
                log.push([op, key, v]);
                val = v;
            }
        });
    });
    return logged_obj;
};

export const logged_exec = (i) => {
    const action = ["exec", i];
    log.push(action);
};

export const clear_log = () => {
    log.length = 0;
};

let hanging_highlights = [];
export const animate_log = async (n) => {
    hanging_highlights.forEach(cleanup => {
        cleanup();
    });

    const A_curr = Object.fromEntries(range(1, n).map(i => [i, []]));
    const A_highlights = [];

    code_highlight.classList.remove('hidden');

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
                A_curr[i] = intervals;

                A_highlights.forEach(cleanup => cleanup());
                A_highlights.length = 0;

                Object.entries(A_curr).forEach(([i, intervals]) => {
                    const cbs = intervals.map(interval => (
                        V[i].highlight(interval, alloc_color)
                    ));
                    A_highlights.push(...cbs);

                    range(1, n).filter(x => x != i).forEach(i => {
                        const cbs = intervals.map(interval => (
                            V[i].highlight(interval, unalloc_color)
                        ));
                        A_highlights.push(...cbs);
                    });
                });
                
                await sleep(animation_query_delay);
                break;
            }
        }
    }

    hanging_highlights = Object
        .entries(A_highlights)
        .map(([_, val]) => val)
        .flat();

    code_highlight.classList.add('hidden');
};