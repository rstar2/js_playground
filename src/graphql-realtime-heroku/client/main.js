import Vue from 'vue';

import App from '@/App.vue';


new Vue({
    render: h => h(App)
}).$mount('#app');

console.log('Hi from main');

import '@/styles.css';
