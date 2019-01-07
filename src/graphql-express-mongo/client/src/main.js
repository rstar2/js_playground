import Vue from 'vue';
import App from './App.vue';

import VueMaterialDesign from './md';

Vue.use(VueMaterialDesign);

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');
