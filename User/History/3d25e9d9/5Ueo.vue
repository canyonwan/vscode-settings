<template>
  <div class="main-header pb-1">
    <div :class="[props?.options.length > 0 ? 'justify-between' : 'justify-end', 'flex']">
      <div v-if="props.options.length > 0">
        <div
          v-for="item in props.options"
          :key="item.value"
          class="inline-block transition duration-200 ease-linear cursor-pointer w-40 font-medium text-center text-mainHeader-normalText leading-10 rounded-tl-3xl bg-gradient-to-r from-mainHeader-gradientFrom to-mainHeader-gradientTo"
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
  import type { ISelectOption } from './types'

  const props = defineProps({
    options: {
      type: Array as PropType<Array<ISelectOption>>,
      default: () => []
    },
    defaultItem: {
      type: Number,
      default: 1
    }
  })

  const emits = defineEmits(['clickItemHandler'])

  let currentItem = ref<string>(1)
  // let currentItem = ref<string>(props.defaultItem.toString())

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
