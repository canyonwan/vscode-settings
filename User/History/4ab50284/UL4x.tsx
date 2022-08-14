import { Ref } from 'vue'
import { FormInst, NButton, NForm, NFormItem, NInputNumber, NRadio, NRadioGroup, NSpace, NTag, useMessage } from 'naive-ui'
import { BasicModal, useModal } from '@/components/modal'
import CaseTypeTrees from '@/views/setting/case-type/components/case-type-trees.vue'
import { TreeOptions } from 'naive-ui/lib/tree/src/interface'
import { ICaseType } from '@/api/setting/types'
import { saveHandlingWay } from '@/api/cause-manage/case-type'
import { IHandlingWayType } from '@/api/cause-manage/types'
import { HandlingWayCommonPropsType, handlingWayCommonPropsType } from '../types'
// 法 -> 处置方式 -> 组的编辑
export default defineComponent({
  name: 'SaveHandlingWay',
  props: handlingWayCommonPropsType,
  emits: ['cancelEdit', 'submitEdit', 'okSaveGroup'],
  setup(props: HandlingWayCommonPropsType, { emit }) {
    // 是否简易程序
    const simpleProgramSources = [
      {
        label: '是',
        value: '1000000'
      },
      {
        label: '否',
        value: ''
      }
    ]
    const state = reactive({
      data: {} as IHandlingWayType,
      // 案件类型
      caseTypeKeys: [] as string[], // 用于显示
      caseTypes: [] as ICaseType[],
      currentSimpleProgram: '', // 是否简易 是简易给1000000 不是给空
      minValue: undefined
    })

    const subCauseIds: Ref<any> = inject('subCauseIds')!
    const message = useMessage()

    const [modalRegister, { openModal, closeModal }] = useModal({
      title: '选择案件类型'
    })

    const onCheckedKeysHandler = (values: string[], options: TreeOptions[]) => {
      closeModal()
      state.caseTypeKeys = values
      state.caseTypes = options as []
    }

    const onSubmit = async () => {
      const { caseTypeKeys: targetId, currentSimpleProgram: programType, minValue } = state

      const params = {
        ...subCauseIds,
        targetId,
        programType: state.caseTypes.some((item) => item.id === '1000034') ? '1000000' : '',
        minValue
      }
      if (props.handlingWayItem.id) {
        params['id'] = props.handlingWayItem.id
      }
      if (targetId.length > 0) {
        await saveHandlingWay(params)
        emit('submitEdit')
      } else {
        message.warning('请选择案件类型')
      }
    }

    const formRef = ref<FormInst | null>()

    watchEffect(() => {
      // state.data = props.handlingWayItem
      if (props.handlingWayItem.id) {
        state.minValue = props.handlingWayItem.minValue
        state.currentSimpleProgram = props.handlingWayItem.programType === '1000000' ? '1000000' : ''
        state.caseTypes = props.handlingWayItem.caseTypeList?.map((item) => item)
        state.caseTypeKeys = props.handlingWayItem.caseTypeList?.map((item) => item.id!)
      }
    })

    const rule = {
      minValue: {
        required: true,
        trigger: ['input', 'blur'],
        validator() {
          if (state.caseTypes.some((item) => item.id === '1000034')) {
            if (!state.minValue) {
              return new Error('请输入最小值')
            }
          }
        }
      }
    }

    return () => {
      return (
        <>
          <NForm ref={formRef} labelPlacement="left" labelWidth="80px" model={state} rules={rule}>
            <NFormItem label="案件类型" path="targetId">
              <NSpace vertical>
                <NButton onClick={() => openModal()}>选择案件类型</NButton>
                <NSpace>
                  {state.caseTypes?.map((item, index) => (
                    <NTag type="primary" key={index}>
                      {item.name}
                    </NTag>
                  ))}
                </NSpace>
              </NSpace>
              {/* TAG 判断罚款用的名字,后端数据改了记得改这里 */}
              {/* TODO 1.选择罚款,才会出[是否简易 & 最小值] */}
            </NFormItem>
            {/* 选中的案件类型是[罚款（简易）1000034] 1.最小值必填 2.是否简易默认是 */}
            {state.caseTypes.some((item) => item.id === '1000034') && (
              <>
                <NFormItem label="最小值" path="minValue">
                  <NInputNumber placeholder="请输入最小值" v-model:value={state.minValue}></NInputNumber>
                </NFormItem>
              </>
            )}
          </NForm>

          <div class="pt-4 text-right">
            <n-button class="ml-2" onClick={() => emit('cancelEdit')}>
              取消
            </n-button>
            <n-button class="ml-2" onClick={onSubmit} type="primary">
              确定
            </n-button>
          </div>
          <BasicModal onRegister={modalRegister} style={{ width: '70%' }}>
            <CaseTypeTrees useCheckable={true} onOnCheckedKeysHandler={onCheckedKeysHandler} onOnCancelCheckKeys={() => closeModal()} />
          </BasicModal>
        </>
      )
    }
  }
})
