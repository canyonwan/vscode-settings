<script setup lang="ts">
  import { saveCustomDiscretion } from '@/api/program/program'
  import { ICustomDiscretionFormalParameter } from '@/api/program/types'
  import { useForm } from '@/components/form'
  import { customSchemas } from './custom-schemas'

  const props = defineProps({
    programCauseId: {
      type: String as PropType<string>,
      default: ''
    }
  })

  const emits = defineEmits(['handleSubmit'])

  const [register] = useForm({
    gridProps: {
      cols: 2
    },
    labelWidth: 80,
    submitButtonText: '保存',
    showAdvancedButton: false,
    schemas: customSchemas
  })

  async function onSubmit(values: ICustomDiscretionFormalParameter) {
    //
    let params = {
      proceduresCauseId: props.programCauseId,
      ...values
    }
    await saveCustomDiscretion(values)
    emits('handleSubmit', values)
  }
</script>
<template>
  <div class="custom-discretion">
    <basic-form @register="register" @submit="onSubmit" />
  </div>
</template>
