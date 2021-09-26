import Dep from "./dep"
import { queueWatcher } from "./scheduler"
let id = 0
class Watcher {
  constructor(vm, updateComponentFn, cb) {
    this.id = id++
    this.vm = vm
    this.updateComponentFn = updateComponentFn // 渲染函数
    this.cb = cb
    this.deps = []
    this.get(vm) // 上来就做一次初始渲染
  }
  get() {
    Dep.target = this // 保存当前Watcher到全局
    this.geter()
    Dep.target = null // 渲染完成后清空全局的Watcher
  }
  geter() {
    this.updateComponentFn()
  }
  addDep(dep) {
    this.deps.push(dep)
  }
  update() { // dep.notice触发该方法  将更新的watcher先存起来再依次触发渲染
    queueWatcher(this)
  }
}
export default Watcher