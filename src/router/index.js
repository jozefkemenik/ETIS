import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home.vue'
import store from '@/store';
//import { Role } from "@/auth/role"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../pages/Landing.vue'),
    meta: {}
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {}
  },
  {
    path: '/newsession',
    name: 'NewSession',
    component: () => import('../pages/RequestNewSession.vue'),
    meta: {}
  },
  {
    path: '/participants',
    name: 'participants',
    component: () => import('../pages/Participants.vue'),
    meta: {}
  },
  {
    path: '/draftsession',
    name: 'DraftSession',
    component: () => import('../pages/DraftSession.vue'),
    meta: {}
  },
  {
    path: '/sessions',
    name: 'sessions',
    component: () => import('../pages/Sessions'),
    meta: {}
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../pages/Profile'),
    meta: {}
  },
  

  { path: '*', redirect: '/' }
];
const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});
router.options['mode'] = "history";
router.beforeEach((to, from, next) => {
  console.log('store.getters.isAuthenticated', store.getters.isAuthenticated)
  if (store.getters.isAuthenticated) {
    if (to.name == "Landing") {
      next("/home");
    } else {
      next();
    }
  } else {
    if (to.name !== "Landing") {
      next('/');
    } else {
      next();
    }
  }
})
export default router 