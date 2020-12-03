import Vue from 'vue';

import store from './store';
import router from './router';
import VueMaterialDesign from './md';
import App from './App.vue';

// install the MaterialDesign Vue plugin
Vue.use(VueMaterialDesign);

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
