<template>
  <div class="credential-manage">
    <top-certificate-actions :selected-certificate-ids="selectedRowKeys" @refreshData="refreshData" @onCertificateAction="onCertificateAction" />
    <!--    筛选-->
    <a-card hoverable :bodyStyle="{ padding: '10px 10px 15px 10px' }">
      <div class="search-div">
        <span class="mg-left-top">
          <label>单位名称：</label>
          <selector-unit v-model:unitId="searchData.orgId" :showType="1"></selector-unit>
        </span>
        <span class="mg-left-top">
          <label>姓名：</label>
          <a-input v-model:value="searchData.userName" placeholder="请输入姓名" allowClear style="width: 140px" />
        </span>
        <span class="mg-left-top">
          <label>证件号码：</label>
          <a-input v-model:value="searchData.certificatesCode" placeholder="请输入证件号码" allowClear style="width: 150px" />
        </span>
        <span class="mg-left-top">
          <label>证件类型：</label>
          <a-radio-group v-model:value="searchData.certificatesType">
            <a-radio :value="-1">全部</a-radio>
            <a-radio v-for="item in enumData.certificatesType" :key="item.enumCode" :value="item.enumCode">{{ item.enumDescription }}</a-radio>
          </a-radio-group>
        </span>
        <span class="mg-left-top">
          <label>证件状态：</label>
          <a-select v-model:value="searchData.certificatesStatus" style="width: 140px" allowClear placeholder="请选择证件状态">
            <a-select-option v-for="item in enumData.certificatesStatus" :key="item.enumCode" :value="item.enumCode">{{ item.enumDescription }}</a-select-option>
          </a-select>
        </span>
        <span class="mg-left-top">
          <label>办理状态：</label>
          <a-select v-model:value="searchData.certificatesBusiness" style="width: 140px" allowClear placeholder="请选择证件办理状态">
            <a-select-option v-for="item in enumData.certificatesBusiness" :key="item.enumCode" :value="item.enumCode">{{ item.enumDescription }}</a-select-option>
          </a-select>
        </span>
        <a-button type="primary" class="mg-left-top" shape="round" @click="onSearch">
          <template #icon><SearchOutlined /></template>
          查询
        </a-button>
      </div>
    </a-card>
    <!--    Table-->
    <a-card class="data-table-card" hoverable>
      <a-row type="flex" justify="space-between" class="table-actions">
        <template v-if="showCheckbox">
          <a-col class="left-tip">
            <ExclamationCircleFilled style="color: #0e78dc; padding-right: 10px" />
            <span>
              已选择
              <span style="color: #0e78dc">{{ selectedRowKeys.length }}</span>
              项
            </span>
            <a-button class="marginLeft10" type="link" @click="clearSelectedRows">清空</a-button>
            <a-button class="marginLeft10" type="link" @click="cancelCurrentAction">取消操作</a-button>
            <a-button class="marginLeft10" type="link" style="color: red" @click="onConfirmAction">确认{{ actionType.title }}</a-button>
          </a-col>
        </template>
        <template v-else><a-col></a-col></template>
        <a-col>
          <a-button
            v-for="(item, index) in twoActions"
            :key="index"
            class="mg-left-top btn-min-w"
            :type="item.buttonColor"
            @click="onTwoAction(item)"
            :disabled="user.organizationType !== 1 || user.isJustice === false"
            :shape="item.shape"
          >
            {{ item.title }}
          </a-button>
          <!-- && user.isJustice -->
          <a-button class="mg-left-top" shape="round" @click="onImportExcel" v-if="user.organizationType === 1"><DownloadOutlined />导入Excel</a-button>
          <a-button class="mg-left-top" shape="round" @click="onExportData" :loading="exportLoading">
            <template #icon><UploadOutlined /></template>
            导出数据
          </a-button>
        </a-col>
      </a-row>
      <a-table
        bordered
        :scroll="{ x: 'max-content', y: 'calc(100vh - 470px)' }"
        :dataSource="dataSource"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        size="small"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'lawEnforcement'">
            <template v-if="record.lawEnforcement && record.lawEnforcement.length > 15">
              <a-tooltip>
                <template #title>
                  <div>{{ record.lawEnforcement }}</div>
                </template>
                {{ record.lawEnforcement.substring(0, 15) + '...' }}
              </a-tooltip>
            </template>
            <template v-else> {{ record.lawEnforcement }}</template>
          </template>

          <template v-if="column.dataIndex === 'action'">
            <a-button type="link" size="small" @click="onViewCurrentItemDetail(record)">查看详情</a-button>
            <a-button
              type="link"
              size="small"
              @click="onEnableCertificate(record)"
              :disabled="
                (record.certificatesBusiness !== 2 && record.certificatesStatus !== 4 && record.certificatesStatus !== 5) ||
                user.organizationType !== 1 ||
                user.unitOrgId !== record.memberInfoOutput.organizationId
              "
            >
              启用
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
    <!--    办结弹窗-->
    <a-modal v-model:visible="showFinishBusinessModal" title="办结" :footer="null" :body-style="{ paddingLeft: '50px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <finish-business @closeModal="showFinishBusinessModal = false" :certificateIds="selectedRowKeys" @onSave="onFinishBusinessSave" />
    </a-modal>
    <!--    退回弹窗-->
    <a-modal v-model:visible="showBackspaceModal" title="退回" :footer="null" width="30%" :body-style="{ paddingLeft: '50px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <backspace @closeModal="showBackspaceModal = false" :certificateIds="selectedRowKeys" @onSave="onBackspaceSave" />
    </a-modal>
    <!--    查看证件详情-->
    <a-modal v-model:visible="showCertificateDetailModal" title="查看详情" :footer="null" width="70%" :body-style="{ paddingLeft: '50px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <certificate-detail v-if="showCertificateDetailModal" @closeModal="showCertificateDetailModal = false" :certificateId="certificateId" />
    </a-modal>
    <!--    证件启用-->
    <a-modal v-model:visible="showEnableCertificateModal" title="证件启用" :footer="null" :body-style="{ paddingLeft: '50px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <enable-certificate @closeModal="showEnableCertificateModal = false" :certificatesId="certificateId" :certificateCode="certificateCode" @onSave="onEnableCertificateSave" />
    </a-modal>
    <!--    导入-->
    <a-modal v-model:visible="showImportExcelModal" title="导入数据" :footer="null" :body-style="{ paddingLeft: '50px', paddingRight: '50px' }">
      <template #closeIcon><CloseCircleFilled /></template>
      <import-excel @closeModal="showImportExcelModal = false" @onSave="onSaveImportExcel" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, getCurrentInstance, createVNode } from 'vue'
