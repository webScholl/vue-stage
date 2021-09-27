let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.watchers = []
    this.watcherId = new Set()
  }
  addWatcher(watcher) {
    const watcherId = watcher.id
    if (!this.watcherId.has(watcherId)) {
      this.watcherId.add(watcherId)
      this.watchers.push(watcher)
      // 同时把当前到Watcher里存放dep 当前还没有用到
      watcher.addDep(this)
    }
  }
  notify() {
    this.watchers.forEach(watch => {
      watch.update()
    })
  }
}
Dep.target = null
export default Dep