import Vue from "vue";
import Vuex from "vuex";
import getters from './getters'
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

// you do not need `import app from './modules/app'`
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  strict: debug
});

export default store;
