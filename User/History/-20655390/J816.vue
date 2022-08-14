<template>
  <div>
    <basic-form @register="register" @submit="onSubmit" submit-button-text="保存">
      <template #uploadImageSlot>
        <basic-upload @update:value="handleUploaded" :value="detailData?.fileInfos" />
      </template>
    </basic-form>
  </div>
</template>

<script setup lang="ts">
  import { saveBanner } from '@/api/base/banner/banner'
  import { IBannerItem } from '@/api/upload/types'
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

  const emits = defineEmits(['handleSave'])

  function handleUploaded(list: IFileInfo) {
    //
  }

  async function onSubmit(values: IBannerItem) {
    let params = {
      // ...values,
      // fileIds: state.fileIds,
      // id: props.goodsId,
      // goodsTypeId: state.goodsTypeId
    }
    await saveBanner(values)
    emits('handleSave')
  }
</script>
