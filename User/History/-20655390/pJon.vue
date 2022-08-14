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
  import { queryBannerDetail, saveBanner } from '@/api/base/banner/banner'
  import { IFileInfo } from '@/api/types'
  import { IBannerItem } from '@/api/upload/types'
  import { useForm } from '@/components/form'
  import { bannerSchemas } from '../schemas'

  const [register, { setFieldsValue }] = useForm({
    gridProps: { cols: 2 },
    inline: true,
    labelWidth: 90,
    layout: 'horizontal',
    showResetButton: false,
    schemas: bannerSchemas
  })

  const state = reactive({
    detailData: {} as IBannerItem,
    fileIds: ''
  })

  const emits = defineEmits(['handleSave'])
  const props = defineProps({
    id: {
      type: String as PropType<string>,
      default: ''
    }
  })

  function handleUploaded(list: IFileInfo[]) {
    state.fileIds = list.map((item) => item.fileId).join(',')
  }

  async function onSubmit(values: IBannerItem) {
    let params: IBannerItem = {
      ...values,
      id: props.id,
      fileId: state.fileIds
    }
    await saveBanner(params)
    emits('handleSave')
  }

  async function getBannerDetail() {
    const res = await queryBannerDetail(props.id)
    state.detailData = res
  }

  onMounted(async () => {
    if (props.id) {
      await getBannerDetail()
      setFieldsValue(detailData.value)
    }
  })
</script>
