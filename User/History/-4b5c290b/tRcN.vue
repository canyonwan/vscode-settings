<template>
  <div class="cause-list">
    <n-collapse class="mb-6">
      <n-space justify="end">
        <n-button type="success" @click="onAddCause" v-if="buttonShowPermission(['b01_01_01'])" :disabled="buttonDisabledPermission(['b01_01_01'])">
          <template #icon>
            <n-icon><Add /></n-icon>
          </template>
          新增违法行为</n-button
        >
      </n-space>
      <div v-if="causeList" class="pt-6">
        <n-collapse-item v-for="primaryItem in causeList" :title="primaryItem.name" :name="primaryItem.id" :key="primaryItem.id">
          <n-grid class="ml-6" cols="7" v-for="item in primaryItem.causeSubList" :key="item.id">
            <n-grid-item :span="5" class="mb-4">
              <div class="mb-4" v-if="item.lawList?.length < 0">{{ item.name }}</div>
              <span v-for="(lawItem, index) in item.lawList" :key="lawItem.id"> {{ lawItem.lawName + (index !== item.lawList.length - 1 ? '、' : '') }}</span>
            </n-grid-item>
            <n-grid-item :span="2">
              <n-button-group size="tiny">
                <n-button secondary round type="primary" @click.stop="onViewSubCauseDetails(item)" v-if="buttonShowPermission(['b01_01_03'])" :disabled="buttonDisabledPermission(['b01_01_03'])"
                  >详情</n-button
                >
                <n-button secondary round type="error" @click.stop="onDeleteSubCause(item.id!)" v-if="buttonShowPermission(['b01_01_02'])" :disabled="buttonDisabledPermission(['b01_01_02'])"
                  >删除</n-button
                >
              </n-button-group>
            </n-grid-item>
          </n-grid>
          <!--主违法行为操作 -->
          <template #header-extra>
            <n-button-group size="tiny">
              <n-button
                secondary
                round
                type="primary"
                @click.stop="onViewPrimaryCauseDetails(primaryItem)"
                v-if="buttonShowPermission(['b01_01_03'])"
                :disabled="buttonDisabledPermission(['b01_01_03'])"
                >详情</n-button
              >
              <n-button secondary type="error" @click.stop="onDeletePrimaryCause(primaryItem.id!)" v-if="buttonShowPermission(['b01_01_02'])" :disabled="buttonDisabledPermission(['b01_01_02'])"
                >删除</n-button
              >
              <n-button secondary round type="success" @click.stop="onAddSubCause(primaryItem)" v-if="buttonShowPermission(['b01_01_01'])" :disabled="buttonDisabledPermission(['b01_01_01'])"
                >新增</n-button
              >
            </n-button-group>
          </template>
        </n-collapse-item>
      </div>

      <!-- empty data -->
      <n-empty v-else description="什么都没找到 🤔 " class="py-8" />
    </n-collapse>
    <n-pagination v-model:page="searchParams.page" v-model:page-size="searchParams.size" v-model:item-count="total" @update:page="switchPage" />
  </div>
</template>

<script lang="ts">
  import { useDialog } from 'naive-ui'
  import { Add } from '@vicons/carbon'
  import type { ICauseManageSearchType, IPrimaryCauseItemType } from '@/api/cause-manage/types'
  import type { IResultPage } from '@/utils/axios/types'
  import { deletePrimaryCause, deleteSubCause, queryCauseManageList } from '@/api/cause-manage/cause-manage'
  import { causeEventKey, causeManageKey } from '@/views/cause-library/manage/outdated/fooKey'
  import { usePermission } from '@/hooks/web/use-permission'

  export default defineComponent({
    name: 'CauseList',
    components: { Add },
    props: {
      // 由上层搜索区传递过来的搜索参数
      searchParamsProps: {
        type: Object as PropType<ICauseManageSearchType>,
        default: () => {}
      }
    },
    setup(props) {
      const state = reactive({
        causeList: [] as IPrimaryCauseItemType[], // 主违法行为列表
        total: 0,
        searchParams: {
          page: 1,
          size: 10,
          name: ''
        }
      })
      const { buttonShowPermission, buttonDisabledPermission } = usePermission()

      const dialog = useDialog()
      const bus = useEventBus(causeManageKey)
      const busEvent = useEventBus(causeEventKey)

      // 获取违法行为列表
      async function getCauseMangeList(searchParams: ICauseManageSearchType) {
        let res: IResultPage<IPrimaryCauseItemType[]> = await queryCauseManageList(searchParams)
        state.causeList = res.contents
        state.searchParams.page = res.page
        state.searchParams.size = res.size
        state.total = res.total
      }

      // 操作集
      // 查看主违法行为详情
      function onViewPrimaryCauseDetails(primaryItem: IPrimaryCauseItemType) {
        bus.emit([3, primaryItem])
      }

      // 查看子违法行为详情
      function onViewSubCauseDetails(primaryItem: IPrimaryCauseItemType) {
        bus.emit([4, primaryItem])
      }

      // 新增主违法行为
      function onAddCause() {
        let param: IPrimaryCauseItemType = { name: '' }
        bus.emit([3, param])
      }

      // 删除子违法行为
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

      // 删除主违法行为
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

      // 新增子违法行为
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
        getCauseMangeList({ ...state.searchParams })
      })

      // 保存的回调刷新列表
      function submitHandler() {
        getCauseMangeList({ ...state.searchParams, ...props.searchParamsProps })
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
        switchPage,
        buttonShowPermission,
        buttonDisabledPermission
      }
    }
  })
</script>
