<script setup lang="ts">
  import { ICauseBaseAttr } from '@/api/cause-manage/types'

  const props = defineProps({
    data: {
      type: Array as PropType<ICauseBaseAttr[]>,
      default: () => []
    }
  })

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

  props?.data.length > 0 && filterData()
</script>
<template>
  <div class="base-attr">
    <n-card title="违法理由" class="mb-4">
      <template v-if="state['1000000'].length === 0">
        <n-empty description="还没有违法理由" style="min-height: 300px" />
      </template>
      <n-grid cols="7" v-for="item in state['1000000']" :key="item.attrId">
        <n-gi span="1">
          {{ item.attrName }}
        </n-gi>
        <n-gi span="6">
          {{ item.attrName }}
        </n-gi>
      </n-grid>
    </n-card>
    <n-card title="处理依据">
      <template v-if="state['1000001'].length === 0">
        <n-empty description="还没有处理依据" style="min-height: 300px" />
      </template>
      <div v-for="item in state['1000001']" :key="item.attrId">
        {{ item.attrName }}
      </div>
    </n-card>
  </div>
</template>
