<script setup lang="ts">
  import { ICauseBaseAttr } from '@/api/cause-manage/types'

  const props = defineProps({
    data: {
      type: Array as PropType<ICauseBaseAttr[]>,
      default: () => []
    }
  })

  interface IState {
    unlawfulReason: ICauseBaseAttr[]
    dealWithData: ICauseBaseAttr[]
  }

  const state = reactive<IState>({
    unlawfulReason: [],
    dealWithData: []
  })

  function filterData() {
    const res = props.data.reduce((pre, cur) => {
      if (pre[cur.attrId]) {
        pre[cur.attrId].push(cur)
      } else {
        pre[cur.attrId] = [cur]
      }
      return pre
    }, {})
  }

  props.data && filterData()
</script>
<template>
  <div class="base-attr">
    <n-card title="违法理由"> a1 </n-card>
  </div>
</template>
