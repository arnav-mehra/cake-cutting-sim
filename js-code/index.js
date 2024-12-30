import { PlottedValuation, Valuation } from './valuation.js';
import { range } from './util.js';

const allocate_proportionally = (V) => {
    const n = V.length;
    const prop = 1 / n;

    const allocs = {};
    let curr_start = 0;
    for (let _ of range(1, n)) {
        const [mark, j] = V.map((v, j) => allocs[j] ? Infinity : v.mark(curr_start, prop)).min();
        if (mark == Infinity) {
            throw new Error("Not enough cake left! This should never happen!");
        }

        allocs[j] = [[curr_start, mark]];
        curr_start = mark;
    }
    const residue = [[curr_start, 1]];

    return [allocs, residue];
};

const n = 5;
const detail = 10;
const scale_x = 120;
const scale_y = 30;

const agents = range(1, n).map(_ => 
    new PlottedValuation(document.body, 'red', scale_x, scale_y, detail)
);
console.log(agents)
const [allocs, residue] = allocate_proportionally(agents);
console.log(allocs);
console.log(residue);

Object.entries(allocs).forEach(([i, intervals]) => {
    intervals.forEach(interval => {
        console.log("highlighting " , i , interval)
        agents[i].highlight(interval, 'green');
    })
});

range(0, n - 1).forEach(i => {
    residue.forEach(interval => {
        console.log("highlighting " , i , interval)
        agents[i].highlight(interval, 'gray');
    })
});

// const plots = agents.map((v, i) => {
//     const cont = document.createElement('div');
//     const base_plot = v.gen_plot('red', scale_x, scale_y);
//     const alloc_overlays = allocs[i].map(interval => (
//         v.gen_plot_interval(interval, 'green', scale_x, scale_y)
//     ));
//     const layers = [ base_plot, ...alloc_overlays ];
//     cont.append(...layers);

//     cont.style.position = 'relative';
//     cont.style.width = scale_x + 'px';
//     cont.style.height = scale_y * 4 + 'px';
//     cont.style.overflow = 'hidden';
//     cont.style.border = '1px solid black';
//     layers.forEach(layer => {
//         layer.style.position = 'absolute';
//         layer.style.bottom = '0px';
//         layer.style.left = '0px';
//     });
//     alloc_overlays.forEach(overlay => {
//         overlay.style.zIndex = 10;
//     });

//     return cont;
// });

// console.log(plots)
// document.body.append(...plots);

// console.log(v.segments)
// console.log(v.values)

// const value = 0.5;
// const start = 0;
// const end = v.mark(start, value);

// console.log(end)
// console.log(v.eval(start,end))
// console.log(v.segments)
// console.log(v.mark(end,value))