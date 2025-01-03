const last_diminisher_prop = (
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

const even_paz_prop = (
`const iter = (N_curr, R_curr) => {
    if (N_curr.length === 0) return;

    if (N_curr.length % 2 === 1) {
        const marks = N_curr.map(i => [ V[i].mark(R_curr[0], 1 / n), i ]); 
        const [ mark, j ] = marks.minBy(x => x[0]);
        assert(mark != Infinity, "Impossible, not enough cake left!");

        const [ left_piece, right_piece ] = R_curr.cut(mark);
        A[j] = A[j].pushed(left_piece);
        N_curr = N_curr.subtract(j);
        R_curr = right_piece;
        iter(N_curr, R_curr);
        return;
    }

    const marks = N_curr.map(i => {
        const val = V[i].eval(R_curr[0], R_curr[1]);
        const mark = V[i].mark(R_curr[0], val / 2);
        return [ mark, i ];
    }).sortedBy(x => x[0]);
    const mid = N_curr.length / 2;
    const [ mark, _ ] = marks[mid];

    const [ left_R_curr, right_R_curr ] = R_curr.cut(mark);
    const left_N_curr = marks.slice(0, mid).map(x => x[1]).asSet();
    const right_N_curr = marks.slice(mid).map(x => x[1]).asSet();
    iter(left_N_curr, left_R_curr);
    iter(right_N_curr, right_R_curr);
};

iter(N, C);
`
);

export const algorithms = {
    "Last Diminisher (Proportional)": last_diminisher_prop,
    "Even-Paz (Proportional)": even_paz_prop,
};

const steps = (num_steps) => (
`const subints = subintervals([0, 1], ${num_steps});
const functions = gen_rands(${num_steps}).map(r => (x => r));
V[i] = subints.zipWith(functions);`
);

export const valuation_generators = {
    steps: steps(10)
}