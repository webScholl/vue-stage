import { isObject } from '../utils'
import arrayMethods from './array'
import Dep from './dep'
class Observer {
  constructor(data) {
    // data.__ob__ = this 
    this.dep = new Dep()
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
function addWatcher(val) {
  val.forEach(e => {
    e.__ob__ && e.__ob__.dep.addWatcher(Dep.target) // 如果是对象就添加Watcher
    if (Array.isArray(e)) {
      addWatcher(e)
    }
  })
}
// vue2应用了defineProperty需要一加载都时候，就进行递归操作，所以耗性能，如果层次过深也会浪费性能
function defineReactive(obj, key, val) { //这里是闭包
  let childOb = observe(val) // 递归进行观测数据 不管有多少层都进行defineProperty
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.addWatcher(Dep.target) // 每次渲染的时候把当前watch存放到当前属性到Watchers里面，等待修改属性值之后触发存放在Watchers到Watcher，实现渲染
        if (childOb) {
          childOb.dep.addWatcher(Dep.target)
          if (Array.isArray(val)) { // 对val的每个子元素对象 添加watcher
            addWatcher(val)
          }
        }
      }
      return val
    },
    set(newVal) {
      observe(newVal)
      val = newVal
      dep.notify()
    },
  })
}
function observe(data) {
  if (!isObject(data)) return
  if (data.__ob__) return
  return new Observer(data)
}
export default observe