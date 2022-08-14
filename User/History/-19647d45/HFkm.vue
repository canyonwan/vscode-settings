<script setup lang="ts">
  import { queryProgramList } from '@/api/program/program'
  import type { IProgramItem } from '@/api/program/types'
  import { useForm } from '@/components/form'
  import { useModal } from '@/components/modal'
  import { TableAction } from '@/components/table'
  import { forceSchemas } from './schemas'
  import { forceColumns } from './columns'

  const props = defineProps({
    programType: {
      type: Number,
      default: 1
    }
  })

  const tableRef = ref()
  const searchParams = ref({
    procedureType: props.programType
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

  const [register] = useForm({
    gridProps: { cols: 5 },
    inline: true,
    labelWidth: 90,
    layout: 'horizontal',
    schemas: forceSchemas
  })

  const [modalRegister, { openModal, setProps }] = useModal({})

  const router = useRouter()

  function viewDetail(row: IProgramItem) {
    router.push({
      name: 'CaseDetail',
      params: {
        programId: row.id
      }
    })
  }

  const reloadTable = () => {
    tableRef.value.reload()
  }

  // 查询
  function onSearch() {
    reloadTable()
  }

  const loadTableData = async (page: any) => {
    return await queryProgramList({ ...page, ...searchParams.value })
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
</script>
<template>
  <div class="force">
    <basic-form @register="register" @submit="onSearch" submit-button-text="查询">
      <template #targetSlot>
        <n-button @click="chooseTarget">选择检查对象</n-button>
      </template>
      <template #enforceMemberSlot> <n-button @click="chooseEnforceMembers">选择执法人员</n-button> </template>
    </basic-form>
    <basic-table :row-key="(row: IProgramItem) => row.id" :request="loadTableData" ref="tableRef" :columns="forceColumns" :action-column="actionColumn" scroll-x="1090" :single-line="false" />
    <basic-modal @register="modalRegister" style="width: 70%">
      <component :is="currentModalContent" />
    </basic-modal>
  </div>
</template>
