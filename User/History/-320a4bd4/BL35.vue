<template>
  <!-- <div class="cause-manage overflow-scroll" :style="{ height: 'calc(100vh - ' + 110 + 'px)' }"> -->
  <div class="cause-manage overflow-scroll">
    <!--    搜索区-->
    <n-card>
      <n-grid x-gap="12" :cols="4" :y-gap="40">
        <n-gi span="2">
          <n-space justify="space-between">
            <n-button class="mb-4" type="primary" @click="onSelectLaw">选择法</n-button>
            <n-button class="mb-4" type="error" @click="onClearLawCauseTags"> 清除全部 </n-button>
          </n-space>
          <n-space v-if="selectedLaws.length > 0">
            <n-tag type="success" v-for="(lawTag, index) in selectedLaws" :key="index" @close="deleteSingleTag(lawTag)"> {{ lawTag.lawName }} </n-tag>
          </n-space>
        </n-gi>
        <n-gi span="2">
          <n-space justify="space-between">
            <n-button class="mb-4" type="primary" @click="openSelectCauseTagsModal">选择违法行为标签</n-button>
            <n-button class="mb-4" type="error" @click="onClearCauseTags">清除全部</n-button>
          </n-space>
          <n-space>
            <n-tag type="success" v-for="item in boundCauseTagsEntity" :key="item.id" @close="deleteSingleCauseTag(item)"> {{ item.name }} </n-tag>
          </n-space>
        </n-gi>
        <n-gi span="2">
          <n-input v-model:value="searchParams.name" clearable placeholder="输入要搜索的违法行为名称" />
        </n-gi>
        <n-gi span="2">
          <n-space>
            <n-button type="success" @click="onSearchCauseList"> 查询</n-button>
          </n-space>
        </n-gi>
      </n-grid>
    </n-card>
    <!--    违法行为列表-->
    <n-card class="mt-4">
      <n-grid cols="5" responsive="screen" :x-gap="12">
        <n-gi span="2">
          <n-card>
            <cause-list ref="causeListRef" :search-params-props="searchParams" />
          </n-card>
        </n-gi>
        <n-gi span="3">
          <n-card :bordered="false">
            <cause-actions />
          </n-card>
        </n-gi>
      </n-grid>
    </n-card>
    <!--modal-->
    <basic-modal @register="modalRegister" style="width: 70%">
      <component
        :is="currentComp"
        :use-selection="true"
        :request-type="LawEnum.TAG"
        @close-modal-handler="closeModal"
        @on-cancel-modal="() => closeModal()"
        @submit-selection-handler="selectLawHandler"
        :use-check="true"
        :law-data="causeTagTrees"
        @on-close-modal="onCloseCauseTagTreeModal"
        @on-select-ok="onSelectCauseTagsHandler"
        :checkedKeys="boundCauseTagsEntity.map((item) => item.id!)"
        :causeLawBoundKeys="selectedLaws.map((item) => item.id!)"
      />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { queryAllCauseTags, queryCauseTagsWithIds } from '@/api/cause-manage/cause-manage'
  import { useModal } from '@/components/modal'
  import useDynamicComp from '@/hooks/useDynamicComp'
  import { queryLawDetailList } from '@/api/law/cause'
  import { FormOutlined, DeleteOutlined, SearchOutlined } from '@vicons/antd'
  import _ from 'lodash'
  import CauseList from '@/views/cause-library/manage/components/cause-list.vue'
  import { LawEnum } from '@/enums/law-enum'
  import CauseActions from './components/cause-actions'
  import type { ICauseManageSearchType } from '@/api/cause-manage/types'
  import type { ILawItemType, ILawTagType } from '@/api/law/types'

  export default defineComponent({
    name: 'CauseManage',
    components: {
      FormOutlined,
      DeleteOutlined,
      SearchOutlined,
      CauseList,
      CauseActions
    },
    setup() {
      const { currentComp, onSwitchComp } = useDynamicComp()

      const searchParams: ICauseManageSearchType = reactive({
        page: 1,
        size: 10,
        name: ''
      })

      const state = reactive({
        selectedLaws: [] as Partial<ILawItemType>[] // 选中的法条
      })

      const causeListRef = ref()

      // 违法行为标签树
      const causeTagTreeState = reactive({
        causeTagTrees: [] as ILawTagType[], // 违法行为标签树
        boundCauseTagsEntity: [] as Partial<ILawTagType>[] // 用于回传给子组件回显
      })

      const [modalRegister, { openModal, closeModal, setProps }] = useModal({
        title: '选择法',
        displayDirective: 'if'
      })

      // 查询违法行为列表
      async function onSearchCauseList() {
        searchParams.page = 1
        searchParams.lawIdList = state.selectedLaws.map((item) => item.id!)
        searchParams.causeTagIdList = causeTagTreeState.boundCauseTagsEntity.map((item) => item.id!)
        causeListRef.value.getCauseMangeList(searchParams)
      }

      // 选择法
      function onSelectLaw() {
        openModal()
        onSwitchComp(0)
      }

      // 选择法回调
      async function selectLawHandler(values: string[]) {
        const res = await queryLawDetailList(values)
        state.selectedLaws = _.remove(res, (item) => item.id === item.id)
        closeModal()
      }

      // 清除所有已经选择的违法行为法标签
      function onClearLawCauseTags() {
        state.selectedLaws.length = 0
      }

      // 清除所有已经选择的违法行为标签
      function onClearCauseTags() {
        causeTagTreeState.boundCauseTagsEntity.length = 0
      }

      // 删除单个违法行为法
      function deleteSingleTag(item: Partial<ILawItemType>) {
        state.selectedLaws.splice(state.selectedLaws.indexOf(item), 1)
      }

      // 删除单个违法行为标签
      function deleteSingleCauseTag(item: Partial<ILawTagType>) {
        causeTagTreeState.boundCauseTagsEntity.splice(state.selectedLaws.indexOf(item), 1)
      }

      // 选择违法行为标签(用于搜索)
      function openSelectCauseTagsModal() {
        openModal()
        setProps({ title: '选择违法行为标签' })
        onSwitchComp(1)
      }

      // 获取违法行为标签
      async function queryCauseTags() {
        let res = await queryAllCauseTags()
        causeTagTreeState.causeTagTrees = processTreeData(res)
      }

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

      // 选择违法行为标签回调
      async function onSelectCauseTagsHandler(values: string[]) {
        const res = await queryCauseTagsWithIds(values)
        causeTagTreeState.boundCauseTagsEntity = _.remove(res, (item) => item.id === item.id)
        closeModal()
      }

      // 关闭选择违法行为标签的弹窗
      function onCloseCauseTagTreeModal() {
        closeModal()
      }

      onMounted(() => {
        queryCauseTags()
      })

      return {
        searchParams,
        ...toRefs(state),
        ...toRefs(causeTagTreeState),
        causeListRef,
        onSearchCauseList,
        currentComp,
        selectLawHandler,
        modalRegister,
        closeModal,
        LawEnum,
        deleteSingleCauseTag,
        onClearLawCauseTags,
        deleteSingleTag,
        onSelectLaw,
        openSelectCauseTagsModal,
        onCloseCauseTagTreeModal,
        onClearCauseTags,
        onSelectCauseTagsHandler
      }
    }
  })
</script>
