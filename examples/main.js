import Vue from 'vue'
import App from './App.vue'
import ZhLazyComponent from '../src/index'

Vue.config.productionTip = false

Vue.use(ZhLazyComponent)

new Vue({
  render: h => h(App)
}).$mount('#app')
