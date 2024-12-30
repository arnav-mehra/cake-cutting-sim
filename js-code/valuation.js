import { gen_rands } from './util.js';

const create_block = (color, width, height) => {
    const block = document.createElement("div");
    block.style.backgroundColor = color;
    block.style.width = width + "px";
    block.style.height = height + "px";
    return block;
}

export class Valuation {
    constructor(detail) {
        this.segments = gen_rands(detail - 1)
            .sort()
            .pushed(1)
            // .map((x, i, arr) => ([ i === 0 ? 0 : arr[i - 1], x ]));
            .map((_, i) => ([ i * 1 / detail, (i + 1) * 1 / detail ]));
        this.values = gen_rands(detail - 1)
            .sort()
            .pushed(1)
            .map((x, i, arr) => i === 0 ? x : x - arr[i - 1]);
            // .map(_ => 1 / detail);
        // this.cum_values = this.values.accumulateLeft();
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
};

export class PlottedValuation extends Valuation {
    constructor(parent, color, scale_x, scale_y, detail) {
        super(detail);

        this.scale_x = scale_x;
        this.scale_y = scale_y;
        this.parent = parent;

        this.cont = document.createElement('div');
        this.cont.style.position = 'relative';
        this.cont.style.width = this.scale_x + 'px';
        this.cont.style.height = this.scale_y * 4 + 'px';
        this.cont.style.overflow = 'hidden';
        this.cont.style.border = '1px solid black';

        const base_plot = this._gen_plot(color, this.scale_x, this.scale_y);
        this.cont.append(base_plot);
        this.parent.append(this.cont);
    }

    highlight(interval, color) {
        const highlight_overlay = this._gen_plot_interval(interval, color, this.scale_x, this.scale_y)
        highlight_overlay.style.zIndex = 10;
        this.cont.append(highlight_overlay);
        return () => highlight_overlay.destroy();
    }

    _gen_plot_interval([start, end], color='green', scale_x=10, scale_y=10) {
        const cont = document.createElement("div");
        cont.style.display = 'flex';
        cont.style.alignItems = 'end';
        cont.style.position = 'absolute';
        cont.style.bottom = '0px';
        cont.style.left = '0px';

        for (let i = 0; i < this.segments.length; i++) {
            const [ seg_start, seg_end ] = this.segments[i];
            const seg_len = seg_end - seg_start;
            const seg_val = this.values[i];

            const width = seg_len * scale_x;
            const height = seg_val / seg_len * scale_y;

            if (start >= seg_end || end <= seg_start) { // [] start end OR start end []
                const flat = create_block(color, width, 0);
                cont.appendChild(flat);
            }
            else if (start <= seg_start && end >= seg_end) {  // start [ ] end
                const bar = create_block(color, width, height);
                cont.appendChild(bar);
            }
            else if (start <= seg_start && end < seg_end) { // start ([ end) ] 
                const width_f = (seg_end - end) / (seg_end - seg_start);
                
                const bar = create_block(color, width * (1 - width_f), height);
                cont.appendChild(bar);
                const flat = create_block(color, width * width_f, 0);
                cont.appendChild(flat);
            }
            else if (start > seg_start && end >= seg_end) { // [ (start ]) end 
                const width_f = (start - seg_start) / (seg_end - seg_start);
                
                const flat = create_block(color, width * width_f, 0);
                cont.appendChild(flat);
                const bar = create_block(color, width * (1 - width_f), height);
                cont.appendChild(bar);
            }
            else { // [ (start, end) ]
                const width_f1 = (start - seg_start) / (seg_end - seg_start);
                const width_f2 = (seg_end - end) / (seg_end - seg_start);

                const flat1 = create_block(color, width * width_f1, 0);
                cont.appendChild(flat1);
                const bar = create_block(color, width * (1 - width_f1 - width_f2), height);
                cont.appendChild(bar);
                const flat2 = create_block(color, width * width_f2, 0);
                cont.appendChild(flat2);
            }
        }

        return cont;
    }

    _gen_plot(color='red', scale_x=10, scale_y=10) {
        return this._gen_plot_interval([0, 1], color, scale_x, scale_y);
    }
}
