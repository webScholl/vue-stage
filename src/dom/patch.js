import { isSameVnode } from "../utils"
function updateChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 优化向后追加逻辑
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
      // 优化向前追加逻辑
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode); // 比较孩子 
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }
  }
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
      parent.insertBefore(createElm(newChildren[i]), ele);
    }
  }
}
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
function createComponent(vnode) {
  let i = vnode.attrs
  if ((i = i.hook) && (i = i.init)) {
    i(vnode)
  }
  if (vnode.componentInstance) {
    return true
  }
}
export function createElm(vnode) {
  if (vnode.tag) {
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el
    }
    vnode.el = document.createElement(vnode.tag)
    updateProperties(vnode)
    vnode.children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(vnode.text)
  }
  return vnode.el
}

export function patch(oldVnode, newVnode) {
  if (!oldVnode) { // 组件的挂载
    return createElm(newVnode)
  }
  if (oldVnode.nodeType) {
    const elm = createElm(newVnode)
    const parentNode = oldVnode.parentNode
    parentNode.insertBefore(elm, oldVnode.nextSibling)
    parentNode.removeChild(oldVnode)
    return elm
  } else {
    if (!isSameVnode(oldVnode, newVnode)) {
      const elm = createElm(newVnode)
      oldVnode.el.parentNode.replaceChild(elm, oldVnode.el)
      return elm
    }
    const _elm = newVnode.el = oldVnode.el // 复用节点
    if (!oldVnode.tag) {
      if (oldVnode.text !== newVnode.text) {
        _elm.textContent = newVnode.text
      }
    }
    if (isSameVnode(oldVnode, newVnode)) {
      updateProperties(newVnode, oldVnode.attrs)
    }

    // 比较孩子节点
    let oldChildren = oldVnode.children || [];
    let newChildren = newVnode.children || [];
    // 新老都有需要比对儿子
    if (oldChildren.length > 0 && newChildren.length > 0) {
      updateChildren(_elm, oldChildren, newChildren)
      // 老的有儿子新的没有清空即可
    } else if (oldChildren.length > 0) {
      _elm.innerHTML = ''
      // 新的有儿子
    } else if (newChildren.length > 0) {
      for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i]
        _elm.appendChild(createElm(child));
      }
    }
    return _elm
  }
}