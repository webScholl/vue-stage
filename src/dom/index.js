export function createElement(vm, tag, attrs = {}, ...children) {
  return vnode(vm, tag, attrs, children, attrs.key, undefined)
}
export function createText(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}
function vnode(vm, tag, attrs, children, key, text) {
  return { vm, tag, attrs, children, key, text }
}
