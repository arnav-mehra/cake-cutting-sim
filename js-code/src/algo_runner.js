import { range, assert } from './util.js';
import { n } from './input_vars.js';
import { N, V, A } from './cake_vars.js';
import { logged_exec } from './log.js';

export const execute_code = (code) => {
    eval(code);
};