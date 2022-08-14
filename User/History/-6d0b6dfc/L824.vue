<script setup lang="ts">
  import { queryGoodsDetail, saveGoods } from '@/api/goods/goods'
  import { useForm } from '@/components/Form'
  import { goodsDetailSchemas } from '../schemas'
  import type { IGoodsFileInfo, IGoodsItem } from '@/api/goods/types'

  interface IState {
    fileIds: string[]
  }

  const props = defineProps({
    goodsId: {
      type: String,
      default: ''
    }
  })

  const emits = defineEmits(['handleSave'])

  const state = reactive<IState>({
    fileIds: []
  })

  const [register, { setFieldsValue }] = useForm({
    gridProps: { cols: 2 },
    inline: true,
    labelWidth: 90,
    layout: 'horizontal',
    showActionButtonGroup: false,
    schemas: goodsDetailSchemas
  })

  const detailData = ref<IGoodsItem>()

  async function getGoodsDetail() {
    const res = await queryGoodsDetail(props.goodsId)
    detailData.value = res
  }

  onMounted(async () => {
    if (props.goodsId) {
      await getGoodsDetail()
      setFieldsValue(detailData.value)
    }
  })

  function handleUploaded(list: IGoodsFileInfo[]) {
    state.fileIds = list.map((item) => item.fileId)
  }

  async function onSubmit(values: IGoodsItem) {
    let params = {
      ...values,
      fileId: state.fileIds,
      id: props.goodsId
    }
    await saveGoods(params)
    emits('handleSave')
  }
</script>
<template>
  <div class="save-goods-detail">
    <basic-form @register="register" @submit="onSubmit" submit-button-text="保存">
      <template #uploadImageSlot>
        <basic-upload @update:value="handleUploaded" />
      </template>
      <template #goodsTypeSlot>
        <tree-select />
      </template>
    </basic-form>
  </div>
</template>
