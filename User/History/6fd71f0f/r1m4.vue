<script setup lang="ts">
  import { useForm } from '@/components/form'

  const [register] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 90,
    layout: 'horizontal',
    schemas: props.formSchemas,
    showCancelButton: true
  })

  function onSubmit(values) {
    //
  }
</script>
<template>
  <div class="name">
    <BasicForm @register="register" @submit="onSubmit" />
  </div>
</template>
