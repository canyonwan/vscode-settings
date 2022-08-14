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
      isTopLevel: {
        type: Boolean,
        default: false
      },
      isEditMode: {
        type: Boolean,
        default: false
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
          field: 'remarks',
          component: 'NInput',
          label: '备注',
          componentProps: {
            placeholder: '请输入备注'
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
          // parentId: props.isTopLevel ? 0 : props.currentRow?.id,
          ...props.currentRow,
          ...values
        }
        // if (props.isEditMode) {
        //   param.id = props.currentRow?.id
        //   param.parentId = props.currentRow?.parentId
        // }
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
          props.requestType === LawEnum.TYPE && schemas.pop()
        },
        { immediate: true }
      )

      return { register, onSubmit }
    }
  })
</script>
