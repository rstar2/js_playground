import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes';
import VueMaterialDesign from './md';
import App from './App.vue';

Vue.use(VueRouter);
Vue.use(VueMaterialDesign);

Vue.config.productionTip = false;

// 3. Create the router instance and pass the `routes` option
const router = new VueRouter({
    routes
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
