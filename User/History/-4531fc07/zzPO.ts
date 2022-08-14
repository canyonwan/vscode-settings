export function reactive(raw: any) {
  return new Proxy(raw, {
    get(target, key) {
      // 
    },
    set(target, key, value) {
      // 
    }

    
  })
  
}
