import Vue from "vue";
function getOBJ() {
  return JSON.parse(JSON.stringify({'lang': 'en-GB', info: null, profile: {roleId:0}, feedback: null, tutorial: null }));
}
const state = { user:getOBJ(), isEditFt: false, isBusy:false};
if (localStorage.user) {
  state.user = JSON.parse(localStorage.user);
}
const getters = {
  user: (state) => {
    return state.user;
  },
  isEditFt: state => state.isEditFt,
  approved: state => {
    return  state.user.profile && state.user.profile.privacy;
  },
  isAdmin: state => {
    return  state.user.profile && state.user.profile.roleId==3;
  },
  isNCP: state => {
    return  state.user.profile && state.user.profile.roles && state.user.profile.roles.split(',').some(r=>r=="NCP");
  },
  isOP: state => {
    return  state.user.profile && state.user.profile.roles && state.user.profile.roles.split(',').some(r=>r=="Operation");
  },
  isELearning: state => {
    return  state.user.profile && state.user.profile.roles && state.user.profile.roles.split(',').some(r=>r=="eLearning");
  },
  isUserBusy: state => state.isBusy
};

const actions = {
  'Approve': ({ commit }, obj) => {
    commit('Approve', obj);
  },

  'SaveUserFeedback': ({ commit }, obj) => {
    commit('SaveUserFeedback', obj);
  },

  'SaveUserTutorial': ({ commit }, obj) => {
    commit('SaveUserTutorial', obj);
  },

  'SaveUserProfile': ({ commit }, obj) => {
    commit('SaveUserProfile', obj);
  },

  'SaveUserInfo': ({ commit }, obj) => {
    commit('SaveUserInfo', obj);
  },
  'SetLanguage': ({ commit }, obj) => {
    commit('SetLanguage', obj);
  },
  'SetIsEditFt': ({ commit }, obj) => {
    commit('SetIsEditFt', obj);
  },
  'SetIsUserBusy': ({ commit }, obj) => {
    commit('SetIsUserBusy', obj);
  },
  'SetFeature': ({ commit }, obj) => {
    commit('SetFeature', obj);
  },

  'ResetUser': ({ commit }) => {
    commit('ResetUser');
  },

};

const mutations = {
  'Approve': (state, resp) => {
    Vue.set(state.user.profile, "privacy", resp);
    localStorage.user = JSON.stringify(state.user);
  },

  'SetFeature': (state, resp) => {
    Vue.set(state.user.profile, "feature", resp);
    localStorage.user = JSON.stringify(state.user);
  },

 

  'SetIsEditFt': (state, resp) => {
    Vue.set(state, "isEditFt", resp);
  },
  'SetIsUserBusy': (state, resp) => {
    Vue.set(state, "isBusy", resp);
  },

  'SaveUserProfile': (state, resp) => {
    Vue.set(state.user, "profile", resp);
    localStorage.user = JSON.stringify(state.user);
  },

  'SaveUserTutorial': (state, resp) => {
    Vue.set(state.user, "tutorial", resp);
    localStorage.user = JSON.stringify(state.user);
  },

  'SaveUserFeedback': (state, resp) => {
    Vue.set(state.user, "feedback", resp);
    localStorage.user = JSON.stringify(state.user);
  },

  'SaveUserInfo': (state, resp) => {
    Vue.set(state.user, "info", resp);
    localStorage.user = JSON.stringify(state.user);
  },
  'SetLanguage': (state, resp) => {
    Vue.set(state.user, "lang", resp);
    localStorage.user = JSON.stringify(state.user);
  }
  ,
  'ResetUser': (state) => { 
    Vue.set(state,'user', getOBJ());
    localStorage.user = JSON.stringify(state.user);
  }

};

export default {
  state,
  getters,
  actions,
  mutations
};
