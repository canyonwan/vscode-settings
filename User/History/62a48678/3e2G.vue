<template>
  <div :class="[`bg-e-button-${type}-bg`, 'leading-10 px-4  text-center align-middle text-white cursor-pointer  bg-no-repeat bg-full']">
    <!--  -->
    <template #default></template>
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
