<script setup lang="ts">
  import { saveTimelineNode } from '@/api/program/program'
  import type { ISaveTimelineNodeParams } from '@/api/program/types'

  const emits = defineEmits(['handleSaveNode'])

  const props = defineProps({
    savetimelineNodeInfo: {
      type: Object as PropType<ISaveTimelineNodeParams>,
      default: () => {}
    }
  })

  const state = reactive<ISaveTimelineNodeParams>({
    timeLineId: props.savetimelineNodeInfo.timeLineId,
    nodeName: '',
    nodeType: props.savetimelineNodeInfo.nodeType,
    childNodeName: '',
    procedureId: props.savetimelineNodeInfo.procedureId,
    fileId: '',
    description: ''
  })

  // submit save node
  async function handleSubmit() {
    await saveTimelineNode(state)
    state.nodeName = ''
    state.fileId = ''
    state.description = ''
    emits('handleSaveNode')
  }
</script>
<template>
  <div class="save-timeline-node">
    <n-form label-placement="left" label-width="100px" :style="{ width: '80%' }">
      <!-- 节点名称 1: 同级-->
      <n-form-item label="同级节点名称" v-if="state.nodeType === '1'">
        <n-input v-model:value="state.nodeName" placeholder="请输入节点名称" />
      </n-form-item>
      <!-- 节点名称 0: 子级-->
      <n-form-item label="子级节点名称" v-else-if="state.nodeType === '0'">
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
