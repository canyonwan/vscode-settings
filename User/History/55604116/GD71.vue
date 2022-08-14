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

    console.log('%c [ res ]-23', 'font-size:13px; background:#0095FF; color:white;', res)
  }

  props.data && filterData()
</script>
<template>
  <div class="base-attr">base-attr </div>
</template>
