import { isFuntion } from './utils'
import observe from './observe'
function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}
function initData(vm) {
  let data = vm.$options.data
  vm._data = data = isFuntion(data) ? data.call(vm) : data
  observe(data) // 观测数据

  Object.keys(data).forEach(key => { // 代理数据（懒代理）
    proxy(vm, key, '_data')
  })
}

function proxy(vm, key, source) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    },
  })
}
export default initState