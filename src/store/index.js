import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';
import state from './state';
import createLogger from 'vuex/dist/logger'; // 控制台打印数据更新的日志

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'; // 调试工具，帮助我们查看vuex的修改

export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state,
  strict: debug,
  plugins: debug ? [createLogger()] : []
});