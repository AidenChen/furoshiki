import Paginator from './src/paginator.vue'

Paginator.install = function (Vue) {
  Vue.component(Paginator.name, Paginator)
}

export default Paginator
