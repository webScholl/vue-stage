export function isFuntion(val) {
  return typeof (val) === 'function'
}
export function isObject(val) {
  return typeof (val) === 'object' && val !== null
}
let callbacks = []
let pedding = false
function flushCallbacks() {
  callbacks.forEach(fn => fn())
  callbacks = []
  pedding = false
}
export function nextTick(fn) {
  callbacks.push(fn)
  if (!pedding) {
    Promise.resolve().then(flushCallbacks)
    pedding = true
  }
}

let strats = {} // 存放
let lifeCycle = ['beforecreate', 'created', 'beforeMount', 'mounted']
lifeCycle.forEach(hook => {
  strats[hook] = function (parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal)
      } else {
        return Array.isArray(childVal) ? childVal : [childVal]
      }
    } else {
      return parentVal
    }
  }
})
strats.components = function (parentVal, childVal) {
  const res = Object.create(parentVal)
  for (const key in childVal) {
    res[key] = childVal[key]
  }
  return res
}
export function mergeOptions(parentVal, childVal) {
  const options = {}
  for (const key in parentVal) {
    mergeFiled(key)
  }
  for (const key in childVal) {
    mergeFiled(key)
  }
  function mergeFiled(key) {
    if (strats[key]) {
      options[key] = strats[key](parentVal[key], childVal[key])
    } else {
      options[key] = childVal[key] || parentVal[key]
    }
  }
  return options
}
export function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key
}

function makeMap(str) {
  const map = {}
  const list = str.split(',')
  list.forEach(ele => { map[ele] = true })
  return (ele) => map[ele]
}
export const isReservedTag = makeMap('a,div,img,image,text,span,input,p,button')