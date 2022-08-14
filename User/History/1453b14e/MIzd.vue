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

  const schemasData = ref<any[]>(schemas)
  const [register, { setFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 90,
    layout: 'horizontal',
    schemas: schemasData.value
  })

  async function onSubmit(values: IDictionaryType) {
    delete values.updateTime
    delete values.createTime
    !props.rowData?.id && delete values.status
    await saveDictionaries({ ...values })
    emit('onSubmit')
  }

  function init() {
    if (!props.rowData?.id) {
      if (schemasData.value[schemasData.value.length - 1].field === 'status') {
        schemasData.value.pop()
      }
    } else {
      if (schemasData.value[schemasData.value.length - 1].field !== 'status') {
        schemasData.value.push({
          defaultValue: 1,
          giProps: {},
          field: 'status',
          component: 'NSwitch',
          label: '是否启用',
          componentProps: {
            'checked-value': 1,
            'unchecked-value': 0
          }
        })
      }
      nextTick(() => {
        setFieldsValue(props.rowData)
      })
    }
  }

  watch(
    () => props.rowData?.id,
    () => {
      init()
    },
    {
      immediate: true
    }
  )
</script>
