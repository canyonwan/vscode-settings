<script setup lang="ts">
  import { ITimeLineTreeLeaf } from '@/api/program/types'
  import { CheckmarkCircle, EllipseOutline } from '@vicons/ionicons5'

  defineProps<{ children: ITimeLineTreeLeaf[] }>()
</script>
<template>
  <div class="flex items-center" v-for="child in children" :key="child.id">
    <!-- 未开始 -->
    <n-icon v-if="child.nodeStatus === 0" class="text-gray-600" :component="EllipseOutline" />
    <!-- 进行中 -->
    <n-icon v-if="child.nodeStatus === 1">
      <svg class="animate-spin text-yellow-500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
        <defs />
        <path d="M7.7 4.7a14.7 14.7 0 0 0-3 3.1L6.3 9a13.26 13.26 0 0 1 2.6-2.7z" fill="currentColor" />
        <path d="M4.6 12.3l-1.9-.6A12.51 12.51 0 0 0 2 16h2a11.48 11.48 0 0 1 .6-3.7z" fill="currentColor" />
        <path d="M2.7 20.4a14.4 14.4 0 0 0 2 3.9l1.6-1.2a12.89 12.89 0 0 1-1.7-3.3z" fill="currentColor" />
        <path d="M7.8 27.3a14.4 14.4 0 0 0 3.9 2l.6-1.9A12.89 12.89 0 0 1 9 25.7z" fill="currentColor" />
        <path d="M11.7 2.7l.6 1.9A11.48 11.48 0 0 1 16 4V2a12.51 12.51 0 0 0-4.3.7z" fill="currentColor" />
        <path d="M24.2 27.3a15.18 15.18 0 0 0 3.1-3.1L25.7 23a11.53 11.53 0 0 1-2.7 2.7z" fill="currentColor" />
        <path d="M27.4 19.7l1.9.6A15.47 15.47 0 0 0 30 16h-2a11.48 11.48 0 0 1-.6 3.7z" fill="currentColor" />
        <path d="M29.2 11.6a14.4 14.4 0 0 0-2-3.9l-1.6 1.2a12.89 12.89 0 0 1 1.7 3.3z" fill="currentColor" />
        <path d="M24.1 4.6a14.4 14.4 0 0 0-3.9-2l-.6 1.9a12.89 12.89 0 0 1 3.3 1.7z" fill="currentColor" />
        <path d="M20.3 29.3l-.6-1.9a11.48 11.48 0 0 1-3.7.6v2a21.42 21.42 0 0 0 4.3-.7z" fill="currentColor" />
      </svg>
    </n-icon>
    <!-- 已完成 -->
    <n-icon color="#7bdfe7" v-if="child.nodeStatus === 2" :component="CheckmarkCircle" />
    <!-- 标题 -->
    <n-ellipsis style="max-width: 240px" class="text-xs px-2"> {{ child.title }}</n-ellipsis>

    <media-preview class="ml-4 mt-4" :values="child.fileList" />
  </div>
</template>
