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

document.title = process.env.VUE_APP_TITLE

export default new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
