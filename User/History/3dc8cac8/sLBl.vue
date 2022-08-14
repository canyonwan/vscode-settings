<script setup lang="ts">
  interface IProps {
    prefix: string
    name: string
    color: string
    size: string
  }

  const props = withDefaults(defineProps<IProps>(), {
    prefix: 'icon',
    color: '#26598A',
    size: '1em'
  })

  const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<template>
  <svg aria-hidden="true" class="svg-icon" :width="props.size" :height="props.size">
    <use :xlink:href="symbolId" :fill="props.color" />
  </svg>
</template>
