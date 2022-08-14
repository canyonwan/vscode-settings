import { BasicForm, useForm } from '@/components/form/index'
import schemaDataHandle from '@/hooks/custom-form-data-handle'
import { schemas } from './schemas'
import type { IDiscretionType } from '@/api/cause-manage/types'
import { saveDiscretionType } from '@/api/cause-manage/discretion'
export default defineComponent({
  name: 'SaveDiscretionType',
  emits: ['submitHandler', 'cancelModalHandler'],
  props: {
    currentRowData: {
      type: Object as PropType<IDiscretionType>,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const schemasForm = ref(schemas)
    schemaDataHandle(schemasForm.value)
    const [register, { setFieldsValue, resetFields }] = useForm({
      gridProps: { cols: 2 },
      labelWidth: 100,
      layout: 'horizontal',
      schemas: schemasForm.value,
      labelPlacement: 'left',
      buttonPosition: 'end'
    })

    // 提交
    const onSubmit = async (values: IDiscretionType) => {
      const params: IDiscretionType = {
        ...values,
        id: props.currentRowData.id,
        relaEvidenceType: values.relaEvidenceType?.join(',')
      }
      !props.currentRowData.id && delete params.id
      // props.currentRowData.id && Object.assign(values, { id: props.currentRowData.id, relaEvidenceType: values.relaEvidenceType.join(',') })
      await saveDiscretionType(params)
      emit('submitHandler')
    }

    // cancel
    function cancelModalHandler() {
      emit('cancelModalHandler')
    }

    watchEffect(() => {
      if (props.currentRowData.id) {
        setTimeout(() => setFieldsValue({ ...props.currentRowData, relaEvidenceType: props.currentRowData.relaEvidenceType?.split(',') }), 0)
      } else {
        setTimeout(() => resetFields(), 0)
      }
    })

    return () => <BasicForm onRegister={register} onSubmit={onSubmit} submit-button-text="提交" onCancel={cancelModalHandler} />
  }
})
