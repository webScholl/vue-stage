import { mergeOptions } from "../utils"

export function initGlobalAPI(Vue) {
  Vue.options = {} // 全局属性，在每个组件初始化的时候将这些属性放到每个组件上
  Vue.options.components = {}
  Vue.options._base = Vue
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)
    return this
  }
  Vue.extend = function (definition) {
    const Super = this
    function Sub() {
      this._init(definition)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.construcor = Sub
    return Sub
  }
  Vue.component = function (id, definition) {
    const name = definition.name || id
    // 调用Vue.extend 创建一个子类 来继承于 Vue 返回这个类
    this.options.components[name] = Vue.extend(definition)
  }
  Vue.filter = function () {

  }
  Vue.directive = function () {

  }
}