import Vue from "vue";

const state = { auth: { isAuthenticated: false, approved: false, azureUrl:false } };
if (localStorage.auth) {
  state.auth = JSON.parse(localStorage.auth);
}

const getters = {
  isAuthenticated: state => {
    return  state.auth.isAuthenticated
  },
  azureUrl: state => {
    return state.auth.azureUrl;
  },
}

const actions = {
  'Authentificate': ({ commit }, obj) => {
    commit('Authentificate', obj);
  },
  'azureUrl': ({ commit }, obj) => {
    commit('azureUrl', obj);
  },
  'Clear': () => {
    // commit('Authentificate', null);
    // commit('SaveUserInfo',   null);
  }
}

const mutations = {
  'Authentificate': (state, resp) => {   
    Vue.set(state.auth, "isAuthenticated", resp);
    localStorage.auth = JSON.stringify(state.auth);
  },
 
  'azureUrl': (state, resp) => {
    Vue.set(state.auth, "azureUrl", resp);
  },
}

export default {
  state,
  getters,
  actions,
  mutations
};
