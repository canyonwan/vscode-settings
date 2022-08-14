<script setup lang="ts">
  interface IProps {}
  const props = defineProps<IProps>()
</script>
<template>
  <svg aria-hidden="true" class="svg-icon" :width="props.size" :height="props.size">
    <use :xlink:href="symbolId" :fill="props.color" />
  </svg>
</template>
