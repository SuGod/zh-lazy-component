import ZhLazyComponent from './ZhLazyComponent.vue'

// ZhLazyComponent.install = (Vue, options) => {
//   Vue.component(ZhLazyComponent.name, ZhLazyComponent)
// }

// 存储组件列表
const components = [ ZhLazyComponent ]

const install = function (Vue) {
  if (install.installed) return
  components.map(component => Vue.component(component.name, component))
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default { install, ZhLazyComponent }
