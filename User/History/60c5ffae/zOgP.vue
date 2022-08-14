<!--数据列表统一显示 组件-->
<template>
  <div class="statistics-table">
    <a-row class="search-div marginBottom" flex="1" justify="space-between">
      <a-col>
        <span>
          <label>单位：</label>
          <selector-unit v-model:unitId="searchData.orgId" v-model:countyInfo="countyInfo"></selector-unit>
        </span>
        <template v-if="hasDateFiltrate">
          <span class="marginLeft10">
            <label>筛选日期：</label>
            <a-range-picker v-model:value="timeList" style="width: 220px" allowClear />
          </span>
        </template>
        <a-button type="primary" class="mg-left-top" shape="round" @click="getData(0)">
          <template #icon><SearchOutlined /></template>
          查询
        </a-button>
      </a-col>
      <a-col>
        <a-button class="mg-left" shape="round" :loading="exportLoading" @click="getData(1)">
          <template #icon><UploadOutlined /></template>
          导出数据
        </a-button>
        <slot />
      </a-col>
    </a-row>
    <summary-table :loading="loading" :data-sources="dataSources" :columns="tableColumns" :footer-data-source="footerDataSource" :scroll="{ x: 600, y: 'calc(100vh - 460px)' }" :row-key="'orgId'" />
  </div>
</template>

<script lang="ts">
import { StateType, UserType } from '@/@types/index'
import { commonExportStatisticsApi, commonStatisticsApi } from '@/api/statistics'
import { TimeRangeValueType } from '@/api/subject/law-test'
import SelectorUnit from '@/components/selector-unit/index.vue'
import SummaryTable from '@/components/summary-table/index.vue'
import { downLoadFile } from '@/utils'
import useSearchStatistics from '@/views/statistics/enforcement-data/components/use-search-statistics'
import { SearchOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { DatePicker } from 'ant-design-vue'
import { defineComponent, onMounted, PropType, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'statistics-table',
  props: {
    // 列
    tableColumns: {
      type: Array,
      default: () => [],
      required: true
    },
    // 是否有日期筛选
    hasDateFiltrate: {
      type: Boolean,
      default: true
    },
    // 接口地址
    apiUrl: {
      type: Array as PropType<string[]>,
      default: () => [],
      required: true
    }
  },
  components: {
    SummaryTable,
    SelectorUnit,
    UploadOutlined,
    SearchOutlined,
    'a-range-picker': DatePicker.RangePicker
  },
  setup(props) {
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const { searchData, paramsHandle } = useSearchStatistics()
    const state = reactive({
      loading: false,
      exportLoading: false,
      dataSources: [] as any[],
      footerDataSource: [] as any[],
      countyInfo: {} as any, // 单位名称查询选中的名称信息
      timeList: [] as any as TimeRangeValueType
    })
    const getData = (type: number) => {
      let params = paramsHandle(searchData, state.countyInfo.districtType && state.countyInfo.districtType !== user.districtType, state.timeList)
      if (type === 0) {
        state.loading = true
        commonStatisticsApi(props.apiUrl[0], params).then(
          (result: any) => {
            state.dataSources = result.data.splice(0, result.data.length - 1)
            state.footerDataSource = [result.data.pop()]
            state.loading = false
          },
          () => (state.loading = false)
        )
      } else {
        state.exportLoading = true
        commonExportStatisticsApi(props.apiUrl[1], params).then(
          (result: any) => {
            downLoadFile(result, '统计表格.xls')
            state.exportLoading = false
          },
          () => (state.exportLoading = false)
        )
      }
    }
    onMounted(() => getData(0))
    return { ...toRefs(state), getData, searchData }
  }
})
</script>

<style lang="less" scoped>
.statistics-table {
}
</style>
