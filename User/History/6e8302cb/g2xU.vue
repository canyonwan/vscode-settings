<template>
  <div class="add-base-types">
    <basic-form @register="register" @submit="onSubmit" submit-button-text="提交" />
  </div>
</template>

<script lang="ts">
  import { FormSchema, useForm } from '@/components/form/index'
  import type { IBaseType } from '@/api/setting/types'
  import { schemas } from '@/components/base-types/options'

  export default defineComponent({
    name: 'AddBaseTypes',
    props: {
      formSchemas: {
        type: [Array] as PropType<FormSchema[]>,
        default: () => schemas,
        required: false
      },
      editRowInfo: {
        type: Object as PropType<IBaseType>,
        default: () => {},
        required: false
      },
      // 编辑模式
      editMode: {
        type: Boolean,
        default: false
      }
    },
    emits: ['onSubmit'],
    setup(props, { emit }) {
      const [register, { setFieldsValue }] = useForm({
        gridProps: { cols: 1 },
        labelWidth: 90,
        layout: 'horizontal',
        schemas: props.formSchemas,
        showCancelButton: true
      })

      // 提交
      function onSubmit(values: IBaseType) {
        props.editRowInfo.id && Object.assign(values, { id: props.editRowInfo.id })
        emit('onSubmit', values)
      }

      onMounted(() => {
        props.editMode && setFieldsValue(props.editRowInfo)
      })

      return { onSubmit, register }
    }
  })
</script>
