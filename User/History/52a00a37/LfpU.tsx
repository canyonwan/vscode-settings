import { queryAllEvidenceType, saveEvidenceMenu } from '@/api/cause-manage/evidence'
import type { IEvidenceMenuType } from '@/api/cause-manage/types'
import { BasicForm, useForm } from '@/components/form'
import { saveEvidenceSchemas } from '@/views/cause-library/evidence/options'
import { NSelect } from 'naive-ui'

export default defineComponent({
  name: 'SaveEvidenceMenu',
  props: {
    evidenceMenuItem: {
      type: Object as PropType<IEvidenceMenuType>,
      default: () => {}
    }
  },
  emits: ['okSaveEvidenceMenu'],
  setup(props, { emit }) {
    const [register, { setFieldsValue, resetFields }] = useForm({
      gridProps: { cols: 2 },
      labelWidth: 110,
      layout: 'horizontal',
      schemas: saveEvidenceSchemas,
      submitButtonText: '提交',
      buttonPosition: 'end'
    })

    const state = reactive({
      evidenceTypes: [] as any[],
      selectedEvidenceTypeIds: [] as string[] // 选择的证据类型ids
    })

    const getEvidenceTypes = async () => {
      const res = await queryAllEvidenceType()
      state.evidenceTypes = res.map((item) => {
        return {
          label: item.name,
          value: item.id
        }
      })
    }

    const handleSubmit = async (values: IEvidenceMenuType) => {
      const params: IEvidenceMenuType = {
        ...values,
        relaEvidenceType: state.selectedEvidenceTypeIds.join(',')
      }
      !props.evidenceMenuItem.id && delete params.id
      // if (!props.evidenceMenuItem.id || props.evidenceMenuItem?.addSecondaryMenu) {
      //   delete params.id
      //   params.parentId = props.evidenceMenuItem?.id
      // }
      await saveEvidenceMenu(params)
      emit('okSaveEvidenceMenu')
    }

    onMounted(() => {
      getEvidenceTypes()
    })

    watchEffect(() => {
      if (Object.keys(props.evidenceMenuItem).length > 0) {
        setTimeout(() => setFieldsValue(props.evidenceMenuItem), 0)
        state.selectedEvidenceTypeIds = props.evidenceMenuItem.relaEvidenceType.length > 0 ? props.evidenceMenuItem.relaEvidenceType.split(',') : []
      } else {
        setTimeout(() => {
          resetFields()
          state.selectedEvidenceTypeIds = []
        }, 0)
      }
    })

    return () => (
      <BasicForm onRegister={register} onSubmit={handleSubmit}>
        {{
          evidenceTypeSlots: () => <NSelect options={state.evidenceTypes} multiple v-model:value={state.selectedEvidenceTypeIds} />
        }}
      </BasicForm>
    )
  }
})
