<script setup lang="ts">
  import { useForm } from '@/components/form'
  import { schemas } from './schemas'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import { saveCustomEvidenceForConfiscate } from '@/api/program/program'
  import type { ISaveCustomEvidenceForConfiscateParams } from '@/api/program/types'

  const props = defineProps<{ causeId: string }>()
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

  async function onSubmit(values: ISaveCustomEvidenceForConfiscateParams) {
    await saveCustomEvidenceForConfiscate({ ...values, causeId: props.causeId })
    emit('')
  }
</script>
<template>
  <BasicForm @register="register" @submit="onSubmit" />
</template>
