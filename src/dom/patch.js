function updateProperties(el, attrs = {}) {
  for (const key in attrs) {
    el.setAttribute(key, attrs[key])
  }
}
export function patch(vnode) {
  if (vnode.tag) {
    vnode.el = document.createElement(vnode.tag)
    updateProperties(vnode.el, vnode.attrs)
    vnode.children.forEach(child => {
      vnode.el.appendChild(patch(child))
    })
  } else {
    vnode.el = document.createTextNode(vnode.text)
  }
  return vnode.el
}