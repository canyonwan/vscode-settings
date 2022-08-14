<template>
  <div class="main-header">
    <div :class="[props?.options.length > 0 ? 'justify-between' : 'justify-end', 'flex']">
      <div v-if="props.options.length > 0">
        <div
          v-for="item in props.options"
          :key="item.value"
          class="inline-block transition duration-200 ease-linear cursor-pointer w-40 -mb-2.5 font-medium text-center text-mainHeader-normalText leading-10 rounded-tl-3xl bg-gradient-to-r from-mainHeader-gradientFrom to-mainHeader-gradientTo"
          :class="clickedStyle(item.value)"
          @click="clickItem(item)"
        >
          {{ item.label }}
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ISelectOption } from './types'

  const props = defineProps({
    options: {
      type: Array as PropType<Array<ISelectOption>>,
      default: () => []
    }
  })

  const emits = defineEmits(['clickItemHandler'])

  let currentItem = ref<string>(props?.options[0]?.value as string)

  const clickedStyle = (value: string | number) => {
    return {
      'text-white': currentItem.value === value,
      'from-mainHeader-gradientSelectFrom': currentItem.value === value
    }
  }

  function clickItem(item: ISelectOption) {
    currentItem.value = item.value as string
    emits('clickItemHandler', item)
  }
</script>

<style lang="less" scoped></style>
