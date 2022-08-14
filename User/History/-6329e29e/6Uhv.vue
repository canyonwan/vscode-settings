<script setup lang="ts">
  import { queryAnnouncementDetail } from '@/api/infrom'
  import type { IAnnouncementDetail } from '@/api/infrom/types'
  import { format } from 'date-fns'
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
    <div class="text-lg font-medium">{{ detail?.title }}</div>
    <div class="text-xs py-2 text-gray-400">{{ detail?.sendUserName }} {{ format(row.createTime, 'yyyy-MM-dd') }}</div>
    <div class="text-xs py-4"><span class="text-gray-400">发至： </span>{{ detail?.receivingGroupTypeNames }}</div>
    <div class="text-lg py-4">{{ detail?.content }}</div>
    <div class="text-md py-4">附件：</div>
    <media-preview class="pl-8" :values="detail?.fileInfos" v-if="detail?.fileInfos" />
  </div>
</template>
