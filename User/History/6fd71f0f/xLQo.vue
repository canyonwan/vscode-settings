<script setup lang="ts">
  import { useForm } from '@/components/form'

  const [register, { setFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 90,
    layout: 'horizontal',
    schemas: props.formSchemas,
    showCancelButton: true
  })
</script>
<template>
  <div class="name">
    <BasicForm @register="register" @submit="onSubmit" />
  </div>
</template>
