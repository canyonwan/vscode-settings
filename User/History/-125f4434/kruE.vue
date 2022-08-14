<template>
  <div class="law-enforcement-table">
    <div class="searchForm">
      <!-- 执法人员&执法监督人员 -->
      <a-input class="input" v-if="type < 3" v-model:value="searchPersonnelParams.departname" style="width: 150px" placeholder="请输入单位名称" allowClear />
      <a-input class="input" v-if="type < 3" v-model:value="searchPersonnelParams.name" style="width: 150px" placeholder="请输入人员姓名" allowClear />
      <!-- 执法主体 -->
      <a-input class="input" v-if="type === 3" v-model:value="searchSubjectParams.lawDepartment" style="width: 150px" placeholder="请输入执法部门名称" allowClear />
      <a-input class="input" v-if="type === 3" v-model:value="searchSubjectParams.lawMaint" style="width: 150px" placeholder="请输入执法主体" allowClear />
      <!-- 执法事项 -->
      <a-select class="select" v-if="type === 4" v-model:value="searchMatterParams.lawtypeCode" :options="options" style="width: 150px" placeholder="请选择" />
      <a-input class="input" v-if="type === 4" v-model:value="searchMatterParams.laworganName" style="width: 150px" placeholder="请输入实施单位或执法部门" allowClear />
      <a-input class="input" v-if="type === 4" v-model:value="searchMatterParams.authorityName" style="width: 150px" placeholder="请输入事项名称" allowClear />
      <a-input class="input" v-if="type === 4" v-model:value="searchMatterParams.punishLicensenumber" style="width: 150px" placeholder="请输入罚没许可证号" allowClear />
      <a-button size="small" type="primary" danger @click="resetInit"><SearchOutlined />查询</a-button>
    </div>
    <a-table
      bordered
      :scroll="{ x: 850, y: 'calc( 100vh - 420px)' }"
      :data-source="dataSource"
      :columns="matterColumns"
      :loading="loading"
      :pagination="pagination"
      rowKey="id"
      size="small"
      @change="handleTableChange"
      :key="currentLawType"
    >
      <template #bodyCell="{ text, column }" v-if="type === 3">
        <template v-if="column.width === 80">
          <check-outlined v-if="text === 1" />
        </template>
      </template>
      <template #bodyCell="{ record, text, column }" v-if="type === 4">
        <template v-if="column.dataIndex === 'authorityName'">
          <a-button type="link" @click="openUrl(record)">
            <a-tooltip :title="text" v-if="text.length > 18">
              {{ text.substring(0, 18) + '...' }}
            </a-tooltip>
            <template v-else> {{ text }}</template>
          </a-button>
        </template>
        <template v-if="column.dataIndex === 'lawtypeCode'">
          {{ record.lawtypeCode === 110 ? '行政许可' : record.lawtypeCode === 120 ? '行政处罚' : record.lawtypeCode === 130 ? '行政强制' : record.lawtypeCode === 160 ? '行政检查' : '征收征用' }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, toRefs, watch } from 'vue'
import { queryMatterList, queryPersonList, querySubjectList } from '@/api/publicity-platform/before'
import { CheckOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { matterOtherColumn, matterPunishColumn, matterPermitColumn } from './columns'
import { Select, Tooltip } from 'ant-design-vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'LawEnforcementTable',
  components: {
    SearchOutlined,
    CheckOutlined,
    'a-select': Select,
    'a-tooltip': Tooltip
  },
  props: {
    orgInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    columns: {
      type: Array,
      default: () => []
    },
    // 1执法人员，2执法监督人员，3执法主体，4执法事项
    type: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
    const internalInstance = getCurrentInstance()
    const router = useRouter()
    const state = reactive({
      orgData: {} as any,
      loading: false,
      detailUrl: process.env.VUE_APP_BASE_URL, // 事项详情地址
      matterColumns: props.columns,
      searchPersonnelParams: {
        certtype: props.type.toString(), // 1查询执法人员 2查询执法监督人员
        departname: '', // 单位名称
        name: '' // 人员名称
      },
      searchSubjectParams: {
        lawDepartment: '', //执法部门
        lawMaint: '', // 执法主体
        name: '' // 人员名称
      },
      currentLawType: '110', // 当前事项类别
      searchMatterParams: {
        lawtypeCode: '110', //事项类别ID
        punishLicensenumber: '', // 罚没许可证号
        laworganName: '', // 实施单位/执法主体
        authorityName: '' //事项名称
      },
      pagination: {
        ...internalInstance?.appContext.config.globalProperties.$page
      },
      options: [
        {
          label: '行政许可',
          value: '110'
        },
        {
          label: '行政处罚',
          value: '120'
        },
        {
          label: '行政强制',
          value: '130'
        },
        {
          label: '行政检查',
          value: '160'
        },
        {
          label: '征收征用',
          value: '200'
        }
      ],
      dataSource: [] // 列表数据
    })
    const resetInit = () => {
      state.pagination.current = 1
      getData()
    }
    const getData = () => {
      state.loading = true
      if (props.type < 3) {
        queryPersonList({ ...state.searchPersonnelParams, page: state.pagination.current, size: state.pagination.pageSize, ...state.orgData }).then(
          (result: any) => {
            state.loading = false
            state.dataSource = result.data.data
            state.pagination.total = result.data.dataCount
          },
          () => {
            state.loading = false
          }
        )
      } else if (props.type === 3) {
        querySubjectList({ ...state.searchSubjectParams, page: state.pagination.current, size: state.pagination.pageSize, ...state.orgData }).then(
          (result: any) => {
            state.loading = false
            state.dataSource = result.data.data
            state.pagination.total = result.data.dataCount
          },
          () => {
            state.loading = false
          }
        )
      } else {
        state.currentLawType = state.searchMatterParams.lawtypeCode
        if (state.searchMatterParams.lawtypeCode === '110') {
          state.matterColumns = matterPermitColumn
        } else if (state.searchMatterParams.lawtypeCode === '120') {
          state.matterColumns = matterPunishColumn
        } else {
          state.matterColumns = matterOtherColumn
        }
        queryMatterList({ ...state.searchMatterParams, page: state.pagination.current, size: state.pagination.pageSize, ...state.orgData }).then(
          (result: any) => {
            state.loading = false
            state.dataSource = result.data.data
            state.pagination.total = result.data.dataCount
          },
          () => {
            state.loading = false
          }
        )
      }
    }
    const handleTableChange = (pagination: any) => {
      state.pagination.current = pagination.current
      state.pagination.pageSize = pagination.pageSize
      getData()
    }
    const openUrl = (record: any) => {
      const { href } = router.resolve({
        path: 'publicityDetail/detail',
        query: { type: '0', id: record.id }
      })
      console.log('%c [ href ]-191', 'font-size:13px; background:#0095FF; color:white;', href)
      window.open(href, '_blank')
    }
    watch(
      () => props.orgInfo,
      () => {
        state.orgData = { organizationId: props.orgInfo.orgId, isSameLevel: props.orgInfo.isSameLevel, isSubordinate: props.orgInfo.isSubordinate, selectAll: !props.orgInfo.orgId ? true : false }
        resetInit()
      },
      { immediate: true }
    )
    return {
      ...toRefs(state),
      resetInit,
      handleTableChange,
      openUrl
    }
  }
})
</script>
<style lang="less" scoped>
.law-enforcement-table {
  .input {
    margin-right: 10px;
  }
  .select {
    margin-right: 35px;
  }
  .searchForm {
    display: flex;
    // justify-content: flex-end;
    margin: 15px 0;
  }
}
</style>
