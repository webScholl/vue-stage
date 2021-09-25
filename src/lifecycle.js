import { patch } from "./dom/patch"
import Watcher from "./observe/watcher"

export function mountComponent(vm) {
  new Watcher(vm)
}
export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    const ele = patch(vnode)
    console.log('生成真实ele:', ele)

    vm.$el.parentNode.insertBefore(ele, vm.$el.nextSibling)
    vm.$el.parentNode.removeChild(vm.$el)
    vm.$el = ele
  }
}