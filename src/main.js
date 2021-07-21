import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './store/store'
import './assets/style/index.less'
import './plugins/element'
import './plugins/server'
import './components/base'
import '@/assets/lib/index.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
