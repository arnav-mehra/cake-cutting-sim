import { base_color, detail, scale_x, scale_y, visual_cont } from "./constants.js";
import { n } from "./input_vars.js";
import { logged_object } from "./log.js";
import { range } from "./util.js";
import { PlottedValuation } from "./valuation.js";

export let N;
export let V;
export let A;

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

export const regen_agents = () => {
    N = gen_agents();
};

export const regen_valuations = () => {
    if (V) {
        Object.entries(V).forEach(([_, v]) => v.destroy());
    }
    V = gen_valuations();
};

export const reinit_allocations = () => {
    A = init_allocations();
};