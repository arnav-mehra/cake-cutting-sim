import { log } from './log.js';
import { integrate, inverse_integrate, plot_points, normalize } from './functions.js';
import { base_color, query_color, scale_x, scale_y } from './constants.js';

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

        const base_plot = this._gen_plot(base_color);
        this.cont.append(base_plot);

        this.parent.append(this.cont);
    }

    highlight(interval, color=query_color) {
        const highlight_overlay = this._gen_plot_interval(interval, color)
        highlight_overlay.style.zIndex = 10;
        this.cont.append(highlight_overlay);
        return () => highlight_overlay.remove();
    }

    destroy() {
        this.cont.remove();
    }

    _gen_plot_interval(interval, color=query_color) {
        const points = plot_points(this.piecewise_function, interval, color, scale_x, scale_y)
        const scaled_points = points
            .map(point => ([point[0] * scale_x, (point[1]) * scale_y]));
        const svg_points = scaled_points
            .map(point => point.join(','))
            .join(' ');

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.height = "100%";
        svg.style.transform = "scaleY(-1)";
        svg.style.position = 'absolute';
        svg.style.bottom = '0px';
        svg.style.left = '0px';

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", svg_points);
        polygon.setAttribute("fill", color);
        polygon.setAttribute("stroke", "none");
        svg.append(polygon);

        return svg;
    }

    _gen_plot(color=base_color) {
        return this._gen_plot_interval([0, 1], color);
    }
};
