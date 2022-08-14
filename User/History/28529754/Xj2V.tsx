import { deleteGroupItem, deleteHandingWayItem, queryHandlingWayList } from '@/api/cause-manage/case-type'
import { NButton, NButtonGroup, NCollapse, NCollapseItem, NDivider, NSpace, NTag, useDialog } from 'naive-ui'
import { Ref } from 'vue'
import { BasicModal, useModal } from '@/components/modal'
import type { IGroupItemType, IHandlingWayType } from '@/api/cause-manage/types'
import useDynamicComp from '@/hooks/useDynamicComp'
import { HandlingWayCommonPropsType, handlingWayCommonPropsType } from '../types'

// 主案由 -> 法 -> 处置方式列表
export default defineComponent({
  name: 'HandlingWayList',
  props: handlingWayCommonPropsType,
  setup(props: HandlingWayCommonPropsType) {
    const state = reactive({
      handlingWays: [] as IHandlingWayType[], // 处置方式列表
      groupChild: {} as IGroupItemType, // 要编辑的分组id
      handlingWayItem: {} as IHandlingWayType
    })

    const dialog = useDialog()

    const { currentComp, onSwitchComp } = useDynamicComp()

    const [modalRegister, { openModal, closeModal, setProps }] = useModal({
      displayDirective: 'if'
    })

    // 获取处置方式列表
    const getHandlingWas = async (id: string) => {
      state.handlingWays = await queryHandlingWayList(id)
    }

    // 新增处置方式
    const addHandlingWay = () => {
      state.handlingWayItem.id = undefined
      setProps({ title: '新增处置方式' })
      openModal()
      onSwitchComp(5)
    }

    // 编辑处置方式
    const editHandlingWay = (e: MouseEvent, ele: IHandlingWayType) => {
      e.stopPropagation()
      setProps({ title: '编辑处置方式' })
      openModal()
      onSwitchComp(5)
      state.handlingWayItem = ele
    }

    // 为处置方式新增分组
    const addGroup = (item: IHandlingWayType, e: MouseEvent) => {
      e.stopPropagation()
      state.handlingWayItem = item
      setProps({ title: '新增分组' })
      state.groupChild.id = undefined
      openModal()
      onSwitchComp(6)
    }

    // 分组的编辑
    const editGrouping = (item: IHandlingWayType, groupChild: IGroupItemType, e: MouseEvent) => {
      e.stopPropagation()
      const { id } = groupChild
      const { id: lawId } = item
      state.groupChild.id = id
      state.handlingWayItem.id = lawId
      setProps({ title: '编辑分组' })
      openModal()
      onSwitchComp(6)
    }

    const onSaveGroupHandler = async () => {
      closeModal()
      await getHandlingWas(props.id)
    }

    // 删除处置方式
    const deleteHandlingWay = (id: string, e: MouseEvent) => {
      e.stopPropagation()
      dialog.error({
        title: '提示',
        content: '你确定要删除吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          await deleteHandingWayItem(id)
          await getHandlingWas(props.id)
        }
      })
    }

    const { groupChild, handlingWayItem } = toRefs(state)

    provide(
      'editState',
      readonly<{
        groupChild: Ref<IGroupItemType>
        handlingWayItem: Ref<IHandlingWayType>
      }>({ groupChild, handlingWayItem })
    )

    // 分组的详情
    const viewGroupingDetails = (groupId: string, handlingWayItem: IHandlingWayType) => {
      setProps({ title: '分组详情' })
      openModal()
      onSwitchComp(7)
      state.groupChild.id = groupId
      state.handlingWayItem = handlingWayItem
    }

    // 删除分组
    const deleteGrouping = async (id: string, e: MouseEvent) => {
      e.stopPropagation()
      dialog.error({
        title: '提示',
        content: '你确定要删除吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          await deleteGroupItem(id)
          await getHandlingWas(props.id)
        }
      })
    }

    const onSubmitEdit = async () => {
      closeModal()
      await getHandlingWas(props.id)
    }

    const randomTagColor = (name: string): 'default' | 'error' | 'info' | 'success' | 'warning' | 'primary' => {
      const options = {
        通用: 'success',
        部门: 'info',
        机关: 'error'
      }
      return options[name]
    }

    watchEffect(() => {
      props.id && getHandlingWas(props.id)
    })

    return () => (
      <>
        <NButton class="mb-6" type="success" onClick={addHandlingWay}>
          新增处置方式
        </NButton>
        {/* 列表 */}
        <NCollapse>
          {state.handlingWays.map((item, index) =>
            item.groupList.length > 0 ? (
              <NCollapseItem
                key={index}
                v-slots={{
                  header: () => item.caseTypeList?.map((ele, eleIndex) => ele.name + (eleIndex !== item.caseTypeList.length - 1 ? '、' : '')),
                  'header-extra': () => (
                    <NButtonGroup size="tiny">
                      {/* 分组的编辑和新增分组字段一样 */}
                      <NButton secondary type="primary" round onClick={(event) => editHandlingWay(event, item)}>
                        编辑
                      </NButton>
                      <NButton secondary type="success" onClick={(e) => addGroup(item, e)}>
                        新增分组
                      </NButton>
                      <NButton secondary type="error" round onClick={(e) => deleteHandlingWay(item.id!, e)}>
                        删除
                      </NButton>
                    </NButtonGroup>
                  )
                }}
              >
                {/* 分组 */}
                {item.groupList.map((groupItem, groupIndex) => {
                  let type: 'default' | 'error' | 'info' | 'success' | 'warning' | 'primary' = 'info'
                  type = randomTagColor(groupItem.groupName)
                  return groupItem.outputList.map((outputItem, outputIndex) => (
                    <NSpace class="ml-6" justify="space-between" key={outputIndex}>
                      <div class="mb-2">
                        {outputItem.name}
                        <NTag class="ml-5" key={groupIndex} type={type} size="small" round bordered={false}>
                          {groupItem.groupName}
                        </NTag>
                      </div>
                      <NButtonGroup size="tiny">
                        {/* 分组的编辑和新增分组字段一样 */}
                        <NButton secondary type="primary" round onClick={(e) => editGrouping(item, outputItem, e)}>
                          编辑
                        </NButton>
                        <NButton secondary type="success" round onClick={() => viewGroupingDetails(outputItem.id!, item)}>
                          详情
                        </NButton>
                        <NButton secondary round type="error" onClick={(e) => deleteGrouping(outputItem.id!, e)}>
                          删除
                        </NButton>
                      </NButtonGroup>
                    </NSpace>
                  ))
                })}
              </NCollapseItem>
            ) : (
              <>
                <NDivider />
                <NSpace justify="space-between">
                  <div>{item.caseTypeList?.map((ele, eleIndex) => ele.name + (eleIndex !== item.caseTypeList.length - 1 ? '、' : ''))}</div>
                  <NButtonGroup size="tiny">
                    {/* 分组的编辑和新增分组字段一样 */}
                    <NButton secondary type="primary" round onClick={(event) => editHandlingWay(event, item)}>
                      编辑
                    </NButton>
                    <NButton secondary type="success" onClick={(e) => addGroup(item, e)}>
                      新增分组
                    </NButton>
                    <NButton secondary type="error" round onClick={(e) => deleteHandlingWay(item.id!, e)}>
                      删除
                    </NButton>
                  </NButtonGroup>
                </NSpace>
              </>
            )
          )}
        </NCollapse>
        <BasicModal onRegister={modalRegister} style={{ width: '60%' }}>
          {h(currentComp.value, {
            groupChild: state.groupChild,
            handlingWayItem: state.handlingWayItem,
            onOkSaveGroup: onSaveGroupHandler,
            onCancelEdit: () => closeModal(),
            onSubmitEdit: onSubmitEdit
          })}
        </BasicModal>
      </>
    )
  }
})
