<template>
  <div class="personnel-statistics">
    <a-card hoverable :bodyStyle="{ padding: '10px 10px' }">
      <div class="search-div">
        <span class="mg-left-top">
          <label>单位名称：</label>
          <selector-unit v-model:unitId="searchData.orgId" v-model:countyInfo="countyInfo"></selector-unit>
        </span>
        <span class="mg-left-top">
          <label>人员类别：</label>
          <a-radio-group v-model:value="searchData.categoryType" button-style="solid">
            <a-radio-button :value="1">执法人员</a-radio-button>
            <a-radio-button :value="2" disabled>监督人员</a-radio-button>
            <a-radio-button :value="3" disabled>法制审核人员</a-radio-button>
          </a-radio-group>
        </span>
        <span class="mg-left-top">
          <label>日期：</label>
          <a-range-picker v-model:value="timeR" style="width: 200px"></a-range-picker>
        </span>
        <a-button class="mg-left-top" shape="round" type="primary" @click="getData(0)"><SearchOutlined />查询</a-button>
      </div>
    </a-card>
    <div class="chart">
      <a-spin :spinning="loading">
        <a-row :gutter="16">
          <a-col span="10">
            <a-row :gutter="16">
              <a-col span="24">
                <a-card title="学历结构" hoverable :bodyStyle="{ padding: '10px 10px' }">
                  <div class="chart-around">
                    <chart-pie
                      :chartData="educationData"
                      :text="`${searchData.categoryType === 1 ? '执法人员' : searchData.categoryType === 2 ? '监督人员' : '法制审核人员'}`"
                      :subtext="countList.total + ''"
                      v-if="educationData.length > 0"
                      style="height: 200px; width: 100%"
                    ></chart-pie>
                  </div>
                </a-card>
              </a-col>
              <a-col span="12">
                <a-card title="专业结构" hoverable :bodyStyle="{ padding: '10px 10px' }">
                  <div class="chart-around">
                    <div>
                      <a-progress
                        type="circle"
                        :stroke-color="'#fe586a'"
                        :percent="(countList.majorLawTotal / (countList.notMajorLawTotal + countList.majorLawTotal)) * 100"
                        :format="() => `${countList.majorLawTotal ? countList.majorLawTotal : 0}人`"
                        :width="80"
                        :stroke-width="8"
                      />
                      <div class="chart-around-bottom">法律专业</div>
                    </div>
                    <div>
                      <a-progress
                        type="circle"
                        :stroke-color="'#ffc008'"
                        :percent="(countList.notMajorLawTotal / (countList.notMajorLawTotal + countList.majorLawTotal)) * 100"
                        :format="() => `${countList.notMajorLawTotal ? countList.notMajorLawTotal : 0}人`"
                        :width="80"
                        :stroke-width="8"
                      />
                      <div class="chart-around-bottom">非法律专业</div>
                    </div>
                  </div>
                </a-card>
              </a-col>
              <a-col span="12">
                <a-card title="编制结构" hoverable :bodyStyle="{ padding: '10px 10px' }">
                  <div class="chart-around">
                    <div>
                      <a-progress
                        type="circle"
                        :stroke-color="'#3fb8ee'"
                        :percent="(countList.administrationTotal / (countList.administrationTotal + countList.causeTotal)) * 100"
                        :format="() => `${countList.administrationTotal ? countList.administrationTotal : 0}人`"
                        :width="80"
                        :stroke-width="8"
                      />
                      <div class="chart-around-bottom">行政编</div>
                    </div>
                    <div>
                      <a-progress
                        type="circle"
                        :stroke-color="'#2a5ee8'"
                        :percent="(countList.causeTotal / (countList.administrationTotal + countList.causeTotal)) * 100"
                        :format="() => `${countList.causeTotal ? countList.causeTotal : 0}人`"
                        :width="80"
                        :stroke-width="8"
                      />
                      <div class="chart-around-bottom">事业编</div>
                    </div>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </a-col>
          <a-col span="7">
            <a-card title="年龄结构" hoverable :bodyStyle="{ padding: '10px 10px' }">
              <div class="chart-around">
                <!-- :axisLine="false" -->
                <chart-bar-line-mix :chartData="ageData" :splitLineY="false" :customBarColor="customBarColor" :rotate="false" style="height: 440px; width: 100%"></chart-bar-line-mix>
              </div>
            </a-card>
          </a-col>
          <a-col span="7">
            <a-row :gutter="16">
              <a-col span="24">
                <a-card title="法律资格证书" hoverable :bodyStyle="{ padding: '10px 10px' }">
                  <div class="chart-around">
                    <chart-pie :chartData="legalCertificateData" style="height: 160px; width: 100%"></chart-pie>
                  </div>
                </a-card>
              </a-col>
              <a-col span="24">
                <a-card title="政治面貌结构" hoverable :bodyStyle="{ padding: '10px 10px' }">
                  <div class="chart-around">
                    <chart-pie :chartData="politicalOutlookData" style="height: 150px; width: 100%"></chart-pie>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import SelectorUnit from '@/components/selector-unit/index.vue'
