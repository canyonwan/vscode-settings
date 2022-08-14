<template>
  <div>
    <basic-form @register="register" @submit="onSubmit" submit-button-text="保存" />
  </div>
</template>

<script setup lang="ts">
  import { saveBanner } from '@/api/base/banner/banner'
  import { useForm } from '@/components/form'
  import { bannerSchemas } from '../schemas'

  const [register] = useForm({
    gridProps: { cols: 4 },
    inline: true,
    labelWidth: 90,
    layout: 'horizontal',
    showResetButton: false,
    schemas: bannerSchemas
  })

  async function onSubmit(values: IGoodsItem) {
    let params = {
      // ...values,
      // fileIds: state.fileIds,
      // id: props.goodsId,
      // goodsTypeId: state.goodsTypeId
    }
    await saveBanner(params)
    emits('handleSave')
  }
</script>
