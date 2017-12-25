import Vue from 'vue'
import App from './App'
// import router from './router'
import Furoshiki from '../packages/index'

Vue.config.productionTip = false
Vue.use(Furoshiki)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router,
  render: h => h(App)
})
