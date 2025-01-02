import { subintervals, range, gen_rands, assert } from "./util.js";

export const run_valuation_generator = (i, code) => {
    const V = {};
    eval(code);
    return V[i];
};