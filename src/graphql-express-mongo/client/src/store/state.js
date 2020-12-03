export const state = {
    count: 0
};

export const getters = {
    count(state) {
        return state.count;
    },

    isEven(state) {
        return state.count % 2 !== 0;
    },

    // can return a return a function also
    isEqual(state) {
        return (val) => {
            return state.count === val;
        };
    }
};

export const mutations = {
    changeBy(state, { val }) {
        state.count = state.count + val;
    },

    add(state) {
        state.count= state.count + 1;
    },
};

export const actions = {
    // sync
    changeBy(context, payload) {
        // call the mutation directly
        context.commit('changeBy', payload);

        // a  Promise.resolve() will be returned when called this.$store.dispatch("changeBy")
        // even if skipped as if we returned it explicitly
        // return Promise.resolve();
    },

    // async - can return
    add(context, payload) {
        // could call an external API or whatever async
        return new Promise((resolve) => {
            setTimeout(() => {
                // call the mutation when desired
                context.commit('add', payload);
                resolve();
            }, 2000);
        });
    },
};

