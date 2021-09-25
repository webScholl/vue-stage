let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.watchs = []
  }
  addWatcher(watcher) {
    this.watchs.push(watcher)
  }
  notice() {
    this.watchs.forEach(watch => {
      watch.get()
    })
  }
}
Dep.target = null
export default Dep