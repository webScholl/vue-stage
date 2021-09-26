import { nextTick } from "../utils"

let watcherIds = new Set()
let queue = []
let pedding = false

function flushSchedulerQueue() {
  queue.forEach(watcher => {
    watcher.get() // 触发渲染

    watcherIds = new Set()
    queue = []
    pedding = false
  })
}

export function queueWatcher(watcher) {
  const watcherId = watcher.id
  if (!watcherIds.has(watcherId)) {
    watcherIds.add(watcherId)
    queue.push(watcher)
    if (!pedding) {
      pedding = true //锁
      nextTick(flushSchedulerQueue) // 异步更新
    }
  }
}