import { DatePicker, Progress, Radio } from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { getPersonnelCount, PersonnelCount, exportPersonnelCount } from '@/api/statistics/team-building'
import { downLoadFile } from '@/utils'
import unitName from './unit-name'
import { useStore } from 'vuex'
import { StateType, UserType } from '@/@types'
import { ChartPie } from '@/components/charts'
import { ChartBarLineMix } from '@/components/charts'
import dayjs from 'dayjs'
interface PieData {
  value: number
  name: string
  itemStyle: any
}
export default defineComponent({
  name: 'PersonnelStatistics',
  components: {
    'a-radio-group': Radio.Group,
    'a-radio-button': Radio.Button,
    'a-range-picker': DatePicker.RangePicker,
    'a-progress': Progress,
    // 'a-tooltip': Tooltip,
    SearchOutlined,
    ChartPie,
    ChartBarLineMix,
    SelectorUnit
  },
  setup() {
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const internalInstance = getCurrentInstance()
    const state = reactive({
      timeR: [],
      loading: false,
      countyInfo: {},
      searchData: { categoryType: 1 } as PersonnelCount,
      educationData: [] as any, //学历结构
      ageData: [] as any, //年龄结构
      customBarColor: ['#3fb8ee', 'rgba(63,184,238,0.3)'],
      legalCertificateData: [] as any, // 法律资格证书
      politicalOutlookData: [] as any, // 政治面貌结构
      chartData: [],
      countList: {
        // highSchoolTotal: 0, //高中及中专
        // specialtyTotal: 0, //专科
        // undergraduateTotal: 0, //本科
        // masterTotal: 0, //硕士 研究生
        // majorLawTotal: 0, //法律专业
        // notMajorLawTotal: 0, //
        // administrationTotal: 0, //行政编
        // causeTotal: 0, //事业编
        // greaterThanFifty: 0, //大于50
        // lessThanThirty: 0, //小于30
        // medianTotal: 0, //<=30 >=50
        // legalQualificationTotal: 0, //法律资格人数
        // partyMemberTotal: 0, //党员
        // democraticPartiesTotal: 0, //民主党派
        // theMassesTotal: 0 //群众
      } as any,
      majorLawTotal: 0,
      majorLawTotalPercent: 0
    })
    const getData = async (type: number) => {
      let param = { ...state.searchData }
      param = await unitName(param, state.countyInfo, user)
      if (state.timeR.length > 0) {
        param.startDate = dayjs(state.timeR[0]).format('YYYY-MM-DD 00:00:00')
        param.endDate = dayjs(state.timeR[1]).format('YYYY-MM-DD 23:59:59')
      }
      if (!type) {
        state.loading = true
        getPersonnelCount(param).then(
          (data) => {
            state.countList = { ...data.data }
            countResetInit()
            state.loading = false
          },
          () => {
            state.loading = false
          }
        )
      } else {
        exportPersonnelCount(param).then((data: any) => {
          downLoadFile(data, '执法队伍人员统计表格.xls')
        })
      }
    }
    const countResetInit = () => {
      state.educationData = [
        {
          labelTitle: '学历结构',
          labelShow: false,
          radius: ['60%', '80%'],
          data: [
            { value: state.countList.highSchoolTotal, name: '高中/中专及以下', itemStyle: { color: '#fe586a' } },
            { value: state.countList.specialtyTotal, name: '专科', itemStyle: { color: '#2a5ee8' } },
            { value: state.countList.undergraduateTotal, name: '本科', itemStyle: { color: '#ffc008' } },
            { value: state.countList.masterTotal, name: '硕士研究生及以上', itemStyle: { color: '#3fb8ee' } }
          ] as PieData[]
        }
      ]
      state.ageData = [
        { value: state.countList.lessThanThirty, name: '30岁及以下' },
        { value: state.countList.medianTotal, name: '30 ~ 50岁' },
        { value: state.countList.greaterThanFifty, name: '50岁以上' }
      ]
      state.legalCertificateData = [
        {
          labelTitle: '法律资格证书',
          labelShow: false,
          radius: ['70%', '90%'],
          data: [
            { value: state.countList.legalQualificationTotal, name: '取得法律职业资格证书人数', itemStyle: { color: '#2a5ee8' } },
            { value: state.countList.total - state.countList.legalQualificationTotal, name: '未取得法律职业资格证书人数', itemStyle: { color: '#d6e4ff' } }
          ] as PieData[]
        }
      ]
      let memberTotal = state.countList.partyMemberTotal + state.countList.democraticPartiesTotal + state.countList.theMassesTotal //政治面貌总人数
      state.politicalOutlookData = [
        {
          labelTitle: '政治面貌结构',
          labelShow: false,
          radius: ['70%', '90%'],
          data: [
            {
              value: state.countList.partyMemberTotal,
              name: `党员 ${state.countList.partyMemberTotal + '人/' + (state.countList.partyMemberTotal ? ((state.countList.partyMemberTotal / memberTotal) * 100).toFixed(0) + '%' : 0 + '%')}`,
              itemStyle: { color: '#69d1ac' }
            },
            {
              value: state.countList.democraticPartiesTotal,
              name: `民主党派 ${
                state.countList.democraticPartiesTotal + '人/' + (state.countList.democraticPartiesTotal ? ((state.countList.democraticPartiesTotal / memberTotal) * 100).toFixed(0) + '%' : 0 + '%')
              }`,
              itemStyle: { color: '#fe586a' }
            },
            {
              value: state.countList.theMassesTotal,
              name: `群众 ${state.countList.theMassesTotal + '人/' + (state.countList.theMassesTotal ? ((state.countList.theMassesTotal / memberTotal) * 100).toFixed(0) + '%' : 0 + '%')}`,
              itemStyle: { color: '#d5b5ff' }
            }
          ] as PieData[]
        }
      ]
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
.personnel-statistics {
  .chart {
    .chart-around {
      width: 100%;
      display: flex;
      justify-content: space-around;
      padding: 20px 0;
      .chart-around-bottom {
        display: flex;
        justify-content: center;
        padding: 5px 0;
      }
    }
  }
}
</style>
