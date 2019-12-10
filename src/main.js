'use strict';
import Vue from 'vue'
import App from './App.vue'
import store from "./vuex/store"
import VueMeta from 'vue-meta'

Vue.config.productionTip = false
Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
})

function init(target, ad_id, options){
  window.play_end = false;
  window.play_options = options;
  new Vue({
    render: h => h(App, {
      props: {
        ad_id,
        options
      }
    }),
    store
  }).$mount(target)
}
const playin = {
  init
}
window.playin = playin
export default playin;
