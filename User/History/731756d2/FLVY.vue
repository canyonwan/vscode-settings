<template>
  <div class="w-full">
    <basic-form v-for="(item, index) in formList" :key="index" @register="item.register" />
  </div>
</template>

<script lang="ts">
  import { useForm } from '@/components/form/index'
  import type { RegisterFn, FormActionType } from '@/components/form/src/types/form-type'
  import { getUseCustomForm } from '@/api/setting/custom-form'
  import type { ICustomFormBind, ICustomForm } from '@/api/setting/types'
  import { useUserStore } from '@/store/modules/user'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  interface IUseForm extends ICustomForm {
    fieldDescribeData?: any
    customFormFieldList: ICustomFormValue[]
    register: RegisterFn
    formAction: FormActionType
  }
  interface ICustomFormValue {
    id?: string
    subjectId?: string // 关联id
    fieldId: string // 字段id
    formId: string // 表单id
    fieldName: string // 字段key
    fieldValue: string | number | string[] | number[]
    fieldType?: string // 组件类型
    fieldValueType?: string // 组件值类型
    defaultValue?: '' // 默认值
  }
  export default defineComponent({
    props: {
      // 机关id不传 默认当前机关
      orgId: {
        type: String,
        default: ''
      },
      type: {
        // 表单类型 1机关 2用户 3检查对象
        type: Number,
        default: 1,
        required: true
      },
      targetType: {
        type: String,
        default: ''
      },
      customFormValues: {
        // 自定义表单值
        type: Array as PropType<Array<ICustomFormValue>>,
        default: () => {
          return []
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    emits: [],
    setup(props) {
      const user = useUserStore()
      const state = reactive({
        formList: [] as unknown as IUseForm[]
      })
      const getUseCustomFormData = async () => {
        // 获取自定义表单数据
        let params: ICustomFormBind = {
          type: props.type,
          targetList: []
        }
        if (props.orgId || user.getUserInfo.orgId) {
          params.orgId = props.orgId || user.getUserInfo.orgId
        }
        if (props.targetType) {
          params.targetId = props.targetType
        }
        const formData = await getUseCustomForm(params)
        if (formData) {
          for (const item of formData) {
            item.fieldDescribeData = JSON.parse(item.fieldDescribe)
            item.fieldDescribeData.disabled = props.disabled
            const [register, formAction] = useForm(item.fieldDescribeData)
            item.register = register
            item.formAction = formAction
            await schemaDataHandle(item.fieldDescribeData.schemas)
            state.formList.push(item)
          }
          nextTick(() => {
            // 首次加载form 需要赋值
            bindFormValues()
          })
        }
      }
      getUseCustomFormData()
      watch(
        () => props.customFormValues,
        () => {
          if (state.formList && state.formList.length > 0) {
            // 表单值改变， 重新赋值并清空
            bindFormValues()
          }
        }
      )
      let valuesKey = {} // 保存 字段id 对应的数据id
      const bindFormValues = () => {
        valuesKey = {}
        if (props.customFormValues && props.customFormValues.length > 0) {
          // 绑定自定义表单的值
          for (const item of state.formList) {
            let valueData = {}
            props.customFormValues
              .filter((fItem) => {
                return fItem.formId === item.id // 返回是当前form表单的value
              })
              .map((itemValue) => {
                valueData = { ...valueData, [itemValue.fieldName]: itemValue.fieldValue }
                valuesKey[itemValue.fieldId] = itemValue.id
              })
            for (const e of item.fieldDescribeData.schemas) {
              // 循环数据源的列 补齐字段值
              if (!(e.fieldId in valueData)) {
                // 在值数据中不存在， 赋值默认值
                valueData[e.fieldId] = e.defaultValue
              }
            }
            item.formAction.setFieldsValue(valueData)
          }
        } else {
          // 清空form 字段值
          for (const item of state.formList) {
            item.formAction.resetFields()
          }
        }
      }
      const saveCustomForm = async () => {
        // 保存自定义表单值
        // await item.formAction.validate()
        let returnData = [] as ICustomFormValue[]
        for (const item of state.formList) {
          await item.formAction.validate()
          const formV: any = await item.formAction.getFieldsValue()
          for (const e of item.customFormFieldList) {
            let fieldV = formV[e.fieldName]
            if (e.fieldType === 'NUpload') {
              // 上传文件标识
              if (fieldV && fieldV) {
                fieldV = fieldV.map((item) => item.fileId).join(',')
              }
            }
            returnData.push({
              id: e.id ? valuesKey[e.id] : 0,
              formId: item.id || '',
              fieldId: e.id || '',
              fieldName: e.fieldName,
              fieldValue: fieldV
            })
          }
        }
        return returnData
      }
      return {
        ...toRefs(state),
        saveCustomForm
      }
    }
  })
</script>

<style lang="less" scoped></style>
