<script setup lang="ts">
  import { TableAction } from '@/components/table'
  import { inspectColumns } from './components/columns'
  import { inspectSchemas } from './components/schemas'
  import BasicForm from '@/components/form/src/basic-form.vue'
  import { useForm } from '@/components/form'
  import { queryProgramList } from '@/api/program/program'
  import type { IProgramItem } from '@/api/program/types'
  import { useModal } from '@/components/modal'
  import { ITargetInfo } from '@/api/target/types'
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
    labelWidth: 90,
    layout: 'horizontal',
    showAdvancedButton: false,
    schemas: inspectSchemas,
    buttonPosition: 'end'
  })

  const [modalRegister, { openModal, setProps, closeModal }] = useModal({})

  const tableRef = ref()

  interface ISearchParams {
    procedureType: number
    targetId: string[]
    userId: string[]
    type: number | null
  }

  interface IHasSelected {
    selectedTargets: ITargetInfo[]
    selectedPersonnels: IPersonnelInfo[]
  }

  const hasSelectedState = reactive<IHasSelected>({
    selectedTargets: [],
    selectedPersonnels: []
  })

  const searchParams = reactive<ISearchParams>({
    procedureType: props.programType,
    targetId: [], // 检查对象ids
    userId: [], // 执法人员ids
    type: null // 1:线上2:上传 查询全部传null或者不传
  })

  const reloadTable = (param = {}) => {
    tableRef.value.reload(param)
  }

  // 查询
  function onSearch(values: ISearchParams) {
    searchParams.type = values.type
    reloadTable({ page: 1 })
  }

  const loadTableData = async (page: any) => {
    return await queryProgramList({ ...page, ...searchParams })
  }

  function chooseTarget() {
    setProps({ title: '选择检查对象' })
    currentModalContent.value = defineAsyncComponent(() => import('@/views/target/target-manage/index.vue'))
    openModal()
  }

  function chooseEnforceMembers() {
    setProps({ title: '选择执法人员' })
    currentModalContent.value = defineAsyncComponent(() => import('@/components/select-user/select-user.vue'))
    openModal()
  }

  // 选择检查对象回调
  function onUpdateSelectedTargets(values: ITargetInfo[]) {
    hasSelectedState.selectedTargets = values
    searchParams.targetId = values.map((item) => item.id!)
    closeModal()
  }

  // 选择执法人员回调
  function onUpdateSelectedEnforceMember(values: IPersonnelInfo[]) {
    hasSelectedState.selectedPersonnels = values
    searchParams.userId = values.map((item) => item.id!)
    closeModal()
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
        // state.checkedRowKeys = props.boundKeys
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
  <div class="inspect">
    <basic-form @register="register" @submit="onSearch" submit-button-text="查询">
      <template #targetSlot>
        <n-button @click="chooseTarget">选择检查对象</n-button>
      </template>
      <template #enforceMemberSlot> <n-button @click="chooseEnforceMembers">选择执法人员</n-button> </template>
    </basic-form>
    <basic-table
      :row-key="(row: IProgramItem) => row.id"
      @update:checked-row-keys="updateCheckRowKeys"
      :request="loadTableData"
      ref="tableRef"
      :columns="inspectColumns"
      :action-column="useSelector ? null : actionColumn"
      scroll-x="1090"
    />
    <basic-modal @register="modalRegister" style="width: 70%">
      <component
        :is="currentModalContent"
        isSelection
        isMultiple
        @update:selectTargets="onUpdateSelectedTargets"
        :select-targets="hasSelectedState.selectedTargets"
        @update:usersData="onUpdateSelectedEnforceMember"
        @cancelModal="closeModal"
        @closeModal="closeModal"
        :usersData="hasSelectedState.selectedPersonnels"
      />
    </basic-modal>
  </div>
</template>
