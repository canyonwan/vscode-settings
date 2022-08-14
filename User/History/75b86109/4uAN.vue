<template>
  <div class="collect-evidence">
    <!-- <n-tabs @update:value="updateType" class="pb-2" v-if="evidenceTypeList && evidenceTypeList.length" justify-content="space-around" type="line">
      <n-tab v-for="item in evidenceTypeList" :key="item.id" :name="item.id ? item.id : ''" :tab="item.name" />
    </n-tabs> -->
    <div v-if="evidenceTypeList && evidenceTypeList.length" class="w-full flex border-b-2 mb-4 border-opacity-5">
      <template v-for="item in evidenceTypeList" :key="item.id">
        <div
          class="cursor-pointer flex-auto flex justify-center p-2"
          style="font-size: 16px"
          :class="{ 'border-b-2 font-semibold': currentType === item.id }"
          :style="{ borderColor: currentType === item.id ? '#6ec7ff' : '', color: currentType === item.id ? '#6ec7ff' : '' }"
          @click="updateType(item)"
        >
          <div>{{ item.name }}</div>
        </div>
      </template>
    </div>
    <basic-table :columns="columns" :action-column="actionColumn" :request="resetInit" ref="tableRef">
      <template #tableTitle>
        <n-button type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <AddOutline />
            </n-icon>
          </template>
          新增
        </n-button>
      </template>
    </basic-table>
  </div>
  <basic-modal @register="evidenceModal" style="width: 70%" :title="`新增${currentTypeName}`">
    <evidence-save :key="currentType" :evidenceType="currentType" :schemas="currentSchemas" :evidenceInfo="evidenceInfo" :caseConnectionIds="caseConnectionIds" @on-submit="evidenceSubmit" />
  </basic-modal>
</template>

