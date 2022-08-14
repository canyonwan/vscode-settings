<template>
  <div class="certificate-statistics">
    <a-card hoverable>
      <div class="marginBottom search-div">
        <span class="mg-left-top">
          <label>单位名称：</label>
          <selector-unit v-model:unitId="searchData.orgId" v-model:countyInfo="countyInfo"></selector-unit>
        </span>
        <span class="mg-left-top">
          <label>证件类型：</label>
          <a-radio-group v-model:value="certificateType" button-style="solid">
            <a-radio-button :value="2">全部</a-radio-button>
            <a-radio-button :value="0">执法证</a-radio-button>
            <a-radio-button :value="1">监督证</a-radio-button>
          </a-radio-group>
        </span>
        <span class="mg-left-top">
          <label>日期：</label>
          <a-range-picker v-model:value="timeR" style="width: 200px"></a-range-picker>
        </span>
        <a-button class="mg-left-top" shape="round" type="primary" @click="getData(0)"><SearchOutlined />查询</a-button>
      </div>
      <div class="count">
        <a-row type="flex" :gutter="16">
          <a-col :flex="1" v-for="item in actionCount" :key="item.id">
            <div class="count-item flex-between">
              <div class="count-left">
                <div class="count-number">{{ item.count }}</div>
                <div class="count-name">{{ item.name }}</div>
              </div>
              <div class="count-image" :style="{ backgroundImage: 'url(' + item.image + ')' }"></div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="bottom-chart">
        <a-spin :spinning="loading">
          <chart-bar-line-mix
            class="chart"
            :legendGroup="legendGroup"
            :chartData="chartData"
            :splitLineY="false"
            lineStyleType="dashed"
            :show-data-zoom="chartData.length > 0"
            :xName="'orgName'"
          ></chart-bar-line-mix>
        </a-spin>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import SelectorUnit from '@/components/selector-unit/index.vue'
import { DatePicker, Radio } from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { getCertificateCount, CertificateCount, exportCertificateCount } from '@/api/statistics/team-building'
import { ChartBarLineMix } from '@/components/charts'
import { useStore } from 'vuex'
import { StateType, UserType } from '@/@types'
import unitName from './unit-name'
import { downLoadFile } from '@/utils'
export default defineComponent({
  name: 'CertificateStatistics',
  components: {
    'a-radio-group': Radio.Group,
    'a-radio-button': Radio.Button,
    'a-range-picker': DatePicker.RangePicker,
    SearchOutlined,
    ChartBarLineMix,
    SelectorUnit
  },
  setup() {
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const internalInstance = getCurrentInstance()
    const state = reactive({
      certificateType: 2,
      loading: false,
      timeR: [dayjs(), dayjs()] as TimeRangeValueType,
      searchData: {} as CertificateCount,
      chartData: [],
      countyInfo: {} as any,
      legendGroup: [
        {
          name: '执法证',
          nameValue: 'enforceTotal', // 图例字段
          type: 'line', // 图例类型
          itemColor: ['#4581F6', '#4581F6'], // item 颜色数据 只支持两个
          emphasisColor: ['#252C3D'],
          areaColor: ['#D4E4FD', '#EFF5FF']
        },
        {
          name: '监督证',
          nameValue: 'superviseTotal', // 图例字段
          type: 'line', // 图例类型
          itemColor: ['#53C6F9', '#53C6F9'], // item 颜色数据 只支持两个
          emphasisColor: ['#252C3D'],
          areaColor: ['#71C5EA', '#EFFCFF']
        }
      ],
      actionCount: [
        {
          id: 0,
          name: '证件办理数量',
          count: 0,
          image: require('@/assets/statistics/count-handle.png')
        },
        {
          id: 1,
          name: '证件注销数量',
          count: 0,
          image: require('@/assets/statistics/count-cancel.png')
        },
        {
          id: 2,
          name: '证件暂扣数量',
          count: 0,
          image: require('@/assets/statistics/count-detain.png')
        },
        {
          id: 3,
          name: '证件吊销数量',
          count: 0,
          image: require('@/assets/statistics/count-revocation.png')
        },
        {
          id: 4,
          name: '证件停用数量',
          count: 0,
          image: require('@/assets/statistics/count-stop.png')
        }
      ]
    })
    const getData = async (type: number) => {
      let params = { ...state.searchData } as any
      if (state.timeR.length > 0) {
        params.startDate = internalInstance?.appContext.config.globalProperties.$parseTime(state.timeR[0], '{y}-{m}-{d} 00:00:00')
        params.endDate = internalInstance?.appContext.config.globalProperties.$parseTime(state.timeR[1], '{y}-{m}-{d} 23:59:59')
      }
      params = await unitName(params, state.countyInfo, user)
      if (state.certificateType === 2) {
        params.certificatesType = null
      } else if (state.certificateType === 0) {
        params.certificatesType = 0
      } else if (state.certificateType === 1) {
        params.certificatesType = 1
      }
      for (const key in params) {
        if (!params[key] && params[key] !== 0) {
          delete params[key]
        }
      }
      if (!type) {
        state.loading = true
        getCertificateCount(params).then(
          (data) => {
            state.actionCount[0].count = data.data.total
            state.actionCount[1].count = data.data.cancellationTotal
            state.actionCount[2].count = data.data.withholdTotal
            state.actionCount[3].count = data.data.revocationTotal
            state.actionCount[4].count = data.data.stopUsingTotal
            state.chartData = data.data.orgStatisticsList
            state.loading = false
          },
          () => {
            state.loading = false
          }
        )
      } else {
        exportCertificateCount(params).then((data: any) => {
          downLoadFile(data, '执法队伍证件统计表格.xls')
        })
      }
    }
    getData(0)
    return {
      getData,
      ...toRefs(state)
    }
  }
})
</script>
<style lang="less" scoped>
.certificate-statistics {
  // height: 100vh;
  .count {
    .count-item {
      background-color: #f2f5ff;
      padding: 20px;
      border-radius: 12px;
      .count-left {
        .count-number {
          color: #2654ff;
          font-size: 25px;
          font-weight: bold;
        }
        .count-name {
          color: #222222;
          font-weight: bold;
        }
      }
      .count-image {
        height: 50px;
        width: 50px;
        background-repeat: no-repeat;
        background-size: cover;
        // margin-left: 30px;
      }
    }
  }
  .bottom-chart {
    margin: 20px 0 10px;
    .chart {
      width: 100%;
      height: calc(~'100vh - 430px');
    }
  }
}
</style>
