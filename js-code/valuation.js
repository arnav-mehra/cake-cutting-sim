import { gen_rands } from './util.js';

export class Valuation {
    constructor(detail) {
        this.segments = gen_rands(detail - 1)
            .sort()
            .pushed(1)
            .map((x, i, arr) => ([ i === 0 ? 0 : arr[i - 1], x ]));
        this.values = gen_rands(detail - 1)
            .sort()
            .pushed(1)
            .map((x, i, arr) => i === 0 ? x : x - arr[i - 1]);
        this.cum_values = this.values.accumulateLeft();
        this.queries = 0;
    }

    _eval(start, end) {
        return this.segments
            .map(([seg_start, seg_end], i) => {
                const seg_eval_start = Math.max(start, seg_start);
                const seg_eval_end = Math.min(end, seg_end);
                const f = Math.max(seg_eval_end - seg_eval_start, 0) / (seg_end - seg_start);
                return f * this.values[i];
            })
            .sum();
    }

    _mark(start, val) {
        let val_rem = this._eval(0, start) + val;

        for (let i = 0; i < this.segments.length; i++) {
            const [ seg_start, seg_end ] = this.segments[i];
            const seg_val = this.values[i];

            if (seg_val <= val_rem) {
                val_rem -= seg_val;
            } else {
                const f = val_rem / seg_val;
                return (seg_end - seg_start) * f + seg_start;
            }
        }

        return val_rem < 1e-4 ? 1 : null;
    }
    
    eval(start, end) {
        this.queries++;
        return this._eval(start, end);
    }

    mark(start, val) {
        this.queries++;
        return this._mark(start, val);
    }

    gen_plot(color) {
        const cont = document.createElement("div");
        cont.style.display = 'flex';

        for (let i = 0; i < this.segments.length; i++) {
            const cont = document.createElement("div");
        }
    }
};
