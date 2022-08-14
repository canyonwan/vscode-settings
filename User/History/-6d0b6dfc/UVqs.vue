<script setup lang="ts">
  import { queryGoodsDetail, saveGoods } from '@/api/goods/goods'
  import { useForm } from '@/components/Form'
  import { goodsDetailSchemas } from '../schemas'
  import type { IGoodsFileInfo, IGoodsItem } from '@/api/goods/types'

  const props = defineProps({
    goodsId: {
      type: String,
      default: ''
    }
  })

  const state = reactive({
    fileId: ''
  })

  const [register, { setFieldsValue }] = useForm({
    gridProps: { cols: 2 },
    inline: true,
    labelWidth: 90,
    layout: 'horizontal',
    showAdvancedButton: false,
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
    state.fileId = list[0].fileId
    console.log('file', list)
    // state.fileId = list.map((item) => item.fileId).join(',')
  }

  async function onSubmit(values: IGoodsItem) {
    let params = {
      ...values,
      fileId: state.fileId,
      id: props.goodsId
    }
    await saveGoods(params)
  }
</script>
<template>
  <div class="save-goods-detail">
    <basic-form @register="register" @submit="onSubmit" submit-button-text="保存">
      <template #uploadImageSlot>
        <basic-upload @update:value="handleUploaded" />
      </template>
      <div class="flex justify-end items-end mt-5" v-if="isCheck">
        <n-button class="ml-2" @click="onCancel">取消</n-button>
        <n-button class="ml-2" @click="handleSubmitBind" type="primary">提交绑定</n-button>
      </div>
    </basic-form>
  </div>
</template>
