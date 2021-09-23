const oldArrayPrototype = Array.prototype
const arrayMethods = Object.create(oldArrayPrototype) // 让arrayMethods通过__proto__找到数组的原型方法
const methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse']
methods.forEach(method => {
  arrayMethods[method] = function (...args) { // 数组的方法重写操作
    let ob = this.__ob__
    oldArrayPrototype[method].call(this, ...args)
    let inserted = null
    switch (method) {
      case 'splice':
        inserted = args.slice(2)
      case 'push':
      case 'unshift':
        inserted = args
        break
    }
    if (inserted) ob.observeArray(inserted)
  }
})

export default arrayMethods
