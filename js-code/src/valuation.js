import { log } from './log.js';
import { integrate, inverse_integrate, plot_points, normalize } from './functions.js';
import { base_color, cut_color, query_color, scale_x, scale_y } from './constants.js';
import { assert } from './util.js';

export class Interval extends Array {
    constructor(start, end, is_cut=false) {
        super();
        this.push(start);
        this.push(end);
        this.subintervals = [];
    }

    cut(...marks) {
        if (marks.length === 0) return;

        log.push(["cut", marks]);

        const has_uncontained_mark = marks
            .map(x => this[0] <= x && x <= this[1])
            .includes(false);
        assert(!has_uncontained_mark, "Cannot cut interval at uncontained mark.");
        assert(this.subintervals.length === 0, "Cannot cut an interval that has already been cut.");

        const start_marks = [this[0], ...marks];
        const end_marks = [...marks, this[1]];
        const subintervals = start_marks
            .zipWith(end_marks)
            .map(([x1, x2]) => new Interval(x1, x2));

        this.subintervals = subintervals;
        return subintervals;
    }

    collect_subintervals() {
        if (this.subintervals.length === 0) {
            return [ this ];
        }
        return this.subintervals
            .map(subinterval => subinterval.collect_subintervals())
            .flat();
    }
};

class Valuation {
    constructor(piecewise_function) {
        this.piecewise_function = normalize(piecewise_function);
    }

    _eval(start, end) {
        return integrate(this.piecewise_function, [start, end]);
    }

    _mark(start, val) {
        return inverse_integrate(this.piecewise_function, start, val);
    }

    eval(start, end) {
        const res = this._eval(start, end);
        const action = ["eval", this, start, end, res];
        log.push(action);
        return res;
    }

    mark(start, val) {
        const res = this._mark(start, val);
        const action = ["mark", this, start, val, res];
        log.push(action);
        return res;
    }
};

export class PlottedValuation extends Valuation {
    constructor(parent, piecewise_function) {
        super(piecewise_function);
        this.parent = parent;

        this.cont = document.createElement('div');
        this.cont.style.position = 'relative';
        this.cont.style.width = scale_x + 'px';
        this.cont.style.height = scale_y * 4 + 'px';
        this.cont.style.overflow = 'hidden';
        this.cont.style.boxSizing = 'content-box';
        this.cont.style.border = '1px solid #6b7280';

        this._add_plot_interval([0, 1], base_color);

        this.parent.append(this.cont);
    }

    show_cut(x, color=cut_color) {
        return this._add_plot_line(x, color);
    }

    highlight(interval, color=query_color) {
        return this._add_plot_interval(interval, color);
    }

    destroy() {
        this.cont.remove();
    }

    _add_svg_overlay(svg_child, z_index) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.height = "100%";
        svg.style.transform = "scaleY(-1)";
        svg.style.position = 'absolute';
        svg.style.bottom = '0px';
        svg.style.left = '0px';
        svg.style.zIndex = z_index + '';
        svg.append(svg_child);
        this.cont.append(svg);
        return () => svg.remove();
    }

    _add_plot_line(x, color=cut_color) {
        const points = [[x, 0], [x, 4]];
        const scaled_points = points
            .map(point => ([point[0] * scale_x, point[1] * scale_y]));
        const svg_points = scaled_points
            .map(point => point.join(','))
            .join(' ');

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", svg_points);
        polygon.setAttribute("stroke", color);
        polygon.setAttribute("stroke-width", "1");
        polygon.setAttribute("stroke-dasharray", "5,15");
        return this._add_svg_overlay(polygon, -1);
    }

    _add_plot_interval(interval=[0, 1], color=query_color) {
        const points = plot_points(this.piecewise_function, interval, color, scale_x, scale_y)
        const scaled_points = points
            .map(point => ([point[0] * scale_x, point[1] * scale_y]));
        const svg_points = scaled_points
            .map(point => point.join(','))
            .join(' ');

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", svg_points);
        polygon.setAttribute("fill", color);
        polygon.setAttribute("stroke", "none");
        return this._add_svg_overlay(polygon, -2);
    }
};
