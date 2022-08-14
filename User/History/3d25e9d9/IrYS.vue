<template>
  <div class="main-header pb-1">
    <div :class="[props?.options.length > 0 ? 'justify-between' : 'justify-end', 'flex']">
      <div v-if="props.options.length > 0">
        <div
          v-for="item in props.options"
          :key="item.value"
          class="inline-block transition duration-200 ease-linear cursor-pointer w-40 font-medium text-center leading-10 rounded-tl-3xl bg-gradient-to-r from-mainHeader-gradientFrom to-mainHeader-gradientTo"
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
  import { typeOptions } from '@/views/program/options'
  import type { ISelectOption } from './types'

  const props = defineProps({
    options: {
      type: Array as PropType<Array<ISelectOption>>,
      default: () => typeOptions
    },
    defaultItem: {
      type: Number,
      default: 1
    }
  })

  const emits = defineEmits(['clickItemHandler'])

  // let currentItem = ref<string>(props?.options[0]?.value as string)
  let currentItem = ref<number>(props.defaultItem)

  const clickedStyle = (value: number) => {
    console.log('%c [  ]-42', 'font-size:13px; background:#0095FF; color:white;', currentItem.value === value)
    return {
      'from-mainHeader-gradientSelectFrom': currentItem.value === value,
      'text-white': currentItem.value === value
    }
  }

  watch(
    () => props.defaultItem,
    () => {
      currentItem.value = props.defaultItem
    }
  )

  function clickItem(item: ISelectOption) {
    currentItem.value = item.value
    emits('clickItemHandler', item)
  }
</script>
