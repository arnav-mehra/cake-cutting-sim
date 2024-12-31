import { code_input, editor_panel, n_input, panel_divider, panels, title, visual_panel } from './constants.js';

export let n = 5;

export let code = (
`let N_rem = new Set(N);
let curr_start = 0;

for (let i of range(1, n)) {
    const marks = N_rem.map(i => [ V[i].mark(curr_start, 1 / n), i ]);    
    const [ mark, j ] = marks.minBy(x => x[0]);
    assert(mark != Infinity, "Impossible, not enough cake left!");

    N_rem = N_rem.subtract(j);
    A[j] = A[j].pushed([curr_start, mark]);
    curr_start = mark;
}`
);

n_input.value = n;
n_input.addEventListener('input', e => {
    n = Number(e.target.value);
});

code_input.value = code;
code_input.addEventListener('input', e => {
    code = e.target.value;
});

let drag_divider = false;
panel_divider.addEventListener('mousedown', e => {
    drag_divider = true;
});
window.addEventListener('mouseup', e => {
    drag_divider = false;
});

window.addEventListener('mousemove', e => {
    if (drag_divider) {
        change_editor_width(e.movementX);
    }
});
window.addEventListener('resize', e => {
    change_editor_width(0);
})

const change_editor_width = (inc) => {
    let new_width = editor_panel.clientWidth + inc;

    const min_width = 200;
    new_width = Math.max(new_width, min_width);
    set_editor_width(new_width);

    const actual_width = editor_panel.clientWidth + visual_panel.clientWidth + convertRemToPixels(2.25);
    const max_width = title.clientWidth;
    const overflow = actual_width - max_width;
    if (overflow > 0) {
        new_width -= overflow;
        set_editor_width(new_width);
    }
};

const set_editor_width = (new_width) => {
    editor_panel.style.minWidth = new_width + "px";
    editor_panel.style.width = new_width + "px";
}

function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(panels).fontSize);
}