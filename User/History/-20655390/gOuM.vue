<template>
  <div>
    <basic-form @register="register" @submit="onSubmit" submit-button-text="保存">
      <template #uploadImageSlot>
        <basic-upload @update:value="handleUploaded" :value="detailData?.fileInfo" />
      </template>
    </basic-form>
  </div>
</template>

<script setup lang="ts">
  import { saveBanner } from '@/api/base/banner/banner'
  import { IFileInfo } from '@/api/types'
  import { IBannerItem } from '@/api/upload/types'
  import { useForm } from '@/components/form'
  import { bannerSchemas } from '../schemas'

  interface IState {
    detailData: Partial<IBannerItem>
    fileIds: string[]
  }

  const [register] = useForm({
    gridProps: { cols: 2 },
    inline: true,
    labelWidth: 90,
    layout: 'horizontal',
    showResetButton: false,
    schemas: bannerSchemas
  })

  const detailData = ref<IBannerItem>()

  const state = reactive<IState>({
    detailData: {},
    fileIds: []
  })

  const emits = defineEmits(['handleSave'])
  const props = defineProps({
    id: {
      type: String as PropType<string>,
      default: ''
    }
  })

  function handleUploaded(list: IFileInfo[]) {
    state.fileIds = list.map((item) => item.fileId)
  }

  async function onSubmit(values: IBannerItem) {
    let params = {
      ...values,
      id: props.id,
      fileIds: state.fileIds
    }
    await saveBanner(params)
    emits('handleSave')
  }
</script>
