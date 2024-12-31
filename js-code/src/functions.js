const default_f = [
    [[0, 0.5], x => x * x],
    [[0.5, 1], x => x/2]
]

const integrate_piece = (f = x => x, interval = [0, 1], steps = 100) => {
    const dx = (interval[1] - interval[0]) / steps;
    let sum = 0;
    for (let x = interval[0]; x < interval[1]; x += dx) {
        sum += f(x) * dx;
    }
    return sum;
};

const integrate = (piecewise_function = default_f, interval = [0, 1], steps_per_piece = 100) => {
    const pieces = piecewise_function.map(([f_interval, f]) => {
        const start = Math.max(f_interval[0], interval[0]);
        const end = Math.min(f_interval[1], interval[1]);
        return end < start ? 0 : integrate_piece(f, [start, end], steps_per_piece);
    });
    return pieces.reduce((a, b) => a + b, 0);
};

const inverse_integrate_piece = (f = x => x, interval = [0, 1], value = 1, steps = 100) => {
    const dx = (interval[1] - interval[0]) / steps;
    let sum = 0;
    for (let x = interval[0]; x < interval[1]; x += dx) {
        const rect = f(x) * dx;
        sum += rect;
        if (sum > value) {
            const f = (sum - value) / rect; // linear approx.
            return [x * (1 - f) + (x - dx) * f, sum];
        }
    }
    return [null, sum];
};

const inverse_integrate = (piecewise_function = default_f, start = 0, value = 1, steps_per_piece = 100) => {
    let accum_val = 0;
    
    for (const [f_interval, f] of piecewise_function) {
        if (start >= f_interval[1]) continue;

        const [res, sum] = inverse_integrate_piece(f, f_interval, value - accum_val, steps_per_piece);
        if (res !== null) return res;

        accum_val += sum;
    }

    if (value - accum_val < 1e-5) return 1;
    return null;
};

const normalize = (piecewise_function = default_f, steps_per_piece = 100) => {
    const mag = integrate(piecewise_function, [0, 1], steps_per_piece);
    return piecewise_function.map(([f_interval, f]) => (
        [f_interval, x => f(x) / mag]
    ));
};

const plot_piece = (f = x => x, interval = [0, 1], steps = 5, color = 'red') => {
    const dx = (interval[1] - interval[0]) / (steps - 1);
    const function_points = range(0, steps - 1).map(i => {
        const x = i * dx + interval[0];
        return [x, f(x)];
    });
    const points = [[interval[0], 0], ...function_points, [interval[1], 0]];

    const svg = document.getElementById('polynomial-svg');
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.setAttribute("d",)
};

console.log(integrate(default_f))
const norm_f = normalize(default_f);
console.log(integrate(norm_f));

console.log(inverse_integrate(default_f, 0, 0.5))
