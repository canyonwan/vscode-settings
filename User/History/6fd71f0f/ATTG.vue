<script setup lang="ts">
  import { useForm } from '@/components/form'
  import { schemas } from './schemas'

  const [register] = useForm({
    gridProps: { cols: 2 },
    labelWidth: 90,
    layout: 'horizontal',
    schemas: schemas,
    showCancelButton: true
  })

  function onSubmit(values) {
    //
  }
</script>
<template>
  <BasicForm @register="register" @submit="onSubmit" />
</template>
