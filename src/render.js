import { createElement, createText } from "./dom"
import { isObject } from "./utils"

function renderMixin(Vue) {
  Vue.prototype._c = function () { // 创建元素
    const vm = this
    return createElement(vm, ...arguments)
  }
  Vue.prototype._v = function (text) { // 创建文本
    const vm = this
    return createText(vm, text)
  }
  Vue.prototype._s = function (val) { // JSON.stringify
    if (isObject(val)) return JSON.stringify(val)
    return val
  }
  Vue.prototype._render = function () {
    const vm = this
    const { render, el } = vm.$options
    const vnode = render.call(vm)
    console.log('生成vnode:', vnode)
  }
}
export default renderMixin