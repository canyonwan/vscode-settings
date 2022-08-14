<template>
  <div class="law-type">
    <n-grid cols="1 s:1 m:1 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12">
      <n-grid-item span="2">
        <n-card title="法类型" :segmented="{ content: 'soft' }">
          <law-tree-comp
            :law-data="lawTypes"
            :request-type="LawEnum.TYPE"
            @on-handler="onTypeHandler"
            :deleteAction="deleteLawType"
            :submitAction="saveLawTypes"
            :frontEndIdentification="['b08_01_01', 'b08_01_02']"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item span="2">
        <n-card title="法标签" :segmented="{ content: 'soft' }">
          <law-tree-comp
            :law-data="lawTags"
            :request-type="LawEnum.TAG"
            @on-handler="onTagHandler"
            :deleteAction="deleteLawTag"
            :submitAction="saveLawTag"
            :frontEndIdentification="['b08_01_01', 'b08_01_02']"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item span="2">
        <n-card title="违法行为编号标签" :segmented="{ content: 'soft' }">
          <law-tree-comp
            :law-data="causeTags"
            :request-type="LawEnum.CAUSE"
            @on-handler="onCauseTagsHandler"
            :deleteAction="deleteCauseTag"
            :submitAction="saveCauseTags"
            :frontEndIdentification="['b08_01_01', 'b08_01_02']"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item span="2">
        <n-card title="违法行为类型" :segmented="{ content: 'soft' }">
          <CauseType />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
  import LawTreeComp from '@/views/law/components/law-tree-comp.vue'
  import { LawEnum } from '@/enums/law-enum'
  import type { ILawTagType } from '@/api/law/types'
  import { queryAllLawTags, saveLawTag, deleteLawTag } from '@/api/law/tag'
  import { deleteLawType, saveLawTypes, queryAllLawTypes } from '@/api/law/type'
  import { deleteCauseTag, queryAllCauseTags, saveCauseTags } from '@/api/cause-manage/cause-manage'
  import CauseType from '../components/cause-type.vue'
  // import { CCauseType } from '@/views/law/components/cause-type.vue'

  const lawTypes = ref<ILawTagType[]>([])
  const lawTags = ref<ILawTagType[]>([])
  const causeTags = ref<ILawTagType[]>([])

  function processTreeData(data: ILawTagType[]) {
    if (data.length > 0) {
      for (const ele of data) {
        if (ele.list && ele.list.length > 0) {
          processTreeData(ele.list)
        } else {
          delete ele.list
        }
      }
    }
    return data
  }

  // 获取法类型
  async function queryLawTypes() {
    let res = await queryAllLawTypes()
    lawTypes.value = processTreeData(res)
  }

  // 获取标签数据
  async function queryLawTags() {
    let res = await queryAllLawTags()
    lawTags.value = processTreeData(res)
  }

  // 获取违法行为标签
  async function queryCauseTags() {
    let res = await queryAllCauseTags()
    causeTags.value = processTreeData(res)
  }

  // 获取法类型回调
  async function onTypeHandler() {
    await queryLawTypes()
  }

  // 获取法标签回调
  async function onTagHandler() {
    await queryLawTags()
  }

  // 获取违法行为标签回调
  async function onCauseTagsHandler() {
    await queryCauseTags()
  }

  onMounted(() => {
    queryLawTypes()
    queryLawTags()
    queryCauseTags()
  })
</script>
