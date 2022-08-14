<template>
  <basic-table :row-key="(row: IDiscretionMenuType) => row.id" :request="props.loadTableData || loadTableData" ref="tableRef" :columns="tableColumns" :action-column="{}" :scroll-x="1800">
    <template #toolbar>
      <n-button type="primary" @click="addMenu"> 新增裁量清单 </n-button>
    </template>
  </basic-table>
</template>

<script setup lang="ts">
  import { deleteDiscretionMenu, queryAllDiscretionMenu } from '@/api/cause-manage/discretion'
  import type { IDiscretionMenuType } from '@/api/cause-manage/types'
  import { tableColumns } from '@/views/cause-library/discretion/menu/columns'

  const props = defineProps({
    loadTableData: {
      type: Function as PropType<(...arg: any[]) => Promise<any>>,
      default: null
    }
  })

  const [modalRegister, { openModal, closeModal, setProps }] = useModal({
    displayDirective: 'if' //
  })

  const { currentComp, onSwitchComp } = useDynamicComp()

  const state = reactive({
    currentRowData: {} as IDiscretionMenuType,
    boundKeys: [] as string[],
    data: [] as IDiscretionMenuType[]
  })

  // 新增顶级
  const addMenu = () => {
    state.currentRowData.id = undefined
    state.currentRowData.parentId = '0'
    state.currentRowData.addSubItem = false
    setProps({ title: '新增裁量清单' })
    onSwitchComp(16)
    openModal()
  }
</script>
