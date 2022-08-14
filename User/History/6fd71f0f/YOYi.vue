<script setup lang="ts">
  import { useForm } from '@/components/form'
  import { schemas } from './schemas'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'

  const schemasRef = ref(schemas)
  schemaDataHandle(schemasRef.value)

  const [register] = useForm({
    gridProps: { cols: 2 },
    labelWidth: 90,
    layout: 'horizontal',
    schemas: schemasRef.value,
    submitButtonText: '提交'
  })

  function onSubmit(values) {
    console.log('%c [ values ]-14', 'font-size:13px; background:#0095FF; color:white;', values)
  }
</script>
<template>
  <BasicForm @register="register" @submit="onSubmit" />
</template>
