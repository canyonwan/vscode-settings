<script setup lang="ts">
  import { saveTimelineNode } from '@/api/program/program'
  import type { ISaveTimelineNodeParams } from '@/api/program/types'
  import type { Ref } from 'vue'

  const emits = defineEmits(['handleSaveNode'])

  const props = defineProps({
    timelineNode: {
      type: Object as PropType<ISaveTimelineNodeParams>,
      default: () => {}
    }
  })

  const injectTimelineId = inject<Ref<string>>('provideProgramId')

  const state = reactive<ISaveTimelineNodeParams>({
    timeLineId: unref(injectTimelineId)!,
    nodeName: '',
    nodeType: props.timelineNode.nodeType,
    childNodeName: '',
    procedureId: props.timelineNode.procedureId,
    fileId: '',
    description: ''
  })

  // submit save node
  async function handleSubmit() {
    console.log('保存节点', state)
    // const res = await saveTimelineNode(state)
    // state.nodeName = ''
    // state.fileId = ''
    // state.description = ''
    // emits('handleSaveNode')
  }
</script>
<template>
  <div class="save-timeline-node">
    <n-form label-placement="left" label-width="100px" :style="{ width: '80%' }">
      <!-- 节点名称 1: 同级-->
      {{ state.nodeType }}
      <n-form-item label="节点名称" v-if="state.nodeType === '1'">
        <n-input v-model:value="state.nodeName" placeholder="请输入节点名称" />
      </n-form-item>
      <!-- 节点名称 0: 同级-->
      <n-form-item label="节点名称" v-else-if="state.nodeType === '0'">
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
