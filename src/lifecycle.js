import { patch } from "./dom/patch"
import Watcher from "./observe/watcher"

export function mountComponent(vm) {
  const updateComponentFn = () => {
    const vnode = vm._render()
    vm._update(vnode)
  }
  new Watcher(vm, updateComponentFn, () => {
    console.log('组件挂载完毕');
  })
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

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  handlers && handlers.forEach(handler => handler.call(vm))
}