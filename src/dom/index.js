import { isObject, isReservedTag } from "../utils"

function createComponent(vm, tag, attrs, children, key, text, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }
  attrs.hook = {
    init(vnode) {
      vnode.componentInstance = new Ctor()  // 初始化组件
      vnode.componentInstance.$mount() // 挂载组件
    }
  }
  return vnode(vm, `vc-${tag}`, attrs, children, key, text, { Ctor })
}
export function createElement(vm, tag, attrs = {}, ...children) {
  if (!isReservedTag(tag)) {
    const Ctor = vm.$options.components[tag]
    return createComponent(vm, tag, attrs, undefined, attrs.key, undefined, Ctor)
  } else {
    return vnode(vm, tag, attrs, children, attrs.key, undefined)
  }

}
export function createText(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}
function vnode(vm, tag, attrs, children, key, text, componentOptions) {
  return { vm, tag, attrs, children, key, text, componentOptions }
}
