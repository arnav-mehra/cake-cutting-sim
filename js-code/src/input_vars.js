import { code_input, editor_panel, n_input, panel_divider, panels, title, val_code_input, visual_panel } from './constants.js';

export let n = 5;

export let valuation_code = `const subints = subintervals([0, 1], 10);
const functions = gen_rands(10).map(r => (x => r));
V[i] = subints.zipWith(functions);
`;

export let code = (
`let N_rem = N.copy(); // agents without an allocation.
let R = C; // the remainder of the original cake, C, we cut from. 

for (let i of range(1, n)) {
    // find the earlist mark of value 1/n for a remaining agent.
    const marks = N_rem.map(i => [ V[i].mark(R[0], 1 / n), i ]); 
    const [ mark, j ] = marks.minBy(x => x[0]);
    assert(mark != Infinity, "Impossible, not enough cake left!");

    // cut along the earliest mark.
    const [ left_piece, right_piece ] = R.cut(mark);
    
    // allocate the left piece to the agent that made the mark.
    A[j] = A[j].pushed(left_piece);
    N_rem = N_rem.subtract(j);

    // the right piece is our new remainder
    R = right_piece;
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

val_code_input.value = valuation_code;
val_code_input.addEventListener('input', e => {
    valuation_code = e.target.value;
});

[code_input, val_code_input].forEach(el => {
    el.addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            const after_tab = this.selectionStart + 1;
            this.value = this.value.substring(0, this.selectionStart)
                + "\t" + this.value.substring(this.selectionEnd);
            this.selectionStart = after_tab;
            this.selectionEnd = after_tab;
        }
    });
});

let drag_divider = false;
panel_divider.addEventListener('mousedown', e => {
    drag_divider = true;
    document.body.style.userSelect = 'none';
});
window.addEventListener('mouseup', e => {
    drag_divider = false;
    document.body.style.userSelect = 'auto';
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
};

const convertRemToPixels = (rem) => {    
    return rem * parseFloat(getComputedStyle(panels).fontSize);
};