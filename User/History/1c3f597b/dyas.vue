<script lang="ts">
import { queryOpenDetail } from '@/api/publicity-platform/after'
import { Descriptions } from 'ant-design-vue'
import { onMounted, ref, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { IPageData } from '@/api/publicity-platform/types'
import { parseTime } from '@/utils'
import { actions } from '@/views/publicity-platform/after/options'

export default defineComponent({
  components: {
    'a-descritions': Descriptions,
    'a-descritions-item': Descriptions.Item
  },
  setup() {
    const route = useRoute()

    const state = ref<IPageData>()
    const field = ref('')
    const isFine = ref(false)

    async function getDetail() {
      const res = await queryOpenDetail(route.query.id as string, route.query.api as string)
      state.value = res.data
    }

    function onOpenFile(item: string) {
      window.open(item)
    }

    onMounted(() => {
      let type = route.query.type as unknown as number
      isFine.value = Number(type) === 1
      field.value = actions[type - 1].text.substring(2)
    })

    function hasSuffix(i: number) {
      if (i !== state.value!.fileList!.length - 1) {
        return '、'
      }
    }

    getDetail()
    return {
      parseTime,
      hasSuffix,
      actions,
      state,
      field,
      isFine,
      onOpenFile
    }
  }
})
</script>
<template>
  <div class="other-detail">
    <a-descritions v-if="state" bordered :contentStyle="{ border: '1px solid #9accff' }" :labelStyle="{ border: '1px solid #9accff', backgroundColor: '#ebf8ff', width: '160px' }">
      <a-descritions-item label="详情信息" :span="4" :contentStyle="{ backgroundColor: '#ebf8ff' }" :labelStyle="{ backgroundColor: '#ebf8ff', fontWeight: 'bold' }"></a-descritions-item>
      <a-descritions-item label="决定书(通知书)文号" :span="4" :labelStyle="{ fontSize: '18px', fontWeight: 'bold' }" :contentStyle="{ fontSize: '18px', fontWeight: 'bold' }">{{
        state.documentNumber
      }}</a-descritions-item>
      <a-descritions-item label="相对人名称" :span="isFine ? 2 : 4">{{ state.relativeName }}</a-descritions-item>
      <a-descritions-item v-if="isFine" label="法定代表人或负责人姓名">{{ state.representative }}</a-descritions-item>
      <a-descritions-item v-if="isFine" label="统一社会信用代码" :span="4">{{ state.creditcode }}</a-descritions-item>
      <a-descritions-item v-if="isFine" label="主要违法事实" :span="4">{{ state.illegalFact }}</a-descritions-item>

      <a-descritions-item label="事由" :span="4">{{ state.cause }}</a-descritions-item>

      <a-descritions-item v-if="isFine" label="违反的法律条款" :span="4">{{ state.illegalAccording }}</a-descritions-item>
      <a-descritions-item v-if="isFine" label="做出处罚的法律依据条款" :span="4">{{ state.punishAccording }}</a-descritions-item>

      <a-descritions-item v-if="!isFine" :label="`${field}类型`" :span="2">{{ state.punishType }}</a-descritions-item>
      <a-descritions-item :label="`${field}结果`" :span="2">{{ state.punishResult }}</a-descritions-item>
      <a-descritions-item label="实施机关" :span="2">{{ state.punishOrganname }}</a-descritions-item>
      <a-descritions-item label="决定日期" :span="2">{{ parseTime(state.punishDate, '{y}年{m}月{d}日') }}</a-descritions-item>

      <a-descritions-item v-if="isFine" label="处罚决定书送达日期" :span="2">{{ parseTime(state.punishArriveddate, '{y}年{m}月{d}日') }}</a-descritions-item>

      <a-descritions-item v-if="isFine" label="全文公示" :span="4">
        <a v-for="(item, i) in state.fileList" :key="item" @click="onOpenFile(item)" style="color: #0084ff">点击查看{{ hasSuffix(i) }} </a>
      </a-descritions-item>
    </a-descritions>
  </div>
</template>
