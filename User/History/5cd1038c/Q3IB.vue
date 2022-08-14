<script setup lang="ts">
  defineProps<{
    msg: string
    isShow: {
      type: Boolean
      default: false
    }
  }>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <div v-if="isShow">{{ msg + '1' }}</div>
  </div>
</template>
