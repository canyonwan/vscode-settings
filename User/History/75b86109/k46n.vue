<template>
  <div class="collect-evidence">
    <div class="mb-2" style="overflow-x: auto">
      <div v-if="evidenceTypeList && evidenceTypeList.length" class="w-full flex mb-2 border-b-2 border-opacity-10">
        <template v-for="item in evidenceTypeList" :key="item.id">
          <div
            class="cursor-pointer flex-none flex justify-center p-2"
            style="font-size: 36px"
            :class="{ 'border-b-2 font-semibold': currentType === item.id }"
            :style="{ borderColor: currentType === item.id ? '#6ec7ff' : '', color: currentType === item.id ? '#6ec7ff' : '' }"
            @click="updateType(item)"
          >
            <div>{{ item.name }}</div>
          </div>
        </template>
      </div>
    </div>
    <basic-table
      :columns="columns"
      :action-column="!isSelect ? actionColumn : {}"
      :request="resetInit"
      ref="tableRef"
      :row-key="(row: any) => row.id"
      :pagination="false"
      :min-height="'calc(100vh - ' + 350 + 'px)'"
    >
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
  <div class="flex justify-end items-end mt-2" v-if="isSelect">
    <n-button class="ml-2" @click="onCancel">取消</n-button>
    <n-button class="ml-2" @click="submitBindEvidenceFile" type="primary">提交</n-button>
  </div>
  <basic-modal @register="evidenceModal" style="width: 70%" :title="`新增${currentTypeName}`" @on-ok="evidenceSubmit">
    <evidence-save :key="currentType" :evidenceType="currentType" :schemas="currentSchemas" :evidenceInfo="evidenceInfo" ref="evidenceAddRef" />
  </basic-modal>
</template>

