import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import { state, getters, mutations, actions } from './state';

import auth from './auth';

const store = new Vuex.Store({
    // demo store - will remove it later
    state, getters, mutations, actions,

    modules: {
        auth
    },

    strict: process.env.NODE_ENV !== 'production',
});

export default store;
