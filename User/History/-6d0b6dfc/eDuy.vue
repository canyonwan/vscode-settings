<script setup lang="ts">
  import { queryGoodsDetail } from '@/api/goods/goods'
  import { useForm } from '@/components/Form'
  import { goodsDetailSchemas } from '../schemas'
  import type { IGoodsFileInfo, IGoodsItem } from '@/api/goods/types'

  const props = defineProps({
    goodsId: {
      type: String,
      default: ''
    }
  })

  const [register, { setFieldsValue }] = useForm({
    gridProps: { cols: 2 },
    inline: true,
    labelWidth: 90,
    layout: 'horizontal',
    schemas: goodsDetailSchemas
  })

  const detailData = ref<IGoodsItem>()

  async function getGoodsDetail() {
    const res = await queryGoodsDetail(props.goodsId)
    detailData.value = res
  }

  onMounted(() => {
    if (props.goodsId) {
      getGoodsDetail()
      setFieldsValue(detailData.value)
    }
  })

  function handleUploaded(list: IGoodsFileInfo[]) {
    // state.fileId = list.map((item) => item.fileId).join(',')
  }

  function onSubmit(values: any) {
    //
  }
</script>
<template>
  <div class="save-goods-detail">
    <basic-form @register="register" @submit="onSubmit" submit-button-text="保存">
      <template #uploadImageSlot>
        <basic-upload @update:value="handleUploaded" />
      </template>
    </basic-form>
  </div>
</template>
