<script setup lang="ts">
  import { queryMessageDetail } from '@/api/infrom'
  import type { IMessageDetail } from '@/api/infrom/types'
  // import { useForm } from '@/components/form'
  // import { messageSchemas } from './schemas'

  const props = defineProps({
    newsId: {
      type: String
    }
  })

  const messageDetail = ref<IMessageDetail>()

  async function getDetail() {
    const res = await queryMessageDetail(props.newsId!)
    messageDetail.value = res
  }

  onMounted(() => {
    getDetail()
  })
</script>
<template>
  <div class="mx-10">
    <div class="text-lg">{{ messageDetail?.title }}</div>
    <div class="text-xs text-gray-500 py-2">{{ messageDetail?.sendUserName }}</div>
    <div class="text-sm py-4">{{ messageDetail?.content }}</div>
    <media-preview :values="messageDetail?.fileInfos" v-show="messageDetail?.fileInfos" />
  </div>
</template>
