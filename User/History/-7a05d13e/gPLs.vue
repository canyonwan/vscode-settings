<template>
  <div class="add-tag">
    <basic-form @register="register" @submit="onSubmit" submit-button-text="提交" />
  </div>
</template>

<script lang="ts">
  import { FormSchema, useForm } from '@/components/form'
  import { ILawTagType } from '@/api/law/types'
  import { LawEnum } from '@/enums/law-enum'

  export default defineComponent({
    name: 'AddTag',
    props: {
      currentRow: {
        type: Object as PropType<ILawTagType>,
        default: () => {}
      },
      requestType: {
        type: Number as PropType<LawEnum>,
        default: LawEnum.TYPE
      },
      submitAction: {
        type: Function as PropType<(...arg: any[]) => Promise<any>>,
        default: null
      }
    },
    emits: ['onSubmit'],
    setup(props, { emit }) {
      const schemas: FormSchema[] = [
        {
          defaultValue: null,
          giProps: {},
          field: 'name',
          component: 'NInput',
          label: '标签名称',
          componentProps: {
            placeholder: '请输入标签名称'
          },
          rules: [{ required: true, message: '请输入标签名称', trigger: ['blur'] }]
        },
        {
          defaultValue: null,
          giProps: {},
          field: 'code',
          component: 'NInput',
          label: '标签code',
          componentProps: {
            placeholder: '请输入标签code'
          },
          rules: [{ required: true, message: '请输入标签code', trigger: ['blur'] }]
        },
        {
          defaultValue: null,
          giProps: {},
          field: 'remarks',
          component: 'NInput',
          label: '备注',
          componentProps: {
            placeholder: '请输入备注'
          },
          rules: [{ required: false, message: '请输入备注', trigger: ['blur'] }]
        },
        {
          defaultValue: null,
          giProps: {},
          field: 'remarks',
          component: 'NUpload',
          label: '文件',
          componentProps: {
            placeholder: '请输入文件'
          },
          rules: [{ required: false, message: '请输入备注', trigger: ['blur'] }]
        }
      ]

      const [register, { setFieldsValue, resetFields }] = useForm({
        gridProps: { cols: 1 },
        labelWidth: 90,
        layout: 'horizontal',
        schemas
      })

      async function onSubmit(values: ILawTagType) {
        let param = {
          ...props.currentRow,
          ...values
        }
        await props.submitAction(param)
        await resetFields()
        emit('onSubmit')
      }

      watch(
        () => props.currentRow.id,
        () => {
          if (props.currentRow.id) {
            nextTick(() => {
              setFieldsValue(props.currentRow)
            })
          } else {
            nextTick(() => {
              resetFields()
            })
          }
          if (props.requestType === LawEnum.TYPE) {
            schemas.splice(1, 2)
          }
          if (props.requestType === LawEnum.TAG) {
            schemas.splice(1, 1)
          }
        },
        { immediate: true }
      )

      return { register, onSubmit }
    }
  })
</script>
