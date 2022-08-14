<script setup lang="ts">
  import { queryMessageDetail } from '@/api/infrom'
  import { useForm } from '@/components/form'
  import { messageSchemas } from './messageSchemas'

  const props = defineProps({
    newsId: {
      type: Number
    }
  })

  const [formRegister, { setFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 90,
    layout: 'horizontal',
    schemas: messageSchemas
  })

  function getDetail() {
    const res = queryMessageDetail(props.newsId!)
  }

  watch(
    () => props.newsId,
    () => {
      props.newsId && getDetail()
    }
  )
</script>
<template>
  <div class="message-detail">
    <basic-form @register="formRegister" />
  </div>
</template>
