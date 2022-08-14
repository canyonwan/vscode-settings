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
    console.log('%c [ values ]-14', 'font-size:13px; background:#0095FF; color:white;', values)
  }
</script>
<template>
  哈哈
  <!-- <BasicForm @register="register" @submit="onSubmit" /> -->
</template>
