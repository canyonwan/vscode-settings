import type { ComputedRef, Ref } from 'vue'
import type { FormProps, FormSchema, FormActionType } from '../types/form-type'
import { isFunction } from '@/utils/is'
import { isString } from 'lodash'

declare type EmitType = (event: string, ...args: any[]) => void

interface UseFormActionContext {
  emit: EmitType
  getProps: ComputedRef<FormProps>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  formElRef: Ref<FormActionType>
  defaultFormModel: Recordable
  loadingSub: Ref<boolean>
  // handleFormValues: Function
}

export function useFormEvents({ emit, getProps, formModel, getSchema, formElRef, defaultFormModel, loadingSub }: UseFormActionContext) {
  // 验证
  async function validate() {
    for (const key in formModel) {
      console.log('%c [ key ]-22', 'font-size:13px; background:#0095FF; color:white;', typeof formModel[key])
      if (isString(formModel[key])) {
        formModel[key] = formModel[key].trim()
      }
    }
    return unref(formElRef)?.validate()
  }

  // 提交
  async function handleSubmit(e?: Event): Promise<void> {
    e && e.preventDefault()
    // loadingSub.value = true
    const { submitFunc } = unref(getProps)
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc()
      return
    }
    const formEl = unref(formElRef)
    if (!formEl) return
    try {
      await validate()
      // loadingSub.value = false
      emit('submit', { ...formModel })
    } catch (error) {
      // loadingSub.value = false
    }
  }
  // function handleCancel(e?: Event) {
  //   e && e.preventDefault()
  //   // loadingSub.value = true
  //   debugger
  //   const { cancelFunc } = unref(getProps)
  //   if (cancelFunc && isFunction(cancelFunc)) {
  //     cancelFunc()
  //     return
  //   }
  // }
  //清空校验
  async function clearValidate() {
    // @ts-ignore
    await unref(formElRef)?.restoreValidation()
  }

  //重置
  async function resetFields(): Promise<void> {
    const { resetFunc, submitOnReset } = unref(getProps)
    resetFunc && isFunction(resetFunc) && (await resetFunc())

    const formEl = unref(formElRef)
    if (!formEl) return
    Object.keys(formModel).forEach((key) => {
      formModel[key] = unref(defaultFormModel)[key] || null
    })
    await clearValidate()
    const fromValues = toRaw(unref(formModel))
    emit('reset', fromValues)
    submitOnReset && (await handleSubmit())
  }

  //获取表单值
  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef)
    if (!formEl) return {}
    return toRaw(unref(formModel))
  }

  //设置表单字段值全部赋值
  function setFieldsValue(values: Recordable) {
    // const fields = unref(getSchema)
    //   .map((item) => item.field)
    //   .filter(Boolean)
    Object.keys(values).forEach((key) => {
      formModel[key] = values[key]
      // console.log(formModel, 'formModel')
      // if (fields.includes(key)) {
      //   formModel[key] = value
      // }
    })
    // formModel = { ...values }
  }
  // //设置表单字段值只赋值配置的key
  // function setFieldsValueByKey(values: Recordable) {
  //   const fields = unref(getSchema)
  //     .map((item) => item.field)
  //     .filter(Boolean)
  //   Object.keys(values).forEach((key) => {
  //     const value = values[key]
  //     if (fields.includes(key)) {
  //       formModel[key] = value
  //     }
  //   })
  // }
  return {
    handleSubmit,
    validate,
    resetFields,
    getFieldsValue,
    clearValidate,
    setFieldsValue
    // handleCancel
  }
}
