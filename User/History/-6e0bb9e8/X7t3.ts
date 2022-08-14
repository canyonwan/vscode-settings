import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/iview.ts'
import '@/assets/scss/manage.scss'
import { parseTime } from '@/utils'

Vue.config.productionTip = false
Vue.filter('timeParse', parseTime)
new Vue({
  router,
  store,
  render: h => h(App),
  components: {
    App,
  },
}).$mount('#app')
