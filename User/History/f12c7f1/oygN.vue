<template>
  <div class="add-cause">
    <basic-form @register="register" @submit="onSubmit" submit-button-text="提交">
      <template #lawTypeId="{ model, field }">
        <label class="ml-6 n-form-item-label">法类型<span class="n-form-item-label__asterisk">&nbsp;*</span></label>
        <law-type-tree-select :law-type-id="model[field]" @handle-update-value="handleUpdateValue" />
      </template>
    </basic-form>
  </div>
</template>

<script lang="ts">
  import { useForm } from '@/components/form/index'
  import { saveLaw } from '@/api/law/cause'
  import { schemas } from '@/views/law/law-cause/components/schemas'
  import type { ILawItemType } from '@/api/law/types'
  import LawTypeTreeSelect from '../../components/law-type-tree-select.vue'
  import type { IRegion } from '@/components/select-region'
  import { FormInst, useMessage } from 'naive-ui'

  export default defineComponent({
    name: 'AddCause',
    components: {
      LawTypeTreeSelect
    },
    props: {
      currentRowInfo: {
        type: Object as PropType<ILawItemType>,
        default: () => {}
      }
    },
    emits: ['onSubmit'],
    setup(props, { emit }) {
      const [register, { setFieldsValue }] = useForm({
        gridProps: { cols: 1 },
        labelWidth: 90,
        layout: 'horizontal',
        schemas
      })

      const formRef = ref<FormInst | null>(null)

      const state = reactive({
        showDrawer: false,
        value: null,
        regions: {} as IRegion,
        lawTypeId: ''
      })

      const message = useMessage()
      async function onSubmit(values: ILawItemType) {
        debugger
        let params: ILawItemType = {
          ...values,
          id: props.currentRowInfo.id,
          lawTypeId: state.lawTypeId === '' ? props.currentRowInfo.lawTypeId : state.lawTypeId
        }
        delete params.lawTagList
        delete params['regionBindingName']
        if (!params.regionBinding) {
          params.regionBinding = '0'
        }
        if (!params.lawTypeId || props.currentRowInfo.lawTypeId === '') {
          message.error('请选择法类型')
          return
        }
        !props.currentRowInfo.id && delete params.id
        await saveLaw(params)
        emit('onSubmit')
      }

      // TreeSelect 法类型选择回调
      function handleUpdateValue(value: string) {
        state.lawTypeId = value
      }

      onMounted(async () => {
        let regionId = Number(props.currentRowInfo?.regionBinding)
        props.currentRowInfo?.id && setFieldsValue({ ...props.currentRowInfo, regionBinding: regionId })
      })

      return { ...toRefs(state), register, onSubmit, handleUpdateValue, formRef }
    }
  })
</script>
