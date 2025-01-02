import { range, sleep } from "./util.js";
import { alloc_color, animation_query_delay, animation_step_delay, code_highlight, curr_instr_el, cut_color, cut_count_el, eval_count_el, mark_count_el, query_color, query_count_el, residue_set_el, unalloc_color } from "./constants.js";
import { V } from "./cake_vars.js";

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

let hanging_overlays = [];
export const animate_log = async (n) => {
    code_highlight.classList.remove('hidden');
    hanging_overlays.forEach(cleanup => cleanup());

    const curr_cuts = [];
    const A_curr = Object.fromEntries(range(1, n).map(i => [i, []]));
    const A_highlights = [];

    let cuts = 0;
    let marks = 0;
    let evals = 0;
    let curr_instr = 'None';

    const update_stats = () => {
        cut_count_el.textContent = cuts + '';
        mark_count_el.textContent = marks + '';
        eval_count_el.textContent = evals + '';
        query_count_el.textContent = marks + evals + '';
        curr_instr_el.textContent = curr_instr;
   
        const intervals_starts = [ 0, ...curr_cuts ];
        const intervals_ends = [ ...curr_cuts, 1 ];
        const curr_intervals = intervals_starts.zipWith(intervals_ends);
        const alloc_intervals = range(1, n).map(i => A_curr[i]).flat().map(int => [int[0], int[1]]);
        const intervals_str_set = new Set(curr_intervals.map(x => x.join(',')));
        const alloc_intervals_str_set = new Set(alloc_intervals.map(x => x.join(',')));
        const unalloc_intervals_str_set = intervals_str_set.subtract(...alloc_intervals_str_set);
        const unalloc_intervals_str = unalloc_intervals_str_set.map(x => "(" + x.split(',').map(x => Number(x).toFixed(2)).join(', ') + ")")
        residue_set_el.textContent = "{ " + unalloc_intervals_str.join(', ') + " }";
    };
    update_stats();

    for (const [cmd, ...io] of log) {
        switch (cmd) {
            case 'exec': {
                const [ line_num ] = io;

                curr_instr = `None`;
                update_stats();

                code_highlight.style.top = line_num * 24 + 'px';
                await sleep(animation_step_delay);
                break;
            }
            case 'eval': {
                const [ v, start, end, res ] = io;

                evals++;
                const i = Object.entries(V).find(([_, _v]) => _v === v)[0];
                curr_instr = `V[${i}].eval(${start.toFixed(2)}, ${end.toFixed(2)}) -> ${res.toFixed(2)}`;
                update_stats();

                const cleanup = v.highlight([start, end], query_color);
                await sleep(animation_query_delay);
                cleanup();
                break;
            }
            case 'mark': {
                const [ v, start, val, res ] = io;

                marks++;
                const i = Object.entries(V).find(([_, _v]) => _v === v)[0];
                curr_instr = `V[${i}].mark(${start.toFixed(2)}, ${val.toFixed(2)}) -> ${res.toFixed(2)}`;
                update_stats();

                const cleanup = v.highlight([start, res], query_color);
                await sleep(animation_query_delay);
                cleanup();
                break;
            }
            case 'set-A': {
                const [ i, intervals ] = io;
                A_curr[i] = intervals;

                update_stats();

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
            case 'cut': {
                const [ marks ] = io;
                curr_cuts.push(...marks);

                cuts += marks.length;
                curr_instr = `cut(${marks.map(x => x.toFixed(2)).join(', ')})`;
                update_stats();

                range(1, n).forEach(i => {
                    marks.forEach(mark => {
                        const cut_cleanup = V[i].show_cut(mark, cut_color)
                        hanging_overlays.push(cut_cleanup);
                    });
                });
                await sleep(animation_query_delay);
                break;
            }
        }
    }

    hanging_overlays.push(...A_highlights);

    code_highlight.classList.add('hidden');
};