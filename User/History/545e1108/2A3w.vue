<script setup lang="ts">
  import { queryProgramList } from '@/api/program/program'
  import type { IProgramItem } from '@/api/program/types'
  import { useForm } from '@/components/form'
  import { useModal } from '@/components/modal'
  import { TableAction } from '@/components/table'
  import { handOverSchemas } from './components/schemas'
  import { handOverColumns } from './components/columns'
  import { IPersonnelInfo } from '@/api/user/types'

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

  interface ISearchParams {
    procedureType: number
    userId: string[]
    orgId: string[]
  }

  interface IHasSelectedState {
    selectedPersoneel: IPersonnelInfo[]
    selectedOrgKeys: string[]
  }

  const hasSelectedState = reactive<IHasSelectedState>({
    selectedPersoneel: [],
    selectedOrgKeys: []
  })

  const searchParams = reactive<ISearchParams>({
    procedureType: props.programType,
    userId: [],
    orgId: []
  })
  const currentModalContent = shallowRef()

  const actionColumn = ref({
    width: 100,
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
    labelWidth: 80,
    layout: 'horizontal',
    schemas: handOverSchemas
  })

  const [modalRegister, { openModal, closeModal, setProps }] = useModal({})

  const reloadTable = (param = {}) => {
    tableRef.value.reload(param)
  }

  // 查询
  function onSearch() {
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

  // 选择执法机构回调
  function onSelectOrgHandler(keys: string[]) {
    hasSelectedState.selectedOrgKeys = keys
    searchParams.orgId = keys
  }

  // 选择执法人员回调
  function onUpdateSelectedEnforceMember(values: IPersonnelInfo[]) {
    hasSelectedState.selectedPersoneel = values
    searchParams.userId = values.map((item) => item.id!)
  }

  const emit = defineEmits(['selectedRowHandler'])

  function updateCheckRowKeys(_: string[], rows: IProgramItem[]) {
    emit('selectedRowHandler', rows[0])
  }

  watch(
    () => props.useSelector,
    () => {
      if (props.useSelector) {
        if (inspectColumns[0].type !== 'selection') {
          inspectColumns.unshift({
            type: 'selection',
            multiple: false
          })
        }
      } else {
        if (inspectColumns[0].type === 'selection') {
          inspectColumns.shift()
        }
      }
    },
    { immediate: true }
  )
</script>
<template>
  <div class="hand-over">
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
      :columns="handOverColumns"
      @update:checked-row-keys="updateCheckRowKeys"
      :action-column="useSelector ? null : actionColumn"
      scroll-x="1090"
    />
    <basic-modal @register="modalRegister" style="width: 70%">
      <component
        :is="currentModalContent"
        @onCheck="onSelectOrgHandler"
        @closeModal="() => closeModal()"
        @update:usersData="onUpdateSelectedEnforceMember"
        :usersData="hasSelectedState.selectedPersoneel"
        :bindKeys="hasSelectedState.selectedOrgKeys"
      />
    </basic-modal>
  </div>
</template>
