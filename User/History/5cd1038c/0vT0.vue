<script setup lang="ts">
  defineProps<{
    msg: string
    show: boolean
  }>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <div v-if="show">{{ msg + '1' }}</div>
  </div>
</template>
