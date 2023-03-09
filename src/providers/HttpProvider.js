
import Vue from 'vue';
import VueResource from 'vue-resource';

import dic1  from '../assets/mock/dictionary.json';
import dic2  from '../assets/mock/session.json';
import store  from '../store'
import user  from '../assets/mock/user.json';
import participant  from '../assets/mock/participant.json';

Vue.use(VueResource);
Vue.http.interceptors.push(function (request, next) {
    request.headers.set('Access-Control-Allow-Origin', '*');
    request.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    request.headers.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

  

    if (store.getters.config && store.getters.config.usemock && /dictionary/.test(request.url)) {
        next(
            request.respondWith(
                dic1,
                { status: 200 }
            ))

} 
else
if (store.getters.config && store.getters.config.usemock && /User/.test(request.url)) {
    next(
        request.respondWith(
            user,
            { status: 200 }
        ))

}
else
if (store.getters.config && store.getters.config.usemock && /participant/.test(request.url)) {
    next(
        request.respondWith(
            participant,
            { status: 200 }
        ))

}
else
if (store.getters.config && store.getters.config.usemock && /session/.test(request.url)) {
    next(
        request.respondWith(
            dic2,
            { status: 200 }
        ))

} 
else



next();
 });

