<template>
  <div class="add-cause">
    <basic-form @register="register" @submit="onSubmit" submit-button-text="提交">
      <template #lawTypeId="{ model, field }">
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

      const state = reactive({
        showDrawer: false,
        value: null,
        regions: {} as IRegion,
        lawTypeId: ''
      })

      async function onSubmit(values: ILawItemType) {
        let params: ILawItemType = {
          ...values,
          id: props.currentRowInfo.id,
          lawTypeId: state.lawTypeId === '' ? props.currentRowInfo.lawTypeId : state.lawTypeId
        }
        console.log('values', values)
        // !props.currentRowInfo.id && delete params.id
        // await saveLaw(params)
        // emit('onSubmit')
      }

      // TreeSelect 法类型选择回调
      function handleUpdateValue(value: string) {
        state.lawTypeId = value
      }

      onMounted(async () => {
        let regionId = Number(props.currentRowInfo?.regionBinding)
        props.currentRowInfo?.id && (await setFieldsValue({ ...props.currentRowInfo, regionBinding: regionId }))
      })

      return { ...toRefs(state), register, onSubmit, handleUpdateValue, rules }
    }
  })
</script>
