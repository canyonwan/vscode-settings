<script setup lang="ts">
  import { queryMessageDetail, sendMessage } from '@/api/infrom'
  import type { IMessageDetail } from '@/api/infrom/types'
  import { useForm } from '@/components/form'
  import { messageSchemas } from './schemas'

  const props = defineProps({
    newsId: {
      type: Number
    }
  })

  const emit = defineEmits(['handleSubmit'])

  // const MessageDetail = ref<IMessageDetail>()

  const [formRegister, { setFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 90,
    layout: 'horizontal',
    schemas: messageSchemas
  })

  async function getDetail() {
    const res = await queryMessageDetail(props.newsId!)
    setFieldsValue(res)
  }

  async function onSubmit(values: IMessageDetail) {
    await sendMessage(values)
    emit('handleSubmit')
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
    <basic-form @register="formRegister" @submit="onSubmit" />
  </div>
</template>
