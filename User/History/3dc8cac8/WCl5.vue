<script setup lang="ts">
  interface IProps {
    prefix: string
    name: string
    color: string
    size: string
  }

  const props = withDefaults(defineProps<IProps>(), {
    prefix: 'icon',
    size: '1.5em',
    color: '#FC001A'
  })

  const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<template>
  <svg aria-hidden="true" class="svg-icon" :width="props.size" :height="props.size">
    <use :xlink:href="symbolId" :fill="props.color" />
  </svg>
</template>
<style lang="less" scoped>
  // .svg-icon {
  //   vertical-align: -0.1em;
  //   fill: currentColor;
  //   overflow: hidden;
  // }
</style>
