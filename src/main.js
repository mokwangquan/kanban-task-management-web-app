// NPM: MAIN
import Vue from "vue";

// PROJECT: MAIN
import App from "./App.vue";
import store from "./store";

// PROJECT: OTHER
require("./utils/imports");

/**************************************************************************
 * VUE INSTANCE
 **************************************************************************/
Vue.config.productionTip = false;

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

export default new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
