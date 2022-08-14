// 编辑基本属性
import { queryCauseBaseAtrForSelect } from '@/api/cause-manage/case-type'
import { saveSubCauseBaseAttr } from '@/api/cause-manage/outdated/cause-manage'
import { ICauseAttrItemType, IGroupItemType, IHandlingWayType } from '@/api/cause-manage/types'
import { FormInst, NButton, NForm, NFormItem, NInput, NInputNumber, NSelect, SelectOption } from 'naive-ui'
import { Ref, ToRefs } from 'vue'
import { HandlingWayCommonPropsType, handlingWayCommonPropsType } from '../../../types'
const dataWhetherGroup = [
  {
    label: '不分组',
    value: '0'
  },
  {
    label: '分组',
    value: '1'
  }
]
export default defineComponent({
  name: 'SaveBaseAttr',
  props: handlingWayCommonPropsType,
  emits: ['cancelEdit', 'okEdit'],
  setup(props: HandlingWayCommonPropsType, { emit }) {
    const state = reactive({
      baseAttrsForSelect: [] as SelectOption[],
      groupNumber: 0, // 分组编号
      whetherGroupBackValue: '0', // 数据是否组返回
      causeBaseAttrId: '',
      groupContent: '' // 分组内容
    })

    const formRef = ref<FormInst | null>(null)

    const editState: ToRefs<{ groupChild: Ref<IGroupItemType>; handlingWayItem: Ref<IHandlingWayType> }> = inject('editState')!

    // 获取该案件类型下的案由基本属性(for select)
    const getCauseBaseAttrForSelect = async () => {
      const ids = unref(editState.handlingWayItem).caseTypeList.map((item) => item.id!)
      const res = await queryCauseBaseAtrForSelect(ids)
      state.baseAttrsForSelect = res.map((item) => {
        return {
          label: item.name,
          value: item.id
        }
      })
    }

    // 初始化表单
    const resetForm = () => {
      state.groupNumber = 0
      state.groupContent = ''
      state.whetherGroupBackValue = ''
      state.causeBaseAttrId = ''
    }

    watchEffect(() => {
      if (props.baseAttrItem.id) {
        const { causeBasicAttrId, groupDifferentiation, dataGroup, content } = props.baseAttrItem
        state.causeBaseAttrId = causeBasicAttrId
        state.groupNumber = groupDifferentiation
        state.groupContent = content
        state.whetherGroupBackValue = dataGroup + ''
      } else {
        resetForm()
      }
      getCauseBaseAttrForSelect()
    })

    const onSubmit = () => {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          const { groupNumber: groupDifferentiation, whetherGroupBackValue: dataGroup, groupContent: content } = state
          const params: ICauseAttrItemType = {
            id: props.id,
            groupDifferentiation,
            causeBasicAttrId: state.causeBaseAttrId, // 案由基本属性id
            dataGroup,
            caseSubLawBindingId: unref(editState.groupChild).id!,
            content
          }
          !props.id && delete params.id
          await saveSubCauseBaseAttr(params)
          resetForm()
          emit('okEdit')
        }
      })
    }

    const rules2 = {
      causeBaseAttrId: {
        required: true,
        message: '案由基本属性必选',
        trigger: 'blur'
      },
      whetherGroupBackValue: {
        required: true,
        message: '是否组返回必选',
        trigger: 'blur'
      },
      groupContent: {
        required: true,
        message: '内容必填',
        trigger: 'blur'
      }
    }

    return () => (
      <NForm labelPlacement="left" labelWidth="120" model={state} ref={formRef} rules={rules2}>
        <NFormItem label="案由基本属性" path="causeBaseAttrId">
          <NSelect options={state.baseAttrsForSelect} placeholder="选择案由基本属性" v-model:value={state.causeBaseAttrId}></NSelect>
        </NFormItem>
        <NFormItem label="是否组返回" path="whetherGroupBackValue">
          <NSelect options={dataWhetherGroup} v-model:value={state.whetherGroupBackValue}></NSelect>
        </NFormItem>
        <NFormItem label="分组编号">
          <NInputNumber placeholder="请输入分组编号" v-model:value={state.groupNumber} clearable></NInputNumber>
        </NFormItem>
        <NFormItem label="内容" path="groupContent">
          <NInput type="textarea" placeholder="请输入内容" v-model:value={state.groupContent}></NInput>
        </NFormItem>
        <div class="pt-4 text-right">
          <NButton class="ml-2" onClick={() => emit('cancelEdit')}>
            取消
          </NButton>
          <NButton class="ml-2" onClick={onSubmit} type="primary">
            保存
          </NButton>
        </div>
      </NForm>
    )
  }
})
