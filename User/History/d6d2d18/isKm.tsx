import { queryGroupDetail, saveHandlingWayGroup } from '@/api/cause-manage/case-type'
import type { ISaveHandlingWayGroupType } from '@/api/cause-manage/types'
import { queryDepartmentTypes } from '@/api/setting/base-types'
import { BasicModal, useModal } from '@/components/modal'
import { FormInst, NButton, NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import useDynamicComp from '../options'
import { HandlingWayCommonPropsType, handlingWayCommonPropsType } from '../types'

// 新增分组
export default defineComponent({
  name: 'SaveGroup',
  props: handlingWayCommonPropsType,
  emits: ['cancelEdit', 'submitEdit', 'okSaveGroup'],
  setup(props: HandlingWayCommonPropsType, { emit }) {
    // 分组类型 1通用2部门3机关
    const groupTypeSources = [
      {
        label: '通用',
        value: '1'
      },
      {
        label: '部门',
        value: '2'
      },
      {
        label: '机关',
        value: '3'
      }
    ]
    const state = reactive({
      targetGroupType: '1', // 操作的目标源类型 前端通过类型名判断 有用,1通用2部门3机关
      boundIds: [] as string[], // 绑定id
      groupName: '', // 分组名称
      groupDetail: {} as ISaveHandlingWayGroupType
    })

    const formRef = ref<FormInst | null>(null)

    const { currentComp, onSwitchComp } = useDynamicComp()

    const [modalRegister, { openModal, closeModal, setProps }] = useModal({
      title: '选择部门',
      displayDirective: 'if'
    })

    // 获取部门类型数据
    async function getDepartmentTreeData() {
      const res = await queryDepartmentTypes()
      return res
    }

    const selectCaseType = () => {
      openModal()
      state.targetGroupType === '3' && setProps({ title: '选择机关' })
      const index = state.targetGroupType === '3' ? 8 : Number(state.targetGroupType)
      console.log('index', index)
      onSwitchComp(index)
    }

    // 选择机关的回调
    const onOrgSelectHandler = (orgIds: string[]) => {
      state.boundIds = orgIds
      console.log('orgIds', orgIds)
      closeModal()
    }

    const submitCheckedDeptTrees = (deptIds: string[]) => {
      console.log('deptIds', deptIds)
      state.boundIds = deptIds
      console.log('选择部门的回调', state.boundIds)
      closeModal()
    }

    // 保存
    const onSubmit = async () => {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          const { causeId, causeSubId } = state.groupDetail
          const { groupName: name, targetGroupType: type, boundIds: typeId } = state
          const params: ISaveHandlingWayGroupType = {
            lawId: props.handlingWayItem.id!,
            causeId,
            causeSubId,
            name,
            type,
            typeId
          }
          if (!props.groupChild?.id) {
            params.causeId = props.handlingWayItem.causeId
            params.causeSubId = props.handlingWayItem.causeSubId
          }
          props.groupChild.id && (params.id = props.groupChild.id)
          await saveHandlingWayGroup(params)
          emit('okSaveGroup')
          resetForm()
        } else {
          console.log(errors)
        }
      })
    }

    const resetForm = () => {
      state.boundIds.length = 0
      state.groupName = ''
    }

    // 查看分组详情数据
    const getGroupDetail = async () => {
      const res = await queryGroupDetail(props.groupChild.id!)
      state.groupDetail = res
      const { type, name, typeId } = state.groupDetail
      state.targetGroupType = type + ''
      state.groupName = name
      state.boundIds = typeId
    }

    const rules = {
      groupName: {
        required: true,
        message: '请输入分组名称',
        trigger: 'blur'
      }
    }

    watch(
      () => props.groupChild?.id,
      () => {
        // 有id 就是编辑分组 否则是新增,重置表单
        props.groupChild?.id ? getGroupDetail() : resetForm()
      },
      { immediate: true }
    )

    return () => (
      <>
        <NForm labelPlacement="left" labelWidth="80px" ref={formRef} rules={rules} model={state}>
          <NFormItem label="分组类型">
            <NSelect options={groupTypeSources} v-model:value={state.targetGroupType}></NSelect>
          </NFormItem>

          <NFormItem label="绑定ID">
            <NButton onClick={selectCaseType} disabled={state.targetGroupType === '1'} type="primary">
              {state.targetGroupType === '2' ? '选择部门' : state.targetGroupType === '3' ? '选择机关' : '通用分组不可选择'}
            </NButton>
          </NFormItem>

          <NFormItem label="分组名称" path="groupName">
            <NInput placeholder="请输入分组名称" v-model:value={state.groupName} />
          </NFormItem>
        </NForm>

        <div class="pt-4 text-right">
          <NButton class="ml-2" onClick={() => emit('cancelEdit')}>
            取消
          </NButton>
          <NButton class="ml-2" onClick={onSubmit} type="primary">
            确定
          </NButton>
        </div>
        <BasicModal onRegister={modalRegister} style={{ with: '70%' }}>
          {h(currentComp.value, {
            // 机关
            onCloseModal: () => closeModal(),
            onOnCheck: onOrgSelectHandler,
            // 部门
            useSelection: true,
            loadTableData: () => getDepartmentTreeData(),
            onSelectedRowHandler: submitCheckedDeptTrees,
            onCancelModalHandler: () => closeModal(),
            boundKeys: state.boundIds
          })}
        </BasicModal>
      </>
    )
  }
})
