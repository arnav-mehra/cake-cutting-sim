import { range } from "./util.js";
import { run_valuation_generator } from "./val_generator.js";
import { visual_cont } from "./constants.js";
import { n, valuation_code } from "./input_vars.js";
import { logged_object } from "./log.js";
import { PlottedValuation } from "./valuation.js";

export let N;
export let V;
export let A;

export const regen_agents = () => {
    N = new Set(range(1, n));
};

export const regen_valuations = () => {
    if (V) {
        Object.entries(V).forEach(([_, v]) => v.destroy());
    }
    const entries = range(1, n).map(i => {
        const piecewise_fn = run_valuation_generator(i, valuation_code);
        const plotted_val = new PlottedValuation(visual_cont, piecewise_fn);
        return [i, plotted_val];
    });
    V = Object.fromEntries(entries);
};

export const reinit_allocations = () => {
    const entries = range(1, n).map(i => [i, []]);
    const obj = Object.fromEntries(entries);
    const logged_obj = logged_object("set-A", obj);
    A = logged_obj;
};