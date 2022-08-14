<script lang="ts" setup>
import { queryOpenDetail } from '@/api/publicity-platform/after'
import { Descriptions } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { IPageData } from '@/api/publicity-platform/types'
import { parseTime } from '@/utils'
import { actions } from '@/views/publicity-platform/after/options'

const route = useRoute()

const state = ref<IPageData>()
const field = ref('')
const isFine = ref(false)

async function getDetail() {
  const res = await queryOpenDetail(route.params.id as string, route.params.api as string)
  state.value = res.data
}

function onOpenFile(item: string) {
  window.open(item)
}

onMounted(() => {
  let type = route.params.type as unknown as number
  isFine.value = Number(type) === 1
  field.value = actions[type - 1].text.substring(2)
})

getDetail()
</script>
<template>
  <div class="other-detail">
    <Descriptions v-if="state" bordered :contentStyle="{ border: '1px solid #9accff' }" :labelStyle="{ border: '1px solid #9accff', backgroundColor: '#ebf8ff' }">
      <Descriptions.Item label="详情信息" :span="4" :contentStyle="{ backgroundColor: '#ebf8ff' }" :labelStyle="{ backgroundColor: '#ebf8ff' }"></Descriptions.Item>
      <Descriptions.Item label="决定书(通知书)文号" :span="4">{{ state.documentNumber }}</Descriptions.Item>
      <Descriptions.Item label="相对人名称" :span="isFine ? 2 : 4">{{ state.relativeName }}</Descriptions.Item>
      <Descriptions.Item v-if="isFine" label="法定代表人或负责人姓名">{{ state.representative }}</Descriptions.Item>
      <Descriptions.Item v-if="isFine" label="统一社会信用代码" :span="4">{{ state.creditcode }}</Descriptions.Item>
      <Descriptions.Item v-if="isFine" label="主要违法事实" :span="4">{{ state.illegalFact }}</Descriptions.Item>

      <Descriptions.Item label="事由" :span="4">{{ state.cause }}</Descriptions.Item>

      <Descriptions.Item v-if="isFine" label="违反的法律条款" :span="4">{{ state.illegalAccording }}</Descriptions.Item>
      <Descriptions.Item v-if="isFine" label="做出处罚的法律依据条款" :span="4">{{ state.punishAccording }}</Descriptions.Item>

      <Descriptions.Item v-if="!isFine" :label="`${field}类型`" :span="2">{{ state.punishType }}</Descriptions.Item>
      <Descriptions.Item :label="`${field}结果`" :span="2">{{ state.punishResult }}</Descriptions.Item>
      <Descriptions.Item label="实施机关" :span="2">{{ state.punishOrganname }}</Descriptions.Item>
      <Descriptions.Item label="决定日期" :span="2">{{ parseTime(state.punishDate, '{y}年{m}月{d}日') }}</Descriptions.Item>

      <Descriptions.Item v-if="isFine" label="处罚决定书送达日期" :span="2">{{ parseTime(state.punishArriveddate, '{y}年{m}月{d}日') }}</Descriptions.Item>

      <Descriptions.Item v-if="isFine" label="全文公示" :span="4">
        <a v-for="(item, index) in state.fileList" :key="item" @click="onOpenFile(item)" style="color: #0084ff"> {{ `全文公示${index + 1} ${index === state.fileList?.length ? '' : '、'}` }} </a>
      </Descriptions.Item>
    </Descriptions>
  </div>
</template>
