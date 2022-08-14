<script setup lang="ts">
  defineProps<{ causeId: string }>()
</script>
<template>
  <div class="save-cause-type">
    <n-form-item label="" path="">
      <n-input v-model="form." />
    </n-form-item>
  </div>
</template>
