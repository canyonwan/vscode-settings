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
    if (props.rowData.id) {
      values.id = props.rowData.id
      await fetchStatusChanged(values.id, values.status!)
    } else {
      delete values.status
    }
    console.log('%c [ submit values ]-29', 'font-size:13px; background:#0095FF; color:white;', values)
    await saveDictionaries({ ...values })
    emit('onSubmit')
  }

  watch(
    () => props.rowData?.id,
    () => {
      console.log('%c [ props.rowData?.id ]-45', 'font-size:13px; background:#0095FF; color:white;', props.rowData?.id)
      if (!props.rowData?.id) {
        if (schemasData.value[schemasData.value.length - 1].field === 'status') {
          schemasData.value.pop()
        }
      } else {
        if (schemasData.value[schemasData.value.length - 1].field !== 'status') {
          schemasData.value.push({
            defaultValue: true,
            giProps: {},
            field: 'status',
            component: 'NSwitch',
            label: '是否启用'
          })
        }
        nextTick(() => {
          setFieldsValue(props.rowData)
        })
      }
    },
    {
      immediate: true
    }
  )
</script>
