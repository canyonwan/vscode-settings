<template>
  <div class="menu-table-list">
    <basic-table :row-key="(row: IDiscretionMenuType) => row.id" :request="props.loadTableData" v-bind="attrs" ref="tableRef" :columns="tableColumns" :action-column="{}" :scroll-x="1800">
      <template #toolbar><slot name="toolbar"></slot> </template>
    </basic-table>
    <basic-modal @register="modalRegister" style="width: 70%">
      <component :is="currentComp" :current-row-data="state.currentRowData" @submit-handler="submitHandler" @cancel-modal-handler="() => closeModal()" />
    </basic-modal>
  </div>
</template>

<script setup lang="ts">
  import type { IDiscretionMenuType } from '@/api/cause-manage/types'
  import { tableColumns } from '@/views/cause-library/discretion/menu/columns'
  import { useModal } from '@/components/modal'
  import useDynamicComp from '../../manage/options'

  const props = defineProps({
    loadTableData: {
      type: Function as PropType<(...arg: any[]) => Promise<any>>,
      default: null
    }
  })
  const attrs = useAttrs()

  const [modalRegister, { openModal, closeModal, setProps }] = useModal({
    displayDirective: 'if' //
  })

  const { currentComp, onSwitchComp } = useDynamicComp()

  const tableRef = ref()

  const state = reactive({
    currentRowData: {} as IDiscretionMenuType,
    boundKeys: [] as string[],
    data: [] as IDiscretionMenuType[]
  })

  // 提交回调
  const submitHandler = () => {
    closeModal()
    reloadTable()
  }

  const reloadTable = () => {
    tableRef.value.reload()
  }

  defineExpose({ reloadTable })
</script>
