<script setup lang="ts"></script>
<template>
  <n-checkbox-group @update:value="onUpdateValue" :value="injectCheckedChildren">
    <n-space vertical>
      <n-checkbox v-for="node in injectNodeRubbish" :key="node.nodeId" :value="node.nodeId">
        <n-card>
          <div class="font-medium text-base">{{ node.nodeName }}</div>
          <n-space justify="space-around" class="text-gray-500 text-xs">
            <div>删除时间：{{ format(node?.deleteTime, 'yyyy-MM-dd') }}</div>
            <div>操作人：{{ node.operationName }}</div>
          </n-space>
        </n-card>
      </n-checkbox>
    </n-space>
  </n-checkbox-group>
</template>
