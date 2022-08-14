<template>
  <div class="add-dictionaries">
    <basic-form @register="register" @submit="onSubmit" submit-button-text="提交" />
  </div>
</template>

<script lang="ts" setup>
  import { useForm } from '@/components/form/index'
  import { schemas } from './form-options'
  import { changeDictionaryStatus, saveDictionaries } from '@/api/setting/dictionaries'
  import type { IDictionaryType } from '@/api/setting/types'

  const emit = defineEmits(['onSubmit'])
  const props = defineProps({
    rowData: {
      type: Object as PropType<IDictionaryType>,
      default: () => {}
    }
  })

  const schemasData = ref<any[]>(schemas)
  const [register, { setFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 90,
    layout: 'horizontal',
    schemas: schemasData.value
  })

  // 状态修改
  async function fetchStatusChanged(id: string, status: boolean) {
    await changeDictionaryStatus({ id: id, status: status ? 0 : 1 })
  }

  async function onSubmit(values: IDictionaryType) {
    delete values.updateTime
    delete values.createTime
    delete values.status
    console.log('%c [ submit values ]-29', 'font-size:13px; background:#0095FF; color:white;', values)
    await saveDictionaries({ ...values })
    emit('onSubmit')
  }

  watch(
    () => props.rowData?.id,
    () => {
      if (!props.rowData?.id) {
        schemasData.value.pop()
      }
    },
    {
      immediate: true
    }
  )

  watchEffect(() => {
    if (props.rowData?.id) {
      nextTick(() => {
        setFieldsValue(props.rowData)
      })
    }
  })
</script>
