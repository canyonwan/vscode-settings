<template>
  <div class="statistics-table">
    <div class="echarts">
      <a-row class="search-div">
        <span class="mg-left-top">
          <label>单位名称：</label>
          <selector-unit v-model:unitId="searchData.orgId" v-model:countyInfo="countyInfo"></selector-unit>
        </span>
        <span class="mg-left-top">
          <label>时间筛选：</label>
          <a-range-picker v-model:value="timeList" value-format="YYYY-MM-DD" style="width: 200px" />
        </span>
        <a-button type="primary" class="mg-left" shape="round" @click="getData(0)">
          <template #icon><SearchOutlined /></template> 查询</a-button
        >
      </a-row>
      <chart-bar-line-mix
        class="chart"
        ref="chatRef"
        v-if="dataSources.length > 0"
        :chartData="dataSources"
        :show-data-zoom="dataSources.length > 10"
        :splitLineY="false"
        lineStyleType="dashed"
        theme="light"
        :legendGroup="legendGroup"
        :xName="'orgName'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, toRefs } from 'vue'
import { DatePicker } from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { legendGroupModel, StateType, UserType } from '@/@types/index'
import { commonExportStatisticsApi, commonStatisticsApi } from '@/api/statistics'
import { ChartBarLineMix } from '@/components/charts'
import SelectorUnit from '@/components/selector-unit/index.vue'
import { downLoadFile } from '@/utils'
import useSearchStatistics from '@/views/statistics/enforcement-data/components/use-search-statistics'
import dayjs from 'dayjs'
import { TimeRangeValueType } from '@/api/subject/law-test'

export default defineComponent({
  name: 'StatisticsTable',
  components: {
    'a-range-picker': DatePicker.RangePicker,
    SearchOutlined,
    ChartBarLineMix,
    SelectorUnit
  },
  props: {
    // 接口地址
    apiUrl: {
      type: Array as PropType<string[]>,
      default: () => [],
      required: true
    },
    tabCategory: {
      type: Number,
      default: 1,
      required: true
    }
  },
  emits: ['onBottomSummaryData'],
  setup(props, ctx) {
    const { searchData, paramsHandle } = useSearchStatistics()
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const state = reactive({
      loading: false,
      exportLoading: false,
      dataSources: [],
      countyInfo: {} as any, // 单位名称查询选中的名称信息
      timeList: [] as any as TimeRangeValueType,
      legendGroup: [] as legendGroupModel[]
    })

    const getData = (type: number) => {
      let params = paramsHandle(searchData, state.countyInfo.districtType && state.countyInfo.districtType !== user.districtType, state.timeList)
      if (type === 0) {
        getStatisticsData(params)
      } else {
        exportData(params)
      }
    }
    const commonMap = {
      // 处罚
      Punish: {
        nameValue: 'completedTotal', // 图例字段
        type: 'line', // 图例类型
        itemColor: ['#4581F6', '#4581F6'], // item 颜色数据 只支持两个
        emphasisColor: ['#252C3D'],
        areaColor: ['#D4E4FD', '#EFF5FF']
      },
      // 强制措施
      Measure: {
        nameValue: 'forceTotal', // 图例字段
        type: 'line', // 图例类型
        itemColor: ['#F88DA8', '#F88DA8'], // item 颜色数据 只支持两个
        emphasisColor: ['#F6D2FD'],
        areaColor: ['#FFE9EE', '#FFF7F9']
      },
      // 强制执行
      Enforce: {
        nameValue: 'forceTotal', // 图例字段1
        type: 'line', // 图例类型
        itemColor: ['#59A3F6', '#59A3F6'], // item 颜色数据 只支持两个
        emphasisColor: ['#F6D2FD'],
        areaColor: ['#D5E9FE', '#E3F0FF']
      },
      // 许可
      License: {
        nameValue: 'permitApplyTotal', // 图例字段
        type: 'line', // 图例类型
        itemColor: ['#F5A625', '#F5A625'], // item 颜色数据 只支持两个
        emphasisColor: ['#F6D2FD'],
        areaColor: ['#FFF4E2', '#FFF8ED']
      },
      // 检查
      Inspection: {
        nameValue: 'inspectTotal', // 图例字段
        type: 'line', // 图例类型
        itemColor: ['#A553F9', '#A553F9'], // item 颜色数据 只支持两个
        emphasisColor: ['#F6D2FD'],
        areaColor: ['#F4EAFF', '#F9F2FF']
      }
    }
    // 设置统计图配置字段
    const statisticsTableMap = new Map().set(1, commonMap.Punish).set(2, commonMap.Measure).set(3, commonMap.Enforce).set(4, commonMap.License).set(5, commonMap.Inspection)

    // 搜索数据
    const getStatisticsData = (params: any) => {
      state.legendGroup[0] = statisticsTableMap.get(props.tabCategory)
      state.loading = true
      commonStatisticsApi(props.apiUrl[0], params).then(
        (result: any) => {
          ctx.emit('onBottomSummaryData', result.data.pop())
          state.dataSources = result.data.filter((item: any) => {
            return item.isAmount === false
          })
          state.loading = false
        },
        () => (state.loading = false)
      )
    }

    // 导出数据
    const exportData = (params: any) => {
      state.exportLoading = true
      commonExportStatisticsApi(props.apiUrl[1], params).then(
        (result: any) => {
          downLoadFile(result, '统计表格.xls')
          state.exportLoading = false
        },
        () => (state.exportLoading = false)
      )
    }

    onMounted(() => {
      getData(0)
    })

    return { ...toRefs(state), searchData, getData }
  }
})
</script>

<style lang="less" scoped>
.statistics-table {
  .echarts {
    height: 400px;
    border-radius: 10px;
    overflow: hidden;
    .chart {
      width: 100%;
      height: 340px;
    }
  }
}
</style>