<script lang="ts">
  import { ICaseConnectId, IEnforcerInfo } from '@/api/time-line/types'
  import { queryAllEvidenceType } from '@/api/cause-manage/evidence'
  import { IGroupItemType } from '@/api/cause-manage/types'
  import { TableAction } from '@/components/table'
  import { columns } from './components/columns'
  import EvidenceSave from './components/evidence-save.vue'
  import { AddOutline } from '@vicons/ionicons5'
  import { deleteEvidence, queryEvidenceData, queryEvidenceDetail } from '@/api/evidence/evidence'
  import { useModal } from '@/components/modal'
  import { IEvidenceParams } from '@/api/evidence/types'
  import { handleColumn } from './components/options'
  import { useDialog } from 'naive-ui'

  export default defineComponent({
    name: 'Evidence',
    components: { AddOutline, EvidenceSave },
    props: {
      // 证据数据列表
      // evidenceList: {
      //   type: Array as PropType<IEnforcerInfo[]>,
      //   default: () => {
      //     return []
      //   }
      // },
      // 程序执法人员列表
      enforcersList: {
        type: Array as PropType<IEnforcerInfo[]>,
        default: () => {
          return []
        }
      },
      // 案件关联的四个id, 程序id，时间轴id,工具id,工具组id,
      // baseEvidenceTypeId证据类型id。等证据新增需要的id. 程序ID 1 关联类型 1 时间轴id timeLineId
      caseConnectionIds: {
        type: Object as PropType<ICaseConnectId>,
        default: () => {
          return {}
        }
      }
    },
    emits: ['onSubmit', 'closeModal'],
    setup(_props) {
      const dialog = useDialog()
      // const evidenceData = ref()
      const tableRef = ref()
      const currentSchemas = ref()
      const evidenceSchemas = ref() // 证据表单
      const state = reactive({
        searchParam: {
          // proceduresId: '1',
          // relationType: '1',
          baseEvidenceTypeId: '',
          // causeId: '1000077',
          // causeRuleId: '11',
          // evidenceId: '1000001',
          page: 1,
          size: 10
        } as unknown as Partial<IEvidenceParams>,
        evidenceTypeList: [] as IGroupItemType[], // 所有证据类型
        evidenceInfo: {}, // 编辑证据详情
        currentTypeName: '',
        currentType: '1000000'
      })
      const actionColumn = ref({
        width: 180,
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        render(record) {
          return h(TableAction, {
            style: 'text',
            actions: createActions(record)
          })
        }
      })
      const createActions = (record) => {
        return [
          {
            type: 'info',
            label: '编辑',
            onClick: handleEdit.bind(null, record)
          },
          {
            type: 'error',
            label: '删除',
            onClick: handleDelete.bind(null, record)
          }
        ]
      }
      const handleEdit = async (info) => {
        // state.evidenceInfo = info
        state.evidenceInfo = await queryEvidenceDetail(info.id)
        openModal()
      }
      const reloadTable = () => {
        // 刷新表单数据
        tableRef.value.reload()
      }
      const resetInit = async (res) => {
        state.searchParam.baseEvidenceTypeId = state.currentType
        const data = await queryEvidenceData({ ...res, ...state.searchParam })
        // state.evidenceInfo = data.contents[0] ? data.contents[0] : {}
        // console.log(data, 'dataList.data')
        return data
      }
      const handleDelete = (info) => {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？(删除后可在回收站内找回)',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            await deleteEvidence(info.id)
            reloadTable()
          },
          onNegativeClick: () => {}
        })
      }
      // 证据保存之后的回调
      const evidenceSubmit = () => {
        closeModal()
        reloadTable()
      }

      const [evidenceModal, { openModal, closeModal }] = useModal({})

      const handleAdd = () => {
        state.evidenceInfo = {
          id: '', // 证据关联表ID
          evidenceId: '', // 证据ID
          proceduresId: null, // 程序ID 必传
          causeId: null, // 案由ID causeRuleId 传了则案由ID也 必传
          causeRuleId: '', // cause_evidence 证据规则 主键 / cause_discretion_detail_list 裁量规则主键 认定证据/裁量 ID
          relationType: '', // 关联类型 1.和程序关联 2.裁量规则 3.裁量类型证据
          name: '',
          proveMatter: '', // 证明事项
          baseEvidenceTypeId: state.currentType, // 证据类型基础表主键
          baseEvidenceTypeName: '', // 证据类型中文名
          partnerIds: '', // 执法员信息 -> 物证 输入
          partnerInfoOutputs: [
            // {
            //   id: '1000008',
            //   realName: '李四',
            //   enforceCode: '14'
            // },
            // {
            //   id: '1000032',
            //   realName: '张三',
            //   enforceCode: '69'
            // }
          ], // 执法员信息 输出
          pictureNumber: '', // 照片编号 -> 物证
          shootingTime: null, // 拍摄时间 -> 物证,视听资料
          shootingLocation: '', // 拍摄地点 -> 物证,视听资料
          shootingName: '', // 拍摄人 -> 物证
          recordContent: '', // 记录内容 -> 视听资料
          timeNode: null, // 时间节点 -> 视听资料 时间段&拼接
          fileInfoInputs: [], // 证据文件输入
          fileInfoOutputs: [], // 证据文件输出
          timeLineId: [] // 时间轴id
        }
        openModal()
      }
      const updateType = (item) => {
        state.currentTypeName = item.name
        state.currentType = item.id
        currentSchemas.value = evidenceSchemas.value.get(item.id)
        reloadTable()
      }

      // 证据类型
      const getEvidenceType = async () => {
        state.evidenceTypeList = await queryAllEvidenceType()
        evidenceSchemas.value = handleColumn(state.evidenceTypeList)
        if (state.evidenceTypeList && state.evidenceTypeList.length) {
          state.currentType = state.evidenceTypeList[0].id ? state.evidenceTypeList[0].id : ''
          state.currentTypeName = state.evidenceTypeList[0].name ? state.evidenceTypeList[0].name : ''
        }
        currentSchemas.value = evidenceSchemas.value.get(state.currentType)
        // state.evidenceTypeList = data.map((item) => {
        //   return {
        //     label: item.name,
        //     value: item.id
        //   }
        // })
      }

      onMounted(() => {
        getEvidenceType()
      })

      // watch(
      //   () => props.evidenceList,
      //   () => {
      //     evidenceData.value = props.evidenceList
      //   },
      //   { immediate: true }
      // )
      return {
        currentSchemas,
        tableRef,
        evidenceModal,
        columns,
        actionColumn,
        // evidenceData,
        ...toRefs(state),
        updateType,
        resetInit,
        handleAdd,
        evidenceSubmit
        // selectEnforcersModal,
        // closeSelectEnforcersModal,
        // handleAddSelect,
        // handleDelete,
        // handleSubmit,
        // onCancel
      }
    }
  })
</script>
