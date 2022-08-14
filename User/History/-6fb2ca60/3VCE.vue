<script setup lang="ts">
  import { queryMessageDetail, sendMessage } from '@/api/infrom'
  import type { IMessageSend } from '@/api/infrom/types'
  import { useForm } from '@/components/form'
  import { messageSchemas } from './schemas'

  const props = defineProps({
    newsId: {
      type: String
    }
  })

  const emit = defineEmits(['handleSubmit'])

  // const MessageDetail = ref<IMessageDetail>()

  const [formRegister, { setFieldsValue }] = useForm({
    gridProps: { cols: 2 },
    labelWidth: 90,
    layout: 'horizontal',
    submitButtonText: '提交',
    schemas: messageSchemas
  })

  async function getDetail() {
    const res = await queryMessageDetail(props.newsId!)
    setFieldsValue(res)
  }

  async function onSubmit(values: IMessageSend) {
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
