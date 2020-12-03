import Events from '@/components/Events.vue';
import Bookings from '@/components/Bookings.vue';

import store from '@/store';

function redirectIfNotAuth(to, from, next) {
    if (store.getters['auth/isAuth']) {
        next();
    } else {
        next({ path: '/auth' });
    }
}

const routes = [
    { path: '/events', component: Events },
    {
        path: '/bookings',
        component: Bookings,
        beforeEnter: redirectIfNotAuth
    },
    { path: '/auth', component: Events },

];

export default routes;