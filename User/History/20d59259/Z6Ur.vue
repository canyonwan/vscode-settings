<script setup lang="ts">
  import { useForm } from '@/components/form'
  import { customSchemas } from './custom-schemas'

  const props = defineProps({
    programCauseId: {
      type: String as PropType<string>,
      default: ''
    }
  })

  const [register] = useForm({
    gridProps: {
      cols: 2
    },
    labelWidth: 80,
    submitButtonText: '保存',
    showAdvancedButton: false,
    schemas: customSchemas
  })
</script>
<template>
  <div class="custom-discretion">
    <basic-form @register="register" @submit="onSubmit" />
  </div>
</template>
