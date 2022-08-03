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
  strats[hook] = function (parentOptionVal, childOptionVal) {
    if (childOptionVal) {
      if (parentOptionVal) {
        return parentOptionVal.concat(childOptionVal)
      } else {
        return Array.isArray(childOptionVal) ? childOptionVal : [childOptionVal]
      }
    } else {
      return parentOptionVal
    }
  }
})
strats.components = function (parentOptionVal, childOptionVal) {
  const res = Object.create(parentOptionVal)
  for (const key in childOptionVal) {
    res[key] = childOptionVal[key]
  }
  return res
}
export function mergeOptions(parentOptions, childOptions) {
  const options = {}
  for (const key in parentOptions) {
    mergeFiled(key)
  }
  for (const key in childOptions) {
    mergeFiled(key)
  }
  function mergeFiled(key) {
    if (strats[key]) {
      options[key] = strats[key](parentOptions[key], childOptions[key])
    } else {
      options[key] = childOptions[key] || parentOptions[key]
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