<script lang="ts">
  import { queryAllEvidenceType } from '@/api/cause-manage/evidence'
  import { IGroupItemType } from '@/api/cause-manage/types'
  import { TableAction } from '@/components/table'
  import { handleColumn } from './components/columns'
  import EvidenceSave from './components/evidence-save.vue'
  import { AddOutline } from '@vicons/ionicons5'
  import { bindingEvidenceFile, deleteEvidence, queryEvidenceData, queryEvidenceDetail } from '@/api/evidence/evidence'
  import { useModal } from '@/components/modal'
  import { IBindEvidenceFile, IEvidenceParams } from '@/api/evidence/types'
  import { handleSchema } from './components/options'
  import { useDialog } from 'naive-ui'
  import { removePushArray, timeStamp } from '@/utils'
  import { IEvidenceConnect } from './components/type'

  export default defineComponent({
    name: 'Evidence',
    components: { AddOutline, EvidenceSave },
    props: {
      // 案件关联的四个id, 程序id，时间轴id,工具id,工具组id,
      // baseEvidenceTypeId证据类型id。等证据新增需要的id. 程序ID 1 关联类型 1 时间轴id timeLineId
      caseInfo: {
        type: Object as PropType<IEvidenceConnect>,
        default: () => {
          return {}
        }
      },
      isSelect: {
        type: Boolean,
        default: false
      }
    },
    emits: ['onSubmit', 'onCancel'],
    setup(props, context) {
      const dialog = useDialog()
      const evidenceAddRef = ref()
      const tableRef = ref()
      const currentSchemas = ref()
      const evidenceSchemas = ref() // 证据表单
      const evidenceColumns = ref() // 证据table栏目
      const state = reactive({
        columns: [] as any,
        searchParam: {
          proceduresId: '',
          baseEvidenceTypeId: ''
          // name: '',
          // page: 1,
          // size: 10
        } as unknown as Partial<IEvidenceParams>,
        evidenceTypeList: [] as IGroupItemType[], // 所有证据类型
        evidenceInfo: {} as any, // 编辑证据详情
        selectFileIds: [] as string[], // 证据文件绑定（文件-证据关系表ID集合）
        currentTypeName: '',
        currentType: ''
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
        state.evidenceInfo = await queryEvidenceDetail(info.id)
        state.evidenceInfo.proceduresId = props.caseInfo.proceduresId
        state.evidenceInfo.relationType = props.caseInfo.relationType
        // 时间格式处理
        state.evidenceInfo.shootingTime = state.evidenceInfo.shootingTime ? timeStamp(state.evidenceInfo.shootingTime) : null
        if (state.evidenceInfo.timeNode) {
          const timeNode = state.evidenceInfo.timeNode.split('至')
          // 视听材料 时间节点
          state.evidenceInfo.timeNodeStart = timeStamp(timeNode[0])
          state.evidenceInfo.timeNodeEnd = timeStamp(timeNode[1])
        } else {
          state.evidenceInfo.timeNode = [null, null]
        }
        openModal()
      }
      const reloadTable = () => {
        // 刷新表单数据
        tableRef.value.reload()
      }
      const resetInit = async () => {
        state.searchParam.baseEvidenceTypeId = state.currentType
        state.searchParam.proceduresId = props.caseInfo.proceduresId
        const data = await queryEvidenceData({ ...state.searchParam })
        return data
      }
      const handleDelete = (info) => {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？(删除后可在回收站内找回)',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            deleteEvidence(info.id).then(() => {
              reloadTable()
            })
          },
          onNegativeClick: () => {}
        })
      }

      const [evidenceModal, { openModal, closeModal, setSubLoading }] = useModal({
        showActionButtonGroup: true // 显示操作
      })

      const handleAdd = () => {
        state.evidenceInfo = {
          id: '', // 证据关联表ID
          evidenceId: '', // 证据ID
          proceduresId: props.caseInfo.proceduresId, // 程序ID 必传
          causeId: null, // 案由ID causeRuleId 传了则案由ID也 必传
          causeRuleId: '', // cause_evidence 证据规则 主键 / cause_discretion_detail_list 裁量规则主键 认定证据/裁量 ID
          relationType: '1', // 关联类型 1.和程序关联 2.裁量规则 3.裁量类型证据
          name: '',
          proveMatter: '', // 证明事项
          baseEvidenceTypeId: state.currentType, // 证据类型基础表主键
          baseEvidenceTypeName: '', // 证据类型中文名
          partnerIds: [], // 执法员信息 -> 物证 输入
          partnerInfoOutputs: [], // 执法员信息 输出
          pictureNumber: '', // 照片编号 -> 物证
          shootingTime: null, // 拍摄时间 -> 物证,视听资料
          shootingLocation: '', // 拍摄地点 -> 物证,视听资料
          shootingName: '', // 拍摄人 -> 物证
          recordContent: '', // 记录内容 -> 视听资料
          timeNode: [null, null], // 时间节点 -> 视听资料 时间段&拼接
          timeNodeStart: null,
          timeNodeEnd: null,
          fileInfoInputs: [], // 证据文件输入
          fileInfoOutputs: [], // 证据文件输出
          timeLineId: props.caseInfo.timeLineId // 时间轴id
        }
        openModal()
      }
      const updateType = (item) => {
        state.currentTypeName = item.name
        state.currentType = item.id
        currentSchemas.value = evidenceSchemas.value.get(item.id)
        const columnsAction = evidenceColumns.value.get(item.id)
        state.columns = columnsAction({ selectFile, isSelect: props.isSelect })
        reloadTable()
      }

      const selectFile = (ids) => {
        if (state.selectFileIds.length) {
          removePushArray(state.selectFileIds, ids)
        } else {
          state.selectFileIds = ids
        }
      }

      // 证据类型
      const getEvidenceType = async () => {
        state.evidenceTypeList = await queryAllEvidenceType()

        evidenceColumns.value = handleColumn(state.evidenceTypeList)

        const columnsAction = evidenceColumns.value.get(state.currentType)
        state.columns = columnsAction({ selectFile, isSelect: props.isSelect })

        evidenceSchemas.value = handleSchema(state.evidenceTypeList)
        currentSchemas.value = evidenceSchemas.value.get(state.currentType)
      }

      // 窗体表单保存
      const evidenceSubmit = async () => {
        const formRes = await evidenceAddRef.value.handleSubmit()
        if (formRes) {
          closeModal()
          reloadTable()
        } else {
          setSubLoading(false)
        }
      }

      onMounted(() => {
        getEvidenceType()
      })

      // 绑定证据文件
      const submitBindEvidenceFile = () => {
        const params = {
          proceduresId: props.caseInfo.proceduresId,
          timeLineId: props.caseInfo.timeLineId,
          causeId: props.caseInfo.causeId,
          causeRuleId: props.caseInfo.causeRuleId,
          causeDiscretionId: props.caseInfo.causeDiscretionId,
          relationType: props.caseInfo.relationType,
          evidenceFileRelationIds: state.selectFileIds // 文件-证据关系表ID
        } as unknown as IBindEvidenceFile
        bindingEvidenceFile(params).then(() => {
          context.emit('onSubmit')
        })
      }
      const onCancel = () => {
        context.emit('onCancel')
      }

      watch(
        () => props.caseInfo,
        () => {
          if (props.caseInfo.typeId) {
            if (state.currentType) {
              nextTick(() => {
                updateType({ name: props.caseInfo.typeIdName, id: props.caseInfo.typeId })
              })
            } else {
              state.currentTypeName = props.caseInfo.typeIdName
              state.currentType = props.caseInfo.typeId
            }
          } else {
            state.currentType = '1000000'
            state.currentTypeName = '书证'
          }
        },
        { immediate: true }
      )

      return {
        currentSchemas,
        tableRef,
        evidenceAddRef,
        evidenceModal,
        actionColumn,
        ...toRefs(state),
        updateType,
        resetInit,
        handleAdd,
        evidenceSubmit,
        submitBindEvidenceFile,
        onCancel
      }
    }
  })
</script>
<!-- <style lang="less" scoped>
  .evidence {
    *::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
  }
</style> -->
