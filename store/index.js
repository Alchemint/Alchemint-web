import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import sarConfig from './modules/sarConfig'
import getters from './getters'

Vue.use(Vuex);

const store = () => new Vuex.Store({
  modules: {
    app,
    sarConfig,
  },
  getters
});

export default store;
