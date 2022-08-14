<template>
  <div>
    <BasicForm @register="register" />
  </div>
</template>

<script setup lang="ts">
  import { useForm } from '@/components/form'
  import { bannerSchemas } from '../schemas'

  const [register] = useForm({
    gridProps: { cols: 4 },
    inline: true,
    labelWidth: 90,
    layout: 'horizontal',
    showResetButton: false,
    schemas: bannerSchemas
  })
</script>
