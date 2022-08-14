<script setup lang="ts">
  import type { ISaveTimelineNodeParams } from '@/api/program/types'

  const props = defineProps<{ timelineNode: ISaveTimelineNodeParams }>({
    timelineNode: {
      type: Object as PropType<ISaveTimelineNodeParams>,
      default: () => {}
    }
  })

  const state = reactive<ISaveTimelineNodeParams>({
    timeLineId: '',
    nodeName: '',
    nodeType: '',
    childNodeName: '',
    procedureId: '',
    fileId: '',
    description: ''
  })

  function handleSubmit() {}
</script>
<template>
  <div class="save-timeline-node">
    <n-form label-placement="left" label-width="100px" :style="{ width: '80%' }">
      <!-- 节点名称 1: 同级-->
      <n-form-item label="节点名称" v-if="state.nodeType === 1">
        <n-input v-model:value="state.nodeName" placeholder="请输入节点名称" />
      </n-form-item>
      <!-- 节点名称 0: 同级-->
      <n-form-item label="节点名称" v-else-if="state.nodeType === 0">
        <n-input v-model:value="state.childNodeName" placeholder="请输入子节点名称" />
      </n-form-item>
      <!-- 节点描述-->
      <n-form-item label="节点描述">
        <n-input v-model:value="state.description" placeholder="请输入节点描述" />
      </n-form-item>
      <!-- 上传-->
      <n-form-item label="上传资料">
        <n-upload v-model:value="state.fileId" />
      </n-form-item>
      <n-form-item label="&nbsp;">
        <n-button type="success" @click="handleSubmit">保存</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>
