<script setup lang="ts">
  import { FileFilled } from '@vicons/antd'
  import type { IFileItem } from '@/api/program/types'
  import { FileTypeEnum } from '@/enums/file-enum'
  import { ViewFilled } from '@vicons/carbon'
  const props = defineProps({
    values: {
      type: Array as PropType<Array<IFileItem>>,
      default: () => []
    }
  })

  const showModal = ref<boolean>(false)
  const showAllFilesModal = ref<boolean>(false)
  const previewUrl = ref<string>('')

  // 预览
  function onPreview(url: string, fileType: number) {
    if (fileType === (FileTypeEnum.Picture || FileTypeEnum.Pdf || FileTypeEnum.Word || FileTypeEnum.Audio || FileTypeEnum.Video)) {
      showModal.value = true
      previewUrl.value = url
    } else {
      window.open(url)
    }
  }

  const fileData = computed(() => {
    if (props?.values.length > 1) {
      return props.values.slice(0, 3)
    } else {
      return props.values
    }
  })

  function viewAllFiles() {
    showAllFilesModal.value = true
  }
</script>
<template>
  <n-space>
    <div
      v-for="item in fileData"
      :key="item.fileId"
      class="rounded-md hover:ring-4 transition duration-500 ease-in-out border p-1 info mr-1 mb-1 cursor-pointer relative"
      @click="onPreview(item.fileUrl, item.fileType)"
    >
      <img class="w-20 h-20" v-if="item.thumbnailFileUrl" :src="item.thumbnailFileUrl || item.fileUrl" />
      <img class="w-20 h-20" v-else-if="!item.thumbnailFileUrl && item.fileType === FileTypeEnum.Picture" :src="item.fileUrl" />
      <div v-else class="w-20 h-20 truncate text-center" style="line-height: 5rem">
        <n-icon class="text-gray-600" :component="FileFilled" size="24" />
      </div>
      <div class="hover:bg-blue-purple-500">mark</div>
    </div>

    <n-space
      vertical
      justify="center"
      align="center"
      @click="viewAllFiles"
      v-if="fileData.length < props.values.length"
      class="leading-normal w-20 h-20 py-2 text-center rounded-md border mr-1 mb-1 cursor-pointer hover:bg-gray-900"
    >
      <n-icon :component="ViewFilled" :depth="5" />
      <p class="text-xs text-gray-500">查看更多</p>
    </n-space>
    <!--预览图片-->
    <n-modal v-model:show="showModal" preset="card" title="预览" :bordered="false" style="width: 50%">
      <div class="flex align-center justify-center">
        <img class="w-auto" :src="previewUrl" />
      </div>
    </n-modal>
    <n-modal v-model:show="showAllFilesModal" preset="card" title="查看全部" :bordered="false" style="width: 80%">
      <div class="flex flex-wrap align-center justify-center">
        <div v-for="item in props.values" :key="item.fileId" class="rounded-md border p-1 info mr-1 mb-1 cursor-pointer hover:bg-gray-900" @click="onPreview(item.fileUrl, item.fileType)">
          <img v-if="item.fileType === (FileTypeEnum.Picture || FileTypeEnum.Pdf || FileTypeEnum.Word || FileTypeEnum.Video)" :src="item.thumbnailFileUrl || item.fileUrl" class="w-20 h-20" />
          <div v-else class="w-20 h-20 truncate text-center" style="line-height: 5rem">
            <n-icon class="text-gray-600" :component="FileFilled" size="24" />
          </div>
        </div>
      </div>
    </n-modal>
  </n-space>
</template>
