import Vue from 'vue';
import VueApollo from 'vue-apollo';

import App from '@/App.vue';
import apolloClient from './apollo';

// use as plugin
Vue.use(VueApollo);

// The provider holds the Apollo client instances that can then be used by all the child components.
// All the components under the one which has the 'apolloProvider' option have an '$apollo' helper 
// You can access the apollo-client instances with 'this.$apollo.provider.defaultClient'
// or 'this.$apollo.provider.clients.<key>' (for Multiple clients) in all your vue components.
const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
        $loadingKey: 'loading'
    }
});


new Vue({
    apolloProvider,
    // provide: apolloProvider.provide(),

    render: h => h(App)
}).$mount('#app');

console.log('Hi from main');

import '@/styles.css';
