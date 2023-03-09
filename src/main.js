import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import './components';
import store from './store';
import router from './router';
import filters from './plugins/filters';
Vue.use(filters)

//validity
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)


import '@fortawesome/fontawesome-free/css/all.css';

import './providers/HttpProvider.js';
import './theme/index.scss';
import AuthService  from './auth/auth.service';
// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);


var $ = require('jquery');
import "jquery-mousewheel";
import  'malihu-custom-scrollbar-plugin';
require('malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css')


import VueTypedJs from 'vue-typed-js'
Vue.use(VueTypedJs)

// require('malihu-custom-scrollbar-plugin')($);



Vue.config.productionTip = false

let vue = new Vue({
    router,
    store,
  render: h => h(App),
}).$mount('#app')

AuthService.prototype.$router = vue.$router;
AuthService.prototype.$bvToast = vue.$bvToast;