import Dep from "./dep"

class Watcher {
  constructor(vm) {
    this.vm = vm
    this.deps = []
    this.depIds = new Set()
    this.get(vm)
  }
  get() {
    Dep.target = this
    this.geter()
    Dep.target = null
  }
  geter() {
    const vnode = this.vm._render()
    this.vm._update(vnode)
  }
  addDep(dep) {
    const depId = dep.id
    if (!this.depIds.has(depId)) {
      this.depIds.add(depId)
      this.deps.push(dep)
      dep.addWatcher(this)
    }
  }
}
export default Watcher