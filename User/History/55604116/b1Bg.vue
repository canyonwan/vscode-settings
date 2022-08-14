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

  // const state = reactive<IState>({
  //   unlawfulReason: [],
  //   dealWithData: []
  // })

  const state = ref<Recordable<ICauseBaseAttr[]>>({})

  function filterData() {
    state.value = props.data.reduce((pre, cur) => {
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
    <n-card title="违法理由" class="mb-4">
      <div v-for="item in state['1000000']" :key="item.attrId">
        {{ item.attrName }}
      </div>
    </n-card>
    <n-card title="处理依据"> a1 </n-card>
  </div>
</template>
