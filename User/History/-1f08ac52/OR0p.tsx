import { saveDiscretionGroup } from '@/api/cause-manage/discretion'
import type { IDiscretionGroupType } from '@/api/cause-manage/types'
import { BasicForm, useForm } from '@/components/form'
import { schemas } from './schemas'

export default defineComponent({
  name: 'SaveDiscretionGroup',
  props: {
    currentGroupItem: {
      type: Object as PropType<IDiscretionGroupType>,
      default: () => {}
    }
  },
  emits: ['submitHandler', 'cancelHandler'],
  setup(props, { emit }) {
    const [register, { setFieldsValue, resetFields }] = useForm({
      gridProps: { cols: 1 },
      labelWidth: 100,
      layout: 'horizontal',
      schemas: schemas,
      submitButtonText: '提交',
      showCancelButton: true
    })

    // 提交
    async function onSubmit(values: IDiscretionGroupType) {
      const params: IDiscretionGroupType = { ...values }
      !props.currentGroupItem.id && delete params.id
      await saveDiscretionGroup(params)
      emit('submitHandler')
    }

    watchEffect(() => {
      if (props.currentGroupItem.id) {
        setTimeout(() => setFieldsValue(props.currentGroupItem), 0)
      } else {
        setTimeout(() => resetFields(), 0)
      }
    })

    return () => <BasicForm onRegister={register} onSubmit={onSubmit} onCloseModal={() => emit('cancelHandler')}></BasicForm>
  }
})
