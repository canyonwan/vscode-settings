<script setup lang="ts">
  import { queryMessageDetail, sendMessage } from '@/api/infrom'
  import type { IMessageDetail, IMessageSend } from '@/api/infrom/types'
  // import { useForm } from '@/components/form'
  // import { messageSchemas } from './schemas'

  const props = defineProps({
    newsId: {
      type: String
    }
  })

  // const emit = defineEmits(['handleSubmit'])

  const messageDetail = ref<IMessageDetail>()

  // const [formRegister, { setFieldsValue }] = useForm({
  //   gridProps: { cols: 2 },
  //   labelWidth: 90,
  //   layout: 'horizontal',
  //   submitButtonText: '提交',
  //   schemas: messageSchemas
  // })

  async function getDetail() {
    const res = await queryMessageDetail(props.newsId!)
    messageDetail.value = res
    // setFieldsValue(res)
  }

  // async function onSubmit(values: IMessageSend) {
  //   await sendMessage(values)
  //   emit('handleSubmit')
  // }
  onMounted(() => {
    getDetail()
  })

  // watch(
  //   () => props.newsId,
  //   () => {
  //     props.newsId && getDetail()
  //   }
  // )
</script>
<template>
  <div class="mx-10">
    <!-- <basic-form @register="formRegister" @submit="onSubmit" /> -->
    <div class="text-lg">{{ messageDetail?.title }}</div>
    <div class="text-xs text-gray-500 py-4">{{ messageDetail?.sendUserName }}</div>
    <div class="text-sm">{{ messageDetail?.content }}</div>
    <media-preview :values="messageDetail?.fileInfos" v-show="messageDetail?.fileInfos" />
  </div>
</template>
