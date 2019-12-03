import ZhLazyComponent from './ZhLazyComponent.vue'

ZhLazyComponent.install = (Vue, options) => {
  Vue.component(ZhLazyComponent.name, ZhLazyComponent)
}

export default ZhLazyComponent
