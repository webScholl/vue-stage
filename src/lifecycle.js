import { patch } from "./dom/patch"

export function mountComponent(vm) {
  const vnode = vm._render()
  vm._update(vnode)
}
export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    const ele = patch(vnode)
    console.log('生成真实ele:', ele)
    vm.$el.parentNode.insertBefore(ele, vm.$el)
    vm.$el.parentNode.removeChild(vm.$el)
  }
}