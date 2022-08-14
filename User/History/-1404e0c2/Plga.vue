<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, reactive, ref, watch, PropType } from 'vue'
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue'
import { FormInstance } from 'ant-design-vue'
import { actions, fineColumns, IAction } from './options'
import Actions from '../components/actions.vue'
import { DatePicker as ADatePicker } from 'ant-design-vue'
import { queryListForType, queryOpenPageData } from '@/api/publicity-platform/after'
import type { IListDataForType, IPageData, ISearch, ISelectOrgParams } from '@/api/publicity-platform/types'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'publicityAfter',
  props: {
    orgInfo: {
      type: Object as PropType<ISelectOrgParams>
    }
  },
  components: { Actions, SearchOutlined, RedoOutlined, ADatePicker },
  setup(props) {
    const router = useRouter()
    const internalInstance = getCurrentInstance()
    const formRef = ref<FormInstance>()

    const listDataForType = ref<IListDataForType[]>([])
    const actionsTemp = ref<IAction[]>([])

    const searchParams = reactive<ISearch & ISelectOrgParams>({
      page: 1,
      size: 10,
      startTime: '',
      endTime: '',
      documentNumber: '',
      relativeName: '',
      orgId: '',
      isSameLevel: false,
      isSubordinate: false
    })

    const state = reactive({
      // currentType: [actions[0].value, actions[0].api] as [number, string],
      dataSources: [] as IPageData[],
      columns: fineColumns,
      pagination: {
        ...internalInstance?.appContext.config.globalProperties.$page
      },
      loading: false
    })

    function handleSubmit() {
      state.pagination.current = 1
      handleGetData(actionsTemp.value[0].api!)
    }

    function handleReset() {
      searchParams.documentNumber = ''
      searchParams.relativeName = ''
      searchParams.startTime = ''
      searchParams.endTime = ''
    }

    function handleTableChange(pagination: any) {
      searchParams.page = pagination.current
      searchParams.size = pagination.pageSize
      state.pagination.current = pagination.current
      state.pagination.pageSize = pagination.pageSize
      handleGetData(actionsTemp.value[0].api!)
    }

    function onViewDetail(record: IPageData) {
      const { href } = router.resolve({
        path: 'publicityDetail/detail',
        query: { type: actionsTemp.value[0].value!, id: record.id, api: actionsTemp.value[0].api! }
      })

      window.open(href, '_blank')
    }

    function switchHandler(item: IAction) {
      state.columns = item.column!
      // actionsTemp.value[0].value = item.value
      // actionsTemp.value[0].api = item.api
      handleGetData(item.api!)
    }

    async function handleGetData(api: string) {
      state.loading = true
      const res = await queryOpenPageData(searchParams, api)
      state.loading = false
      state.dataSources = res.data.data
      state.pagination.total = res.data.dataCount
    }

    // 选择市直机关下时调用
    async function getListForType() {
      const typeRes = await queryListForType(props.orgInfo!.orgId!)
      listDataForType.value = typeRes.data
      processData()
      handleGetData(actionsTemp.value[0].api!)
    }

    function processData() {
      actionsTemp.value.length > 0 && (actionsTemp.value = [])
      for (const i of listDataForType.value) {
        if (i.count > 0) {
          actionsTemp.value.push(actions[i.type - 1])
        }
      }
    }

    function onOpenFile(files: string[]) {
      const { href } = router.resolve({ name: 'publicityImagesWall' })
      sessionStorage.setItem('files', JSON.stringify(files))
      window.open(href, '_blank')
    }

    watch(
      () => props.orgInfo,
      () => {
        if (props.orgInfo) {
          searchParams.orgId = props.orgInfo.orgId
          searchParams.isSameLevel = props.orgInfo.isSameLevel
          searchParams.isSubordinate = props.orgInfo.isSubordinate
          if (props.orgInfo?.belongJusticeOrgId === '253584469238218752' || props.orgInfo.orgId === '253584469238218752') {
            getListForType()
          } else {
            actionsTemp.value = actions
            // handleGetData(state.currentType[1]
            handleGetData(actionsTemp.value[0].api!)
          }
        }
      },
      {
        immediate: true
      }
    )
    return {
      actions,
      fineColumns,
      router,
      formRef,
      actionsTemp,
      searchParams,
      state,
      listDataForType,
      handleSubmit,
      handleReset,
      handleTableChange,
      onViewDetail,
      switchHandler,
      handleGetData,
      onOpenFile
    }
  }
})
</script>
<template>
  <div class="after">
    <actions :data="actionsTemp" @onSwitch="switchHandler" />

    <a-table
      bordered
      :scroll="{ x: 850, y: 'calc( 100vh - 420px)' }"
      :data-source="state.dataSources"
      :columns="state.columns"
      :loading="state.loading"
      :pagination="state.pagination"
      @change="handleTableChange"
      :row-key="'id'"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'documentNumber'">
          <a @click="onViewDetail(record)" style="color: #0084ff">
            {{ record.documentNumber }}
          </a>
        </template>
        <template v-if="column.dataIndex === 'fileList'">
          <a v-if="record?.fileList?.length > 0" style="color: #0084ff" @click="onOpenFile(record.fileList)">点击查看</a>
        </template>
      </template>
    </a-table>
  </div>
</template>
<style lang="less" scoped>
.after {
  width: 100%;

  .searchForm {
    padding: 15px 0;
    display: flex;
  }
}
</style>
