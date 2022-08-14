<script setup lang="ts">
  import type { ICauseBaseAttr } from '@/api/cause-manage/types'

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

  props?.data?.length > 0 && filterData()
</script>
<template>
  <n-empty v-if="Object.keys(state).length === 0" description="暂无数据" />

  <div class="base-attr">
    <n-card class="mb-4" hoverable>
      <n-grid cols="7" v-for="item in state['1000000']" :key="item.attrId">
        <n-gi span="1">
          {{ item.attrName }}
        </n-gi>
        <n-gi span="6">
          <div v-for="ele in item.attrData" :key="ele.id">
            {{ ele.content }}
          </div>
        </n-gi>
      </n-grid>
    </n-card>
    <n-card hoverable>
      <n-grid cols="7" v-for="item in state['1000001']" :key="item.attrId">
        <n-gi span="1">
          {{ item.attrName }}
        </n-gi>
        <n-gi span="6">
          <div v-for="ele in item.attrData" :key="ele.id">
            {{ ele.content }}
          </div>
        </n-gi>
      </n-grid>
    </n-card>
  </div>
</template>
