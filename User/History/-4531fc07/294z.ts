export function reactive(raw: any) {
  return new Proxy(raw, {
    // target: { age: 10 }
    // key: age
    // value: 10
    get(target, key) {
      const res = Reflect.get(target, key)
      // TODO 依赖收集
      return res
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      return res
    }
  })
}
