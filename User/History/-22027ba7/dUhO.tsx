import { saveEvidenceGroup } from '@/api/cause-manage/evidence'
import { NButton, NFormItem, NInput, NSelect } from 'naive-ui'
import { queryEvidenceRuleTypes } from '@/api/setting/base-types'
import { IEvidenceGroupType } from '@/api/cause-manage/types'
export default defineComponent({
  name: 'SaveEvidence',
  props: {
    evidenceGroupItem: {
      type: Object as PropType<IEvidenceGroupType>,
      default: () => {}
    }
  },
  emits: ['okSubmitEvidenceGroup', 'cancelModalHandler'],
  setup(props, { emit }) {
    const state = reactive({
      evidenceRuleTypeSources: [] as any[],
      groupName: '',
      evidenceRuleType: '',
      remarks: ''
    })

    // 获取证据规则类型数据
    async function getEvidenceRuleData() {
      const res = await queryEvidenceRuleTypes()
      state.evidenceRuleTypeSources = res.map((item) => {
        return {
          label: item.name,
          value: item.id
        }
      })
    }

    const onSubmit = async () => {
      const params: IEvidenceGroupType = {
        id: props.evidenceGroupItem.id,
        name: state.groupName,
        evidenceRuleTypeId: state.evidenceRuleType
      }
      !props.evidenceGroupItem.id && delete params.id
      await saveEvidenceGroup(params)
      emit('okSubmitEvidenceGroup')
    }

    const cancelModal = async () => {
      emit('cancelModalHandler')
    }

    onMounted(() => {
      getEvidenceRuleData()
    })

    watchEffect(() => {
      if (props.evidenceGroupItem?.id) {
        state.groupName = props.evidenceGroupItem.name
        state.evidenceRuleType = props.evidenceGroupItem.evidenceRuleTypeId
      }
    })

    return () => (
      <div>
        <NFormItem label="分组名称">
          <NInput placeholder="请输入分组名称" v-model:value={state.groupName}></NInput>
        </NFormItem>
        <NFormItem label="证据规则类型">
          <NSelect placeholder="请选择证据规则类型" options={state.evidenceRuleTypeSources} v-model:value={state.evidenceRuleType}></NSelect>
        </NFormItem>
        <NFormItem label="备注">
          <NInput placeholder="请输入备注" v-model:value={state.remarks} />
        </NFormItem>
        <div class="text-right">
          <NButton class="mr-6" onClick={cancelModal}>
            取消
          </NButton>
          <NButton type="info" onClick={onSubmit}>
            提交
          </NButton>
        </div>
      </div>
    )
  }
})
