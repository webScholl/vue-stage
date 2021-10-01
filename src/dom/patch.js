import { isSameNode } from "../utils"

function updateProperties(vnode, oldAttrs = {}) {
  for (const key in vnode.attrs) {
    if (key === 'style') {
      for (const k in vnode.attrs[key]) {
        vnode.el.style[k] = vnode.attrs[key][k]
      }
    } else {
      vnode.el.setAttribute(key, vnode.attrs[key])
    }
  }
  for (const key in oldAttrs) {
    if (key === 'style') {
      for (const k in oldAttrs[key]) {
        if (!vnode.el.style[k]) {
          vnode.el.style[k] = ''
        }
      }
    } else {
      if (!vnode.attrs[key]) {
        vnode.el.removeAttribute(oldAttrs[key])
      }
    }
  }

}
export function createElem(vnode) {
  if (vnode.tag) {
    vnode.el = document.createElement(vnode.tag)
    updateProperties(vnode)
    vnode.children.forEach(child => {
      vnode.el.appendChild(createElem(child))
    })
  } else {
    vnode.el = document.createTextNode(vnode.text)
  }
  return vnode.el
}

export function patch(oldVnode, newVnode) {
  if (oldVnode.nodeType) {
    const elm = createElem(newVnode)
    const parentNode = oldVnode.parentNode
    parentNode.insertBefore(elm, oldVnode.nextSibling)
    parentNode.removeChild(oldVnode)
  } else {
    if (!isSameNode(oldVnode, newVnode)) {
      oldVnode.el.parentNode.replaceChild(createElem(newVnode), oldVnode.el)
      return
    }
    const _elm = newVnode.el = oldVnode.el // 复用节点
    if (!oldVnode.tag) {
      if (oldVnode.text !== newVnode.text) {
        _elm.textContent = newVnode.text
      }
    }
    if (isSameNode(oldVnode, newVnode)) {
      updateProperties(newVnode, oldVnode.attrs)
    }
  }
}