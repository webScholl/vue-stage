import initMixin from './init'
import renderMixin from './render'
import { lifeCycleMixin } from './lifecycle'
import { initGlobalAPI } from './global-api'
import { compileToFunction } from './compiler'
import { createElem, patch } from './dom/patch'
function Vue(options) {
  this._init(options) // 实现vue的初始化操作
}
initMixin(Vue)
renderMixin(Vue)
lifeCycleMixin(Vue)
initGlobalAPI(Vue)

const vm1 = new Vue({
  data() {
    return {
      name: 'zf'
    }
  }
})
const vm2 = new Vue({
  data() {
    return {
      name: 'jj'
    }
  }
})

const oldVnode = compileToFunction('<div style="color:red;font-size:30px;">{{name}}</div>').call(vm1)
const elm1 = createElem(oldVnode)
document.body.appendChild(elm1)

const newVnode = compileToFunction('<p class="root" style="color:green;font-size:15px;">{{name}}</p>').call(vm2)

setTimeout(() => {
  patch(oldVnode, newVnode) // 对比新老虚拟节点
}, 3000);

export default Vue

// 1、new Vue 会调用 _init()方法进行初始化操作
// 2、会将用户的选项放到 vm.$options上
// 3、会对当前选项上判断有没有data数据
// 4、有data 判断data是不是一个函数，如果是函数取返回值
// 5、observe 去观察data中的数据
// 6、通过vm._data = data 获取数据
// 7、循环proxy vm._data  vm[key] = vm._data[key]
// 8、通过__ob__进行标识这个对象是否已经被观测

// 如果有el 需要挂载在页面上
