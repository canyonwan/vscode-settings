<script setup lang="ts">
  import { useForm } from '@/components/form'

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

  const [register] = useForm({})
</script>
<template>
  <div class="custom-discretion">
    <basic-form @register="register" />
  </div>
</template>
