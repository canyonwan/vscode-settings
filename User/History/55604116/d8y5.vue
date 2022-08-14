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
      }
      return pre
    }, {})
  }
</script>
<template>
  <div class="base-attr">base-attr </div>
</template>
