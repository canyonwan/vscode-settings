// 节点名称  文书材料  违法行为    证据
export const tabOptions = [
  {
    label: '节点名称',
    value: 1
  },
  {
    label: '文书材料',
    value: 2
  },
  {
    label: '违法行为',
    value: 3
  },
  {
    label: '证据',
    value: 4
  }
]

// dynamic comp
export const dynamicComp = {
  1: defineAsyncComponent(() => import('@/views/waste/components/node-name.vue')),
  2: defineAsyncComponent(() => import('@/views/waste/components/document-material.vue')),
  3: defineAsyncComponent(() => import('@/views/waste/components/illegal-act.vue')),
  4: defineAsyncComponent(() => import('@/views/waste/components/evidence.vue'))
}