import { Select, Radio, Tooltip } from 'ant-design-vue'
import { SearchOutlined, CloseCircleFilled, ExclamationCircleFilled, ExclamationCircleOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { downLoadFile } from '@/utils'
import enumFactory from '@/common-api/enum'
import { StateType, UserType } from '@/@types'
import { fetchCertificateList, SearchCertificateType, CertificateEnumType, fetchFinishBusiness, fetchExportData, fetchHandleBusiness } from '@/api/subject/certificate'
import SelectorUnit from '@/components/selector-unit/index.vue'
import TopCertificateActions from './components/top-certificate-actions.vue'
import FinishBusiness from './components/finish-business.vue'
import CertificateDetail from './components/certificate-detail.vue'
import Backspace from './components/backspace.vue'
import ImportExcel from './components/import-excel.vue'
import EnableCertificate from './components/enable-certificate.vue'

export default defineComponent({
  name: 'CredentialsManage',
  components: {
    'a-radio-group': Radio.Group,
    'a-radio': Radio,
    'a-select': Select,
    'a-select-option': Select.Option,
    'a-tooltip': Tooltip,
    ImportExcel,
    SearchOutlined,
    DownloadOutlined,
    TopCertificateActions,
    CloseCircleFilled,
    FinishBusiness,
    CertificateDetail,
    Backspace,
    EnableCertificate,
    SelectorUnit,
    UploadOutlined,
    ExclamationCircleFilled
  },
  setup() {
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const internalInstance = getCurrentInstance()
    const searchData: SearchCertificateType = reactive({
      orgId: undefined, // 单位id
      userName: '', // 人员姓名
      certificatesCode: '', // 证件号码
      certificatesType: -1, // 证件类型
      certificatesStatus: undefined, // 证件状态
      operationType: undefined, // 办理类型
      certificatesBusiness: undefined, // 办理状态
      pageIndex: 1,
      pageSize: 10
    })
    const enumData = reactive({
      certificateActionTypeEnum: [], // 顶部证件操作类型
      transactTypeEnum: [], // 办理类型
      certificateStatusEnum: [] // 证件状态
    })
    const state = reactive({
      columns: [
        {
          title: '证件号码',
          dataIndex: 'certificatesCode',
          width: 150
        },
        {
          title: '姓名',
          width: 90,
          dataIndex: ['memberInfoOutput', 'memberName']
        },
        {
          title: '证件类型',
          dataIndex: 'certificatesTypeName',
          width: 100
        },
        {
          title: '证件状态',
          dataIndex: 'certificatesStatusName',
          width: 80
        },
        {
          title: '办理状态',
          dataIndex: 'certificatesBusinessName',
          width: 120
        },
        {
          title: '执法领域',
          dataIndex: 'lawEnforcement',
          width: 150
          // slots: { customRender: 'lawEnforcement' }
        },
        {
          title: '单位名称',
          dataIndex: ['memberInfoOutput', 'organizationName'],
          width: 160
        },
        {
          title: '机构名称',
          width: 180,
          dataIndex: ['memberInfoOutput', 'agencyOrganizationName']
        },
        {
          title: '手机号',
          dataIndex: 'memberInfoOutput.memberPhone',
          width: 110,
          customCell: (record: any) => {
            return {
              innerHTML: !record.memberInfoOutput.memberPhone ? '' : record.memberInfoOutput.memberPhone.replace(/^(.{3})(?:\w+)(.{4})$/, '$1****$2')
            }
          }
        },
        {
          title: '身份证号',
          dataIndex: ['memberInfoOutput', 'memberIdCard'],
          width: 160
        },
        {
          title: '性别',
          width: 60,
          dataIndex: 'memberInfoOutput.sex',
          customCell: (record: any) => {
            return {
              innerHTML: record.memberInfoOutput.sex ? '女' : '男'
            }
          }
        },
        {
          title: '出生日期',
          width: 100,
          dataIndex: 'memberInfoOutput.memberBirthday',
          customCell: (record: any) => {
            return {
              innerHTML: internalInstance?.appContext.config.globalProperties.$parseTime(record.memberInfoOutput.memberBirthday, '{y}-{m}-{d}')
            }
          }
        },
        {
          title: '政治面貌',
          width: 100,
          dataIndex: ['memberInfoOutput', 'memberPoliticalName']
        },
        {
          title: '职务',
          dataIndex: ['memberInfoOutput', 'memberPosition'],
          width: 120
        },
        {
          title: '职级',
          dataIndex: ['memberInfoOutput', 'memberLevel'],
          width: 120
        },
        {
          title: '民族',
          dataIndex: ['memberInfoOutput', 'memberNationName'],
          width: 100
        },
        {
          title: '最高学历',
          dataIndex: ['memberInfoOutput', 'topDegreeName'],
          width: 150
        },
        {
          title: '学历专业',
          dataIndex: ['memberInfoOutput', 'memberMajor'],
          width: 100
        },
        {
          title: '编制性质',
          dataIndex: ['memberInfoOutput', 'regularNatureName'],
          width: 100
        },
        {
          title: '岗位性质',
          dataIndex: ['memberInfoOutput', 'positionNatureName'],
          width: 100
        },
        {
          title: '公共法律知识成绩',
          dataIndex: ['memberInfoOutput', 'commonKnowledgeScore'],
          width: 100
        },
        {
          title: '专业法律知识成绩',
          dataIndex: ['memberInfoOutput', 'lawKnowledgeScore'],
          width: 100
        },
        {
          title: '是否具有法律职业资格',
          dataIndex: 'memberInfoOutput.isHaveLawQualification',
          width: 100,
          customCell: (record: any) => {
            return {
              innerHTML: record.memberInfoOutput.isHaveLawQualification ? '是' : '否'
            }
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 135,
          fixed: 'right',
          slots: { customRender: 'action' }
        }
      ],
      dataSource: [] as any,
      selectedRowKeys: [] as string[],
      selectedRows: [] as any,
      loading: false,
      pagination: {
        ...internalInstance?.appContext.config.globalProperties.$page
      },
      showFinishBusinessModal: false, // 办结弹窗
      showBackspaceModal: false, // 退回弹窗
      showCertificateDetailModal: false, // 查看详情弹窗
      certificateId: '', // 证件id
      certificateCode: '', // 证件号
      enumData: [] as CertificateEnumType[],
      exportLoading: false, // 导出数据时的按钮loading
      showEnableCertificateModal: false, // 显示证件启用modal
      showImportExcelModal: false, // 显示导入modal
      showCheckbox: false, // 显示Table前的选择框
      actionType: {} as any,
      twoActions: [
        {
          type: 7,
          title: '退回',
          subTitle: '确认退回',
          buttonColor: 'danger',
          shape: 'round'
        },
        {
          type: 8,
          title: '办结',
          subTitle: '确认办结',
          buttonColor: 'primary',
          shape: 'round'
        }
      ]
    })
    const handleTableChange = (pagination: any) => {
      state.pagination.current = pagination.current
      state.pagination.pageSize = pagination.pageSize
      getData()
    }
    const getData = () => {
      const param = { ...searchData }
      param.pageIndex = state.pagination.current
      param.pageSize = state.pagination.pageSize
      state.loading = true
      if (param.certificatesType === -1) {
        delete param.certificatesType
      }
      fetchCertificateList(param).then(
        (result) => {
          state.dataSource = result.data.data
          state.pagination.total = result.data.dataCount
          state.loading = false
        },
        () => {
          state.loading = false
        }
      )
    }
    const onSearch = () => {
      state.pagination.current = 1
      state.certificateId = ''
      state.showCheckbox = false
      state.selectedRowKeys = []
      state.selectedRows = []
      state.showCheckbox = false
      getData()
    }
    const onCertificateAction = (item: any) => {
      state.showCheckbox = true
      state.actionType = item
      internalInstance?.appContext.config.globalProperties.$message.info('请从下面列表中选择要操作的证件')
    }
    onMounted(() => {
      onSearch()
    })
    const refreshData = () => {
      onSearch()
      state.selectedRowKeys = []
      state.selectedRows = []
    }
    const clearSelectedRows = () => {
      state.selectedRowKeys = []
      state.selectedRows = []
    }
    const onViewCurrentItemDetail = (record: any) => {
      state.certificateId = record.id
      state.showCertificateDetailModal = true
    }
    // 退回
    const onBackspace = () => {
      for (const item of state.selectedRows) {
        if (item.certificatesBusiness !== 0 && item.certificatesBusiness !== 2) {
          state.showBackspaceModal = true
        } else {
          internalInstance?.appContext.config.globalProperties.$message.warning('请选择办理状态为审核中的证件')
          state.showBackspaceModal = false
          return
        }
      }
    }
    const onBackspaceSave = () => {
      state.showBackspaceModal = false
      onSearch()
    }
    // 办结
    const onFinishBusiness = () => {
      let isApplying = false
      for (const item of state.selectedRows) {
        if (item.certificatesBusiness === 0 || item.certificatesBusiness === 2) {
          internalInstance?.appContext.config.globalProperties.$message.warning('请选择办理状态为审核中的证件')
          return
        }
        isApplying = item.certificatesBusiness === 1
      }
      if (isApplying) {
        state.showFinishBusinessModal = true
      } else {
        showConfirm('办结', () => {
          fetchFinishBusiness({ applicant: '', applicantPhone: '', certificatesIds: state.selectedRowKeys }).then(
            () => {
              internalInstance?.appContext.config.globalProperties.$message.success('办结成功')
              onSearch()
            },
            () => {
              internalInstance?.appContext.config.globalProperties.$message.error('办结失败')
            }
          )
        })
      }
    }
    const onFinishBusinessSave = () => {
      state.showFinishBusinessModal = false
      onSearch()
    }
    const onTwoAction = (item: any) => {
      state.actionType = item
      state.showCheckbox = true
    }
    const cancelCurrentAction = () => {
      state.showCheckbox = false
      state.selectedRowKeys = []
      state.selectedRows = []
    }
    const onEnableCertificate = (record: any) => {
      state.showEnableCertificateModal = true
      state.certificateId = record.id
      state.certificateCode = record.certificatesCode
    }
    const onEnableCertificateSave = () => {
      state.showEnableCertificateModal = false
      onSearch()
    }
    // 获取枚举数据
    const getEnumData = async () => {
      state.enumData = await enumFactory(['certificatesBusiness', 'certificatesStatus', 'certificatesType'], 'business')
    }
    const onImportExcel = () => {
      state.showImportExcelModal = true
    }
    const onSaveImportExcel = () => onSearch()
    const onExportData = () => {
      state.exportLoading = true
      const param = { ...searchData }
      if (param.certificatesType === -1) {
        delete param.certificatesType
      }
      fetchExportData(param).then(
        (result: any) => {
          downLoadFile(result, '证件信息表格.xls')
          state.exportLoading = false
        },
        () => {
          state.exportLoading = false
        }
      )
    }
    // 多选
    const onSelectChange = (selectedRowKeys: [], selectedRows: any) => {
      state.selectedRowKeys = selectedRowKeys
      state.selectedRows = selectedRows
    }
    const onConfirmAction = () => {
      if (state.selectedRowKeys.length > 0) {
        if (state.actionType.type === 7) {
          onBackspace()
        } else if (state.actionType.type === 8) {
          onFinishBusiness()
        } else {
          showConfirm(state.actionType.title, () => {
            fetchHandleBusiness(state.actionType.type, state.selectedRowKeys).then(() => {
              internalInstance?.appContext.config.globalProperties.$message.success('操作成功')
              onSearch()
            })
          })
        }
        return
      }
      internalInstance?.appContext.config.globalProperties.$message.warning('请从下面列表中选择要操作的证件')
    }
    const showConfirm = (title: string, onOk: () => void) => {
      internalInstance?.appContext.config.globalProperties.$modal.confirm({
        title: title,
        content: '您确定要执行该操作吗? ',
        icon: createVNode(ExclamationCircleOutlined),
        onOk() {
          onOk()
        }
      })
    }
    getEnumData()
    return {
      user,
      onSearch,
      getEnumData,
      searchData,
      handleTableChange,
      ...toRefs(enumData),
      ...toRefs(state),
      onViewCurrentItemDetail,
      onSelectChange,
      onBackspace,
      onBackspaceSave,
      onFinishBusiness,
      onFinishBusinessSave,
      onExportData,
      onImportExcel,
      onSaveImportExcel,
      onEnableCertificate,
      onEnableCertificateSave,
      refreshData,
      clearSelectedRows,
      onConfirmAction,
      onCertificateAction,
      onTwoAction,
      cancelCurrentAction
    }
  }
})
</script>
<style lang="less" scoped>
.credential-manage {
  .data-table-card {
    .table-actions {
      padding-bottom: 10px;
      .actions {
        margin-right: 20px;
      }
    }
    .left-tip {
      padding: 3px 10px;
      background-color: #ebf8ff;
      border: 1px solid #c7ecff;
      border-radius: 4px;
    }
  }
}
</style>
