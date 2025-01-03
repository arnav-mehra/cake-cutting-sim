import { range, subintervals } from "./util.js";

const integrate_piece = (f = x => x, interval = [0, 1], steps = 10) => {
    return subintervals(interval, steps)
        .map(([x1, x2]) => (f(x1) + f(x2)) / 2 * (x2 - x1))
        .sum();
};

export const integrate = (piecewise_function, interval = [0, 1], steps_per_piece = 10) => {
    const pieces = piecewise_function.map(([f_interval, f]) => {
        const start = Math.max(f_interval[0], interval[0]);
        const end = Math.min(f_interval[1], interval[1]);
        return end < start ? 0 : integrate_piece(f, [start, end], steps_per_piece);
    });
    return pieces.sum();
};

const inverse_integrate_piece = (f = x => x, interval = [0, 1], value = 1, steps = 10) => {
    let sum = 0;
    for (let [x1, x2] of subintervals(interval, steps)) {
        const rect = (f(x1) + f(x2)) / 2 * (x2 - x1);
        sum += rect;
        if (sum > value) {
            const frac = (sum - value) / rect; // linear approx.
            return [x1 * (frac) + x2 * (1 - frac), sum];
        }
    }
    return [null, sum];
};

export const inverse_integrate = (piecewise_function, start = 0, value = 1, steps_per_piece = 10) => {
    let accum_val = 0;
    
    for (const [f_interval, f] of piecewise_function) {
        if (start >= f_interval[1]) continue;

        const interval = [ Math.max(start, f_interval[0]), f_interval[1] ];
        const [res, sum] = inverse_integrate_piece(f, interval, value - accum_val, steps_per_piece);
        if (res !== null) return res;

        accum_val += sum;
    }

    if (value - accum_val < 1e-5) return 1;
    return null;
};

const piece_plot_points = (f = x => x, interval = [0, 1], steps = 10) => {
    const dx = (interval[1] - interval[0]) / (steps - 1);
    const points = range(0, steps - 1).map(i => {
        const x = i * dx + interval[0];
        return [x, f(x)];
    });
    return points;
};

export const plot_points = (piecewise_function, interval = [0, 1], color = 'red', scale_x = 1, scale_y = 1, steps_per_piece = 10) => {
    const function_points = piecewise_function
        .map(([f_interval, f]) => {
            const start = Math.max(f_interval[0], interval[0]);
            const end = Math.min(f_interval[1], interval[1]);
            return end < start ? [] : piece_plot_points(f, [start, end], steps_per_piece);
        })
        .flat();

    const points = [
        [interval[0], 0],
        ...function_points,
        [interval[1], 0]
    ];
    return points;
};

export const normalize = (piecewise_function = default_f, steps_per_piece = 10) => {
    const mag = integrate(piecewise_function, [0, 1], steps_per_piece);
    return piecewise_function.map(([f_interval, f]) => (
        [f_interval, x => f(x) / mag]
    ));
};
