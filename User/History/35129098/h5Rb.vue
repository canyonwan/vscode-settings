<template>
  <div class="cause-list">
    <n-collapse class="mb-6">
      <n-space justify="end">
        <n-button type="success" @click="onAddCause">新增案由</n-button>
      </n-space>
      <n-collapse-item v-for="primaryItem in causeList" :title="primaryItem.name" :name="primaryItem.id" :key="primaryItem.id">
        <!--            子案由操作-->
        <!-- <n-space class="ml-6" justify="space-between" v-for="item in primaryItem.causeSubList" :key="item.id">
          <div class="mb-4" v-if="item.lawList?.length < 0">{{ item.name }}</div>
          <n-collapse-transition v-for="(lawItem, index) in item.lawList" :key="lawItem.id">
            <span>{{ lawItem.lawName + (index !== item.lawList.length - 1 ? '、' : '') }}</span>
          </n-collapse-transition>
          <n-button-group size="tiny">
            <n-button secondary round type="primary" @click.stop="onViewSubCauseDetails(item)">详情</n-button>
            <n-button secondary round type="error" @click.stop="onDeleteSubCause(item.id!)">删除</n-button>
          </n-button-group>
        </n-space> -->
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
    </n-collapse>
    <n-pagination v-model:page="pageParams.page" v-model:page-size="pageParams.size" v-model:item-count="total" @update:page="switchPage" />
  </div>
</template>

<script lang="ts">
  import { useDialog } from 'naive-ui'
  import { IPrimaryCauseItemType } from '@/api/cause-manage/types'
  import { IResultPage } from '@/utils/axios/types'
  import { deletePrimaryCause, deleteSubCause, queryCauseManageList } from '@/api/cause-manage/cause-manage'
  import { causeEventKey, causeManageKey } from '@/views/cause-library/manage/fooKey'

  export default defineComponent({
    name: 'CauseList',
    setup() {
      const state = reactive({
        causeList: [] as IPrimaryCauseItemType[], // 主案由列表
        total: 0,
        pageParams: {
          page: 1,
          size: 10
        },
        // 组件提供
        searchParams: {
          name: ''
        }
      })

      const dialog = useDialog()
      const bus = useEventBus(causeManageKey)
      const busEvent = useEventBus(causeEventKey)

      // 获取案由列表
      async function getCauseMangeList() {
        let res: IResultPage<IPrimaryCauseItemType[]> = await queryCauseManageList({ ...state.searchParams, ...state.pageParams })
        state.causeList = res.contents
        state.pageParams.page = res.page
        state.pageParams.size = res.size
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
            await getCauseMangeList()
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
            await getCauseMangeList()
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
        state.pageParams.page = page
        await getCauseMangeList()
      }

      onMounted(() => {
        getCauseMangeList()
        // queryCauseTags()
      })

      // 保存的回调刷新列表
      function submitHandler() {
        getCauseMangeList()
      }

      // FIX: 可以将busEvent换成bus
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
