export const log = [];

export const logged_object = (op, obj) => {
    const logged_obj = {};
    Object.entries(obj).forEach(([key, default_val]) => {
        let val = default_val;
        Object.defineProperty(logged_obj, key, {
            get: function() {
                return val;
            },
            set: function(v) {
                log.push([op, key, v]);
                val = v;
            }
        });
    });
    return logged_obj;
};

export const logged_exec = (i) => {
    const action = ["exec", i];
    log.push(action);
};

export const clear_log = () => {
    log.length = 0;
};