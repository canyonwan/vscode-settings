<script setup lang="ts">
  import { queryProgramList } from '@/api/program/program'
  import { useForm } from '@/components/form'
  import { useModal } from '@/components/modal'
  import { TableAction } from '@/components/table'
  import { punishSchemas } from './components/schemas'
  import { punishColumns } from './components/columns'
  import type { IPersonnelInfo } from '@/api/user/types'
  import type { IProgramItem } from '@/api/program/types'
  import { handleEnumsKeys } from '@/hooks/enums-keys'
  import { queryCauseTypes } from '@/api/cause-manage/cause-manage'
  import { ICauseType } from '@/api/law/types'

  const props = defineProps({
    programType: {
      type: Number,
      default: 1
    },
    useSelector: {
      type: Boolean,
      default: false
    }
  })

  const tableRef = ref()
  const causeTypeSources = ref<ICauseType[]>([])

  interface ISearchParams {
    procedureType: number
    programTypeId: string // 适用程序类型
    reconsideration: string // 复议
    isReconsideration: string // 是否复议
    litigation: string // 诉讼
    isLitigation: string // 是否诉讼
    userId: string[]
    hostOrganId: string[]
    type: number | null // 记录方式
    major: number | undefined // 是否重大案件
    stage: string | undefined // 阶段
    fileCaseStartTime: number | null // 立案开始日期
    fileCaseEndTime: number | null // 立案结束日期
    approval: string // 待我审批
    docCode: string // 文书号
    causeTypeId: string // 案件类型
  }

  interface IHasSelectedState {
    selectedPersoneel: IPersonnelInfo[]
    selectedOrgKeys: string[]
  }

  const hasSelectedState: IHasSelectedState = reactive({
    selectedPersoneel: [],
    selectedOrgKeys: []
  })

  let searchParams: ISearchParams = reactive({
    procedureType: props.programType,
    programTypeId: '',
    reconsideration: '',
    isReconsideration: '',
    approval: '',
    litigation: '',
    causeTypeId: '',
    docCode: '',
    isLitigation: '',
    userId: [],
    hostOrganId: [],
    type: null,
    stage: undefined,
    major: undefined,
    fileCaseStartTime: null,
    fileCaseEndTime: null
  })

  const currentModalContent = shallowRef()

  const actionColumn = ref({
    width: 100,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: IProgramItem) {
      return h(TableAction, {
        style: 'text',
        actions: createActions(record)
      })
    }
  })

  // 获取违法行为标类型
  async function getCauseTypes() {
    causeTypeSources.value = await queryCauseTypes()
  }

  getCauseTypes()

  const createActions = (record: IProgramItem) => {
    return [
      {
        label: '查看详情',
        onClick: viewDetail.bind(null, record)
      }
    ]
  }

  const router = useRouter()

  function viewDetail(row: IProgramItem) {
    router.push({
      name: 'ProgramDetail',
      query: {
        programId: row.id
      }
    })
  }

  const [register] = useForm({
    gridProps: { cols: 6 },
    inline: true,
    labelWidth: 100,
    layout: 'horizontal',
    schemas: punishSchemas
  })

  const [modalRegister, { openModal, closeModal, setProps }] = useModal({})

  const reloadTable = (param = {}) => {
    tableRef.value.reload(param)
  }

  // 查询
  function onSearch(values: ISearchParams) {
    searchParams = { ...values }

    // searchParams.type = values.type
    // searchParams.programTypeId = values.programTypeId
    // searchParams.reconsideration = values.reconsideration
    // searchParams.litigation = values.litigation
    reloadTable({ page: 1 })
  }

  const loadTableData = async (page: any) => {
    return await queryProgramList({ ...page, ...searchParams })
  }

  function chooseOrg() {
    setProps({ title: '选择执法机构' })
    currentModalContent.value = defineAsyncComponent(() => import('@/views/user/org-manage/components/org-select.vue'))
    openModal()
  }

  function chooseEnforceMembers() {
    setProps({ title: '选择执法人员' })
    currentModalContent.value = defineAsyncComponent(() => import('@/components/select-user/select-user.vue'))
    openModal()
  }

  // 选择执法人员回调
  function onUpdateSelectedEnforceMember(values: IPersonnelInfo[]) {
    hasSelectedState.selectedPersoneel = values
    searchParams.userId = values.map((item) => item.id!)
  }

  // 选择执法机构回调
  function onSelectOrgHandler(keys: string[]) {
    hasSelectedState.selectedOrgKeys = keys
    searchParams.hostOrganId = keys
  }

  const emit = defineEmits(['selectedRowHandler'])

  function updateCheckRowKeys(_: string[], rows: IProgramItem[]) {
    emit('selectedRowHandler', rows[0])
  }

  watch(
    () => props.useSelector,
    () => {
      if (props.useSelector) {
        if (punishColumns[0].type !== 'selection') {
          punishColumns.unshift({
            type: 'selection',
            multiple: false
          })
        }
      } else {
        if (punishColumns[0].type === 'selection') {
          punishColumns.shift()
        }
      }
    },
    { immediate: true }
  )
</script>
<template>
  <div class="punish">
    <basic-form @register="register" @submit="onSearch" submit-button-text="查询">
      <template #orgSlot>
        <n-button @click="chooseOrg">选择执法机构</n-button>
      </template>
      <template #enforceMemberSlot> <n-button @click="chooseEnforceMembers">选择执法人员</n-button> </template>
    </basic-form>

    <basic-table
      :row-key="(row: IProgramItem) => row.id"
      :request="loadTableData"
      ref="tableRef"
      :columns="punishColumns"
      :action-column="useSelector ? null : actionColumn"
      @update:checked-row-keys="updateCheckRowKeys"
      scroll-x="2200"
    />

    <basic-modal @register="modalRegister" style="width: 70%">
      <component
        :is="currentModalContent"
        @update:usersData="onUpdateSelectedEnforceMember"
        :usersData="hasSelectedState.selectedPersoneel"
        @onCheck="onSelectOrgHandler"
        :bindKeys="hasSelectedState.selectedOrgKeys"
        @closeModal="() => closeModal()"
      />
    </basic-modal>
  </div>
</template>
