import { algorithm_preset_button_el, algorithm_preset_cont_el, algorithm_preset_modal_el, code_highlight, code_input, editor_panel, modal_container_el, n_input, panel_divider, panels, title, val_code_input, visual_panel, algorithm_preset_button_close_el } from './constants.js';
import { algorithms, valuation_generators } from './preset_code.js';

export let n = 5;

export let valuation_code = valuation_generators.steps;

export let code = algorithms['Last Diminisher (Proportional)'];

// Input Binding

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

// Hightlight Scroll Binding

let highlight_line = 0;
export const update_highlight = (line=highlight_line) => {
    highlight_line = line;
    const highlight_offset = highlight_line * 24;
    const scroll_offset = code_input.scrollTop;
    code_highlight.style.top = highlight_offset - scroll_offset + 'px';
};
code_input.addEventListener('scroll', e => {
    code_highlight.classList.remove("transition-all", "ease-in-out", "delay-100");
    update_highlight();
    code_highlight.classList.add("transition-all", "ease-in-out", "delay-100");
});

// Tab Enabling

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

// Panel Resizing

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

// Loading Presets

const show_algo_presets = () => {
    modal_container_el.classList.remove("hidden");
    algorithm_preset_modal_el.classList.remove("hidden");
};

const hide_algo_presets = () => {
    modal_container_el.classList.add("hidden");
    algorithm_preset_modal_el.classList.add("hidden");
};

const algo_preset_buttons = Object.entries(algorithms).map(([opt_name, opt_code]) => {
    const el = document.createElement('button');
    el.className = "border-gray-500 border-[1px] px-3 py-2 hover:border-blue-600 hover:text-blue-600 hover:ring-[1px] hover:ring-blue-600 transition-all ease-in-out delay-100";
    el.textContent = opt_name;
    el.onclick = () => {
        code_input.value = opt_code;
        code = opt_code;
        hide_algo_presets();
    };
    return el;
});

algorithm_preset_cont_el.append(...algo_preset_buttons);
algorithm_preset_button_el.onclick = show_algo_presets;
algorithm_preset_button_close_el.onclick = hide_algo_presets;