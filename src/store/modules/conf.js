
import Vue from "vue";

const state = {
  dic: null,
  conf: null,
  lang: null,
  langLoaded: false
};

const getters = {
  isConfLoaded: state => !!state.conf,
  isReady: state => state.langLoaded && state.dic,
  languages: state => state.lang,
  dictionary: state => state.dic,
  config: state => state.conf
};

const actions = {
  'DicLoad': ({ commit }) => {

    return Vue.http
      .get(state.conf.baseUrl+"/etis/dictionary", {})
      .then(res => {
        commit('DicLoad', res.body);
        return res.body;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => { })
  },
  'ConfLoad': ({ commit, dispatch }) => {
    return Vue.http.get("config.json", { params: getRandomId() })
      .then(res => {
        if (res && res.data) {
          commit('ConfLoad', res.data);
        }
      })
      .finally(() => {
        Vue.http
          .get("lang.json", { params: getRandomId() })
          .then(res => {
            if (res && res.data) {
              commit('LangLoadStatic', res.data);
              dispatch('DicLoad');
              return true;
            }
          },
            error => {
              console.log(error);
            })
      })
  }
};

const mutations = {
  'DicLoad': (state, resp) => {
    Vue.set(state, "dic", resp);
  },
  'ConfLoad': (state, resp) => {
    Vue.set(state, "conf", resp);
  },

  'LangLoadStatic': (state, resp) => {
    Vue.set(state, "lang", resp);
    Vue.set(state, "langLoaded", true);
  },
};


export default {
  state,
  getters,
  actions,
  mutations
};


function getRandomId() {
  return { id: Math.floor(Math.random() * 100001) }
}



