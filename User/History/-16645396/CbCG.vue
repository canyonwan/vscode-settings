<script setup lang="ts" name="node-leaf">
  import type { ITimeLineTreeLeaf } from '@/api/program/types'
  import Leaf from '@/views/program/components/vertical-case-detail/leaf.vue'

  const props = defineProps({
    itemNode: {
      type: Object as PropType<ITimeLineTreeLeaf>,
      default: () => {},
      required: true
    },
    idx: Number,
    parentChildrenLength: Number
  })
</script>

<template>
  <div class="node-leaf">
    <!-- 第二层至无限层 -->
    <div v-if="props.itemNode?.childrenList">
      <leaf has-child :item-node="props.itemNode" :idx="props.idx" :parentChildrenLength="props.parentChildrenLength" />
      <!-- 连接线 -->
      <div class="vertical-divider"></div>
      <!--  -->
      <div class="flex">
        <div class="dashed"></div>
        <node-leaf v-for="(ele, idx) in props.itemNode.childrenList" :key="ele.id" :item-node="ele" :idx="idx" :parentChildrenLength="props.itemNode.childrenList.length" />
        <!-- <node-leaf class="ml-6" v-for="(ele, idx) in props.itemNode.childrenList" :key="ele.id" :item-node="ele" :idx="idx" :parentChildrenLength="props.itemNode.childrenList.length" /> -->
      </div>
    </div>
    <!-- 最后一层节点 -->
    <leaf no-child v-else :item-node="props.itemNode" :idx="props.idx" :parentChildrenLength="props.parentChildrenLength" />
    <media-preview class="ml-7 mt-4" v-if="props.itemNode.fileList.length > 0" :values="props.itemNode.fileList" />
  </div>
</template>
<style lang="less" scoped>
  .dashed {
    min-width: 20px;
    height: 0;
    opacity: 0.6;
    margin: 0 8px;
    border: 0.6px dashed #619c98;
  }

  .vertical-divider {
    display: inline-block;
    min-height: 1.5em;
    margin: 0 8px;
    vertical-align: middle;
    width: 1px;
    border: 0.5px dashed #619c98;
  }
</style>
