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
  <div class="message-detail">
    <!-- <basic-form @register="formRegister" @submit="onSubmit" /> -->
    <n-list>
      <template #header> {{ messageDetail?.title }} </template>
      <template #footer> footer </template>
      <n-list-item>
        <template #prefix>
          <n-button>Prefix</n-button>
        </template>
        <template #suffix>
          <n-button>Suffix</n-button>
        </template>
        <n-thing title="Thing" title-extra="extra" description="description"> Biu </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Thing" title-extra="extra" description="description" />
      </n-list-item>
    </n-list>
  </div>
</template>
