<script setup lang="ts">
  defineProps<{
    msg: string
    isShow: {
      type: Boolean
      default: false
      required: false
    }
  }>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
  </div>
</template>
