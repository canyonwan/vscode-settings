<template>
  <div>
    <n-form labelPlacement="left" labelWidth="80px">
      <n-form-item label="分组类型"> <n-select :options="groupTypeSources" v-model:value="state.targetGroupType" /></n-form-item>

      <n-form-item label="绑定ID">
        <n-button @click="selectCaseType" :disabled="state.targetGroupType === '1'" type="primary">
          {{ state.targetGroupType === '2' ? '选择部门' : state.targetGroupType === '3' ? '选择机关' : '通用分组不可选择' }}
        </n-button>
      </n-form-item>

      <n-form-item label="分组名称">
        <n-input placeholder="请输入分组名称" v-model:value="state.groupName" />
      </n-form-item>
    </n-form>

    <div class="pt-4 text-right">
      <n-button class="ml-2" @click="() => emits('cancelEdit')"> 取消 </n-button>
      <n-button class="ml-2" @click="onSubmit" type="primary"> 确定 </n-button>
    </div>
    <basic-modal @register="modalRegister" style="width: 70%">
      <component
        :is="currentComp"
        @closeModal="() => closeModal()"
        @on-check="onOrgSelectHandler"
        :bindKeys="state.boundIds"
        :use-selection="true"
        @loadTableData="() => getDepartmentTreeData()"
        @selectedRowHandler="submitCheckedDeptTrees"
        @cancelModalHandler="() => closeModal()"
      />

      <!-- {h(currentComp.value, {
            // 机关
            onCloseModal: () => closeModal(),
            onOnCheck: onOrgSelectHandler,
            bindKeys: state.boundIds,
            // 部门
            useSelection: true,
            loadTableData: () => getDepartmentTreeData(),
            onSelectedRowHandler: submitCheckedDeptTrees,
            onCancelModalHandler: () => closeModal(),
            boundKeys: state.boundIds
          })} -->
    </basic-modal>
  </div>
</template>

<script setup lang="ts">
  import { queryGroupDetail, saveHandlingWayGroup } from '@/api/cause-manage/case-type'
  import type { ISaveHandlingWayGroupType } from '@/api/cause-manage/types'
  import { queryDepartmentTypes } from '@/api/setting/base-types'
  import { BasicModal, useModal } from '@/components/modal'
  import useDynamicComp from '../options'
  import { HandlingWayCommonPropsType, handlingWayCommonPropsType } from '../types'
  import { ICauseAttrItemType, IGroupItemType, IHandlingWayType, IPrimaryCauseItemType } from '@/api/cause-manage/types'
  const emits = defineEmits(['cancelEdit', 'submitEdit', 'okSaveGroup'])
  const props = defineProps({
    id: {
      type: String,
      default: ''
    },
    // 分组的child // 要编辑的
    groupChild: {
      type: Object as PropType<IGroupItemType>,
      default: () => {}
    },
    // 处置方式的案由id, 新增时用
    handlingWayItem: {
      type: Object as PropType<IHandlingWayType>,
      default: () => {}
    },
    targetItem: {
      type: Object as PropType<IHandlingWayType>,
      default: () => {}
    },
    causeDetail: {
      type: Object as PropType<IPrimaryCauseItemType>,
      default: () => {}
    },
    baseAttrItem: {
      type: Object as PropType<ICauseAttrItemType>,
      default: () => {}
    }
  })
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

  // 选择部门的回调
  const submitCheckedDeptTrees = (deptIds: string[]) => {
    console.log('deptIds', deptIds)
    state.boundIds = deptIds
    console.log('选择部门的回调', state.boundIds)
    closeModal()
  }

  // 保存
  const onSubmit = async () => {
    console.log('onSubmit', state.boundIds)
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
    emits('okSaveGroup')
    resetForm()
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

  onMounted(() => {
    getDepartmentTreeData()
  })

  watchEffect(() => {
    props.groupChild?.id ? getGroupDetail() : resetForm()
  })
</script>
