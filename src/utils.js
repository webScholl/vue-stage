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