<script setup lang="ts">
  import { queryAnnouncementDetail } from '@/api/infrom'
  import type { IAnnouncementDetail } from '@/api/infrom/types'

  const props = defineProps({
    announcementId: {
      type: String
    },
    queryType: {
      type: Number
    }
  })

  const detail = ref<IAnnouncementDetail>()

  async function getAnnouncementDetail() {
    const res = await queryAnnouncementDetail(props.announcementId!)
    detail.value = res
  }

  onMounted(() => {
    getAnnouncementDetail()
  })
</script>
<template>
  <div class="mx-10">
    <div class="text-center text-lg">{{ detail?.title }}</div>
    <!-- <div class="pl-10 text-center text-xs text-gray-500 py-2">来自: {{ detail?.sendUserName }}</div> -->
    <div class="text-md py-4">{{ detail?.receivingGroupTypeNames }}: </div>
    <div class="text-lg py-4 pl-8">{{ detail?.content }}</div>
    <div class="text-right text-md py-4 pl-8">{{ detail?.sendUserName }}</div>
    <div class="text-md py-4">附件: </div>
    <media-preview class="pl-8" :values="detail?.fileInfos" v-if="detail?.fileInfos" />
  </div>
</template>
