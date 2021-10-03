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
    const prevVnode = vm._vnode
    vm._vnode = vnode
    if (!prevVnode) { // 挂载
      vm.$el = patch(vm.$el, vnode, vm)
    } else { //更新时做diff操作
      vm.$el = patch(prevVnode, vnode, vm)
    }

  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  handlers && handlers.forEach(handler => handler.call(vm))
}