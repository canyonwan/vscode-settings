<script setup lang="ts">
  const calcWay = [
    {
      label: '加',
      value: 1
    },
    {
      label: '减',
      value: 2
    },
    {
      label: '乘',
      value: 3
    },
    {
      label: '除',
      value: 4
    }
  ]
  const unitOptions = [
    {
      label: '元',
      value: 1
    },
    {
      label: '百分比',
      value: 2
    },
    {
      label: '分',
      value: 3
    }
  ]

  const props = defineProps({
    programCauseId: {
      type: String as PropType<string>,
      default: ''
    }
  })
</script>
<template>
  <div> </div>
</template>
