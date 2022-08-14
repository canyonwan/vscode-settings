<template>
  <div :class="[`bg-e-button-${type}-bg`, 'leading-10 px-5  text-center align-middle text-white cursor-pointer  bg-no-repeat bg-full max-w-10 overflow-ellipsis overflow-hidden']">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    type: {
      type: String as PropType<'orange' | 'blue'>,
      default: 'orange'
    }
  })
</script>
