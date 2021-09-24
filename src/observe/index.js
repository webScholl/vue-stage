import { isObject } from '../utils'
import arrayMethods from './array'
class Observer {
  constructor(data) {
    // data.__ob__ = this 
    Object.defineProperty(data, '__ob__', { // 给对象和数组添加一个自定义属性__ob__
      value: this,
      enumerable: false // 标识这个属性不能被枚举
    })
    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods

      this.observeArray(data) // 对数组内对元素进行观测
    } else {
      this.walk(data)
    }
  }
  observeArray(data) {
    data.forEach(val => {
      observe(val)
    })
  }
  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}
// vue2应用了defineProperty需要一加载都时候，就进行递归操作，所以耗性能，如果层次过深也会浪费性能
function defineReactive(obj, key, val) { //这里是闭包
  observe(val) // 递归进行观测数据 不管有多少层都进行defineProperty
  Object.defineProperty(obj, key, {
    get() {
      return val
    },
    set(newVal) {
      observe(newVal)
      val = newVal
    },
  })
}
function observe(data) {
  if (!isObject(data)) return
  if (data.__ob__) return
  new Observer(data)

}
export default observe