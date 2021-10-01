import initState from './state'
import { compileToFunction } from './compiler'
import { mountComponent } from './lifecycle'
import { mergeOptions, nextTick } from './utils'
function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(vm.constructor.options, options)
    initState(vm)

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    // template -> ast(抽象语法树)：描述模版结构
    // ast + data => 虚拟dom => 真实dom
    const vm = this
    const opts = vm.$options
    el = document.querySelector(el) //获取真实的元素
    vm.$el = el

    if (!opts.render) { // 生成render
      // 编译模版
      let template = opts.template
      if (!template) {
        template = el.outerHTML
      }
      let render = compileToFunction(template)
      opts.render = render
    }
    mountComponent(vm)
  }
  Vue.prototype.$nextTick = nextTick
}
export default initMixin