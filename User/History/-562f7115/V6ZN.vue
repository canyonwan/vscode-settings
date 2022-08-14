<script setup lang="ts">
  import { usePermission } from '@/hooks/web/use-permission'
  import { deleteCauseType, queryCauseTypes } from '@/api/cause-manage/cause-manage'
  import type { ICauseType } from '@/api/law/types'
  import { TreeOption, NButton, useDialog } from 'naive-ui'
  import { useModal } from '@/components/modal'
  import SaveCauseType from '@/views/law/components/components/save-cause-type.vue'

  const props = withDefaults(defineProps<{ useCheck?: boolean; checkedKeys?: string[] }>(), {
    useCheck: false,
    checkedKeys: () => []
  })

  // 动态权限
  const { buttonDisabledPermission } = usePermission()

  const dialog = useDialog()
  const [register, { openModal, closeModal, setProps }] = useModal({})

  const dataSources = ref<ICauseType[]>([])
  const checkedKeys = ref<string[]>([])

  const cause = ref<ICauseType>({
    id: '',
    name: ''
  })

  // 获取违法行为标类型
  async function getCauseTypes() {
    dataSources.value = await queryCauseTypes()
  }

  // 获取违法行为标类型
  function onAdd() {
    cause.value = { id: '', name: '' }
    setProps({ title: '新增违法行为类型' })
    openModal()
  }

  function onEdit(params: ICauseType) {
    cause.value = params
    setProps({ title: '编辑违法行为类型' })
    openModal()
  }

  async function submitHandler() {
    closeModal()
    await getCauseTypes()
  }

  async function onDelete(id: string) {
    dialog.error({
      title: '提示',
      content: '你确定要删除吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteCauseType(id)
        getCauseTypes()
      }
    })
  }

  function renderSuffix({ option }: { option: TreeOption | ICauseType }) {
    return [
      h(NButton, { text: true, type: 'success', class: 'mr-2', onClick: () => onEdit(option as ICauseType) }, { default: () => '编辑' }),
      h(NButton, { text: true, type: 'error', onClick: () => onDelete(option.id as string) }, { default: () => '删除' })
    ]
  }

  const emit = defineEmits(['checkedKeysHandler'])

  function onUpdateChecked() {
    emit('checkedKeysHandler', checkedKeys.value)
  }

  watch(
    () => props.useCheck,
    () => {
      if (props.useCheck) {
        checkedKeys.value = props.checkedKeys
        console.log('%c [ checkedKeys.value ]-82', 'font-size:13px; background:#0095FF; color:white;', checkedKeys.value)
      }
    },
    {
      immediate: true
    }
  )

  getCauseTypes()
</script>
<template>
  <div class="cause-type">
    <n-button class="float-right mb-4" v-if="!useCheck" @click="onAdd" type="success" :disabled="buttonDisabledPermission(['b08_01_01'])"> 新增 </n-button>

    <n-tree
      block-line
      key-field="id"
      label-field="name"
      :data="dataSources"
      :render-suffix="useCheck ? () => [] : renderSuffix"
      :checkable="useCheck"
      virtual-scroll
      style="height: 420px"
      v-model:checked-keys="checkedKeys"
    />
    <n-button class="float-right" v-if="useCheck" type="primary" @click="onUpdateChecked">确定</n-button>

    <BasicModal @register="register">
      <save-cause-type :target="cause" @submit-handler="submitHandler" />
    </BasicModal>
  </div>
</template>
