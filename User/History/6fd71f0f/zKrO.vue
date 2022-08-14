<script setup lang="ts">
  import { useForm } from '@/components/form'
  import { schemas } from './schemas'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import { saveCustomEvidenceForConfiscate } from '@/api/program/program'

  const props = defineProps<{ causeId: string }>()

  const schemasRef = ref(schemas)
  schemaDataHandle(schemasRef.value)

  const [register] = useForm({
    gridProps: { cols: 2 },
    labelWidth: 90,
    layout: 'horizontal',
    schemas: schemasRef.value,
    submitButtonText: '提交'
  })

  async function onSubmit(values) {
    await saveCustomEvidenceForConfiscate({ ...values, causeId: props.causeId })
  }
</script>
<template>
  <BasicForm @register="register" @submit="onSubmit" />
</template>
