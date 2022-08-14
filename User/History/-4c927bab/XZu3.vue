<template>
  <div class="law-enforcer">
    <div class="searchForm">
      <a-input v-model:value="searchParams.unitName" style="width: 150px" placeholder="请输入单位名称" allowClear />
      <a-input v-model:value="searchParams.personnelName" style="width: 150px" placeholder="请输入人员姓名" allowClear />
      <a-button size="small" type="primary" danger @click="resetInit"><SearchOutlined />查询</a-button>
    </div>
    <a-table
      bordered
      :scroll="{ x: 'max-content', y: 'calc( 100vh - 490px)' }"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      rowKey="id"
      size="small"
      @change="handleTableChange"
    >
    </a-table>
  </div>
</template>

<script lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'
import { defineComponent, getCurrentInstance, reactive, toRefs, watch } from 'vue'
export default defineComponent({
  name: 'PublicityBefore',
  components: {
    SearchOutlined
  },
  props: {
    orgId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const internalInstance = getCurrentInstance()
    const state = reactive({
      loading: false,
      searchParams: {
        orgId: '', // 机关id
        type: '', // 类型
        unitName: '', // 单位名称
        personnelName: '' // 人员名称
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'sort',
          width: 60
        },
        {
          title: '单位名称',
          dataIndex: 'unitOrganizationName',
          resizable: true,
          width: 200
        },
        {
          title: '姓名',
          dataIndex: 'personnelName',
          resizable: true,
          width: 200,
          minWidth: 100,
          maxWidth: 200
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width: 60
        },
        {
          title: '执法证号',
          dataIndex: 'code',
          width: 120
        },
        {
          title: '执法领域',
          dataIndex: 'local',
          width: 120
        },
        {
          title: '执法区域',
          dataIndex: 'address',
          width: 120
        }
      ],
      pagination: {
        ...internalInstance?.appContext.config.globalProperties.$page
      },
      dataSource: [] // 列表数据
    })
    const resetInit = () => {
      state.pagination.current = 1
      getData()
    }
    const getData = () => {
      // state.loading = true
      // queryData(state.searchParams).then(
      //   (data: any) => {
      //     state.loading = false
      //     state.dataSource = data.data
      //     state.pagination = data.data.dataCount
      //   },
      //   () => {
      //     state.loading = false
      //   }
      // )
      state.dataSource = [
        {
          id: '1',
          unitOrganizationName: '双滦区住房和城乡建设局',
          personnelName: '双滦区住房和城乡建设局'
        },
        {
          id: '2',
          unitOrganizationName: '双滦区住房和城乡建设局双滦区住房和城乡建设局',
          personnelName: '双滦区住房和城乡建设局'
        }
      ] as any
    }
    const handleTableChange = (pagination: any) => {
      state.pagination.current = pagination.current
      state.pagination.pageSize = pagination.pageSize
      getData()
    }
    watch(
      () => props.orgId,
      () => {
        state.searchParams.orgId = props.orgId
      },
      { immediate: true }
    )
    return {
      ...toRefs(state),
      resetInit,
      handleTableChange
    }
  }
})
</script>
<style lang="less" scoped>
.law-enforcer {
  .searchForm {
    display: flex;
    // justify-content: flex-end;
    margin: 15px 0;
  }
}
</style>
