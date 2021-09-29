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