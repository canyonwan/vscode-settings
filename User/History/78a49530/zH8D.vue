<template>
  <div class="sign-up-record">
    <div class="search-div marginBottom">
      <span class="mg-left">
        <label>单位名称：</label>
        <a-select v-model:value="searchData.orgId" style="width: 140px" allowClear placeholder="请选择单位">
          <a-select-option v-for="(item, index) in unitList" :key="index" :value="item.id">{{ item.organizationName }}</a-select-option>
        </a-select>
      </span>
      <span class="mg-left">
        <label>报名时间：</label>
        <a-range-picker v-model:value="signUpDateList" style="width: 220px" allowClear />
      </span>
      <span class="mg-left-top">
        <label>是否报名：</label>
        <a-radio-group v-model:value="searchData.isSignUp">
          <a-radio :value="0">全部</a-radio>
          <a-radio :value="1">是</a-radio>
          <a-radio :value="2">否</a-radio>
        </a-radio-group>
      </span>
      <a-button type="primary" class="mg-left" shape="round" @click="getData">
        <template #icon><SearchOutlined /></template> 查询</a-button
      >
    </div>
    <a-table bordered :scroll="{ x: 'max-content', y: 'calc(100vh - 470px)' }" :dataSource="dataSources" :columns="columns" :loading="loading" :pagination="false" rowKey="orgName" size="small">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'isSignUp'">
          <template v-if="record.signUpTotal > 0">
            <a-tag color="success">是</a-tag>
          </template>
          <template v-else>
            <a-tag color="error">否</a-tag>
          </template>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'
import { StateType, UserType } from '@/@types/index'
import { getUnitDataByDistrictId, UnitType } from '@/api/subject/org-manage'
import { DatePicker, Radio, Select, Tag } from 'ant-design-vue'
import { defineComponent, getCurrentInstance, onMounted, reactive, toRefs, watch } from 'vue'
import { querySignUpRecord, SignUpRecordItemType } from '@/api/subject/law-test'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'SignUpRecord',
  emits: ['onSave'],
  components: {
    'a-range-picker': DatePicker.RangePicker,
    'a-radio-group': Radio.Group,
    'a-radio': Radio,
    'a-tag': Tag,
    'a-select': Select,
    'a-select-option': Select.Option,
    SearchOutlined
  },
  props: {
    trainId: {
      type: String,
      default: () => ''
    },
    refreshData: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const internalInstance = getCurrentInstance()
    const searchData = reactive({
      orgId: undefined, // 单位名称
      signUpStartDate: '', // 报名开始
      signUpEndDate: '', // 报名结束
      isSignUp: 0, // 是否报名 1是 2否
      trainId: ''
    })
    const state = reactive({
      loading: false,
      dataSources: [] as SignUpRecordItemType[],
      signUpDateList: [],
      unitList: [] as UnitType[],
      columns: [
        {
          title: '单位名称',
          dataIndex: 'orgName'
        },
        {
          title: '报名时间',
          dataIndex: 'signUpTime',
          width: 120,
          customCell: (record: any) => {
            return {
              innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.signUpTime, '{y}-{m}-{d}')
            }
          }
        },
        {
          title: '报名人数',
          dataIndex: 'signUpTotal',
          width: 80
        },
        {
          title: '是否报名',
          dataIndex: 'isSignUp',
          width: 80,
          slots: { customRender: 'isSignUp' }
        }
      ]
    })
    // 通过地区id获取单位列表
    const fetchUnitList = () => {
      getUnitDataByDistrictId(user.districtId).then((result) => {
        state.unitList = result.data
      })
    }
    watch(
      () => props.refreshData,
      () => {
        if (props.refreshData) getData()
      }
    )
    onMounted(() => {
      fetchUnitList()
      getData()
    })
    const getData = () => {
      let params = { ...searchData }
      params.orgId = searchData.orgId
      params.trainId = props.trainId
      if (state.signUpDateList) {
        params.signUpStartDate = internalInstance?.appContext.config.globalProperties.$parseTime(state.signUpDateList[0], '{y}-{m}-{d}')
        params.signUpEndDate = internalInstance?.appContext.config.globalProperties.$parseTime(state.signUpDateList[1], '{y}-{m}-{d}')
      }
      params.isSignUp = searchData.isSignUp
      state.loading = true
      querySignUpRecord(params).then(
        (result: any) => {
          state.dataSources = result.data
          state.loading = false
        },
        () => {
          state.loading = false
        }
      )
    }
    return { ...toRefs(state), searchData, getData }
  }
})
</script>

<style lang="less" scoped>
.sign-up-record {
}
</style>
