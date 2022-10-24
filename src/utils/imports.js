import Vue from "vue";

// ElementUI
import ElementUI from 'element-ui';
import enLang from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  locale: enLang //  set element-ui default language
})

import VueRandomColor from 'vue-randomcolor'
 
Vue.use(VueRandomColor)

window.Vue = Vue;

// Dont import everything here
// Only import those will be used by many components here.
// Else, import individually in respective component
// Reason: reduce webpack size and thus increase performance.
