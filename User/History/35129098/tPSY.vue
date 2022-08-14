<template>
  <div class="cause-list">
    <n-collapse class="mb-6">
      <n-space justify="end">
        <n-button type="success" @click="onAddCause">新增案由</n-button>
      </n-space>
      <div v-if="causeList">
        <n-collapse-item v-for="primaryItem in causeList" :title="primaryItem.name" :name="primaryItem.id" :key="primaryItem.id">
          <n-grid class="ml-6" cols="7" v-for="item in primaryItem.causeSubList" :key="item.id">
            <n-grid-item :span="5" class="mb-4">
              <div class="mb-4" v-if="item.lawList?.length < 0">{{ item.name }}</div>
              <span v-for="(lawItem, index) in item.lawList" :key="lawItem.id"> {{ lawItem.lawName + (index !== item.lawList.length - 1 ? '、' : '') }}</span>
            </n-grid-item>
            <n-grid-item :span="2">
              <n-button-group size="tiny">
                <n-button secondary round type="primary" @click.stop="onViewSubCauseDetails(item)">详情</n-button>
                <n-button secondary round type="error" @click.stop="onDeleteSubCause(item.id!)">删除</n-button>
              </n-button-group>
            </n-grid-item>
          </n-grid>
          <!--主案由操作 -->
          <template #header-extra>
            <n-button-group size="tiny">
              <n-button secondary round type="primary" @click.stop="onViewPrimaryCauseDetails(primaryItem)">详情</n-button>
              <n-button secondary type="error" @click.stop="onDeletePrimaryCause(primaryItem.id!)">删除</n-button>
              <n-button secondary round type="success" @click.stop="onAddSubCause(primaryItem)">新增</n-button>
            </n-button-group>
          </template>
        </n-collapse-item>
      </div>

      <!-- empty data -->
      <n-empty v-else description="什么都没找到" />
    </n-collapse>
    <n-pagination v-model:page="searchParams.page" v-model:page-size="searchParams.size" v-model:item-count="total" @update:page="switchPage" />
  </div>
</template>

<script lang="ts">
  import { useDialog } from 'naive-ui'
  import type { ICauseManageSearchType, IPrimaryCauseItemType } from '@/api/cause-manage/types'
  import type { IResultPage } from '@/utils/axios/types'
  import { deletePrimaryCause, deleteSubCause, queryCauseManageList } from '@/api/cause-manage/cause-manage'
  import { causeEventKey, causeManageKey } from '@/views/cause-library/manage/fooKey'

  export default defineComponent({
    name: 'CauseList',
    setup() {
      const state = reactive({
        causeList: [] as IPrimaryCauseItemType[], // 主案由列表
        total: 0,
        searchParams: {
          page: 1,
          size: 10,
          name: ''
        }
      })

      const dialog = useDialog()
      const bus = useEventBus(causeManageKey)
      const busEvent = useEventBus(causeEventKey)

      // 获取案由列表
      async function getCauseMangeList(searchParams: ICauseManageSearchType) {
        let res: IResultPage<IPrimaryCauseItemType[]> = await queryCauseManageList(searchParams)
        state.causeList = res.contents
        state.searchParams.page = res.page
        state.searchParams.size = res.size
        state.total = res.total
      }

      // 操作集
      // 查看主案由详情
      function onViewPrimaryCauseDetails(primaryItem: IPrimaryCauseItemType) {
        bus.emit([3, primaryItem])
      }

      // 查看子案由详情
      function onViewSubCauseDetails(primaryItem: IPrimaryCauseItemType) {
        bus.emit([4, primaryItem])
      }

      // 新增主案由
      function onAddCause() {
        let param: IPrimaryCauseItemType = { name: '' }
        bus.emit([3, param])
      }

      // 删除子案由
      function onDeleteSubCause(id: string) {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            await deleteSubCause(id)
            await getCauseMangeList({ ...state.searchParams })
          }
        })
      }

      // 删除主案由
      async function onDeletePrimaryCause(id: string) {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            await deletePrimaryCause(id)
            await getCauseMangeList({ ...state.searchParams })
          }
        })
      }

      // 新增子案由
      function onAddSubCause(primaryItem: IPrimaryCauseItemType) {
        let param: IPrimaryCauseItemType = {
          causeId: primaryItem.id,
          name: primaryItem.name
        }
        bus.emit([4, param])
      }

      // 切换页码
      async function switchPage(page: number) {
        state.searchParams.page = page
        await getCauseMangeList(state.searchParams)
      }

      onMounted(() => {
        getCauseMangeList({ ...state.searchParams, ...state.searchParams })
        // queryCauseTags()
      })

      // 保存的回调刷新列表
      function submitHandler() {
        getCauseMangeList({ ...state.searchParams })
      }

      busEvent.on(() => {
        submitHandler()
      })

      return {
        ...toRefs(state),
        getCauseMangeList,
        onAddCause,
        onViewPrimaryCauseDetails,
        onViewSubCauseDetails,
        onDeleteSubCause,
        onDeletePrimaryCause,
        onAddSubCause,
        switchPage
      }
    }
  })
</script>
