<script setup lang="ts"></script>
<template>
  <div class="mx-10">
    <div class="text-center text-lg">{{ messageDetail?.title }}</div>
    <div class="pl-10 text-center text-xs text-gray-500 py-2">来自: {{ messageDetail?.sendUserName }}</div>
    <div class="text-md py-4">{{ messageDetail?.content }}</div>
    <media-preview :values="messageDetail?.fileInfos" v-if="messageDetail?.fileInfos" />
  </div>
</template>
