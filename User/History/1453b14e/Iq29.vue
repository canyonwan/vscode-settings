<template>
  <div class="add-dictionaries">
    <basic-form @register="register" @submit="onSubmit" submit-button-text="提交" />
  </div>
</template>

<script lang="ts" setup>
  import { useForm } from '@/components/form/index'
  import { schemas } from './form-options'
  import { saveDictionaries } from '@/api/setting/dictionaries'
  import type { IDictionaryType } from '@/api/setting/types'

  const emit = defineEmits(['onSubmit'])
  const props = defineProps({
    rowData: {
      type: Object as PropType<IDictionaryType>,
      default: () => {}
    }
  })

  const [register, { setFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 90,
    layout: 'horizontal',
    schemas
  })

  async function onSubmit(values: IDictionaryType) {
    console.log('%c [ submit values ]-29', 'font-size:13px; background:#0095FF; color:white;', values)
    await saveDictionaries({ ...values })
    emit('onSubmit')
  }

  watchEffect(() => {
    if (props.rowData.id) {
      setFieldsValue(props.rowData)
    }
  })
</script>
