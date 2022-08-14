import { saveEvidenceGroup } from '@/api/cause-manage/evidence'
import { NButton, NForm, NFormItemGi, NGrid, NInput, NSelect } from 'naive-ui'
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
        remarks: state.remarks,
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
        state.remarks = props.evidenceGroupItem.remarks!
      }
    })
    const formRef = ref<FormInst | null>(null)
    const rules = {}

    return () => (
      <div>
        <NForm ref={formRef} model={state} rules={rules}>
          <NGrid cols="24" x-gap="24">
            <NFormItemGi label="分组名称" span="12" path="groupName">
              <NInput placeholder="请输入分组名称" v-model:value={state.groupName}></NInput>
            </NFormItemGi>
            <NFormItemGi label="证据规则类型" span="12" path="evidenceRuleTypeSources">
              <NSelect placeholder="请选择证据规则类型" options={state.evidenceRuleTypeSources} v-model:value={state.evidenceRuleType}></NSelect>
            </NFormItemGi>
            <NFormItemGi label="备注" span="12">
              <NInput placeholder="请输入备注" v-model:value={state.remarks} />
            </NFormItemGi>
          </NGrid>
        </NForm>
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
