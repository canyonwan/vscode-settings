<template>
  <div class="form-actions">
    <basic-form @register="formRegister" submit-button-text="保存" @submit="onSubmit" />
  </div>
</template>

<script lang="ts">
  import { useForm } from '@/components/form'
  import { schemas } from '@/views/setting/case-type/components/schemas'
  import { ICaseType } from '@/api/setting/types'
  import { saveCaseType } from '@/api/setting/case-type'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'

  export default defineComponent({
    name: 'FormActions',
    props: {
      // 操作的目录
      handleTarget: {
        type: String,
        default: ''
      }
    },
    emits: ['onFormSubmit'],
    setup(_, { emit }) {
      const schemasForm = ref(schemas)
      schemaDataHandle(schemasForm.value)
      const [formRegister, { setFieldsValue, resetFields }] = useForm({
        gridProps: { cols: 1 },
        labelWidth: 100,
        layout: 'horizontal',
        schemas: schemasForm.value,
        showCancelButton: false
      })
      const currentRowData: ICaseType = inject('currentRowData')!

      async function onSubmit(values: ICaseType) {
        await saveCaseType(values)
        await resetFields()
        emit('onFormSubmit')
      }

      watch(
        () => unref(currentRowData),
        () => {
          console.log('currentRowData', currentRowData)
          setFieldsValue(unref(currentRowData))
        }
      )

      return { formRegister, onSubmit, resetFields }
    }
  })
</script>
