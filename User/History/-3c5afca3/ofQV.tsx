import { deleteSubCauseBaseAttr, querySubCauseBaseAttr, sortBaseAttr } from '@/api/cause-manage/cause-manage'
import type { ICauseAttrItemType, ISubCauseBaseAttrType } from '@/api/cause-manage/types'
import { BasicModal, useModal } from '@/components/modal'
import { NButton, NButtonGroup, NCard, NEmpty, NGi, NGrid, NIcon, useDialog } from 'naive-ui'
import useDynamicComp from '../../../options'
import { HandlingWayCommonPropsType, handlingWayCommonPropsType } from '../../../types'
import Draggable from 'vuedraggable'
import { DeleteOutlined, EditOutlined } from '@vicons/antd'

// 基本属性
export default defineComponent({
  name: 'BaseAttr',
  props: handlingWayCommonPropsType,
  setup(props: HandlingWayCommonPropsType) {
    const state = reactive({
      targetId: '',
      dragTargetId: '',
      baseAttrItem: {} as ICauseAttrItemType,
      baseAttrList: [] as ISubCauseBaseAttrType[] // 基本属性集合
    })

    const dialog = useDialog()

    const [modalRegister, { openModal, closeModal, setProps }] = useModal({})

    const { currentComp, onSwitchComp } = useDynamicComp()

    const addBaseAttr = () => {
      setProps({ title: '新增案由基本属性' })
      openModal()
      onSwitchComp(9)
      state.baseAttrItem.id = undefined
      state.targetId = ''
    }

    const getBaseAttrList = async () => {
      const res = await querySubCauseBaseAttr(props.groupChild.id!)
      state.baseAttrList = res
    }

    // 编辑
    const editAttr = (item: ICauseAttrItemType) => {
      setProps({ title: '编辑案由基本属性' })
      openModal()
      onSwitchComp(9)
      state.targetId = item.id!
      state.baseAttrItem = item
    }

    // 删除
    const deleteAttr = async (id: string) => {
      dialog.error({
        title: '提示',
        content: '你确定要删除吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          await deleteSubCauseBaseAttr(id)
          await getBaseAttrList()
        }
      })
    }

    // 编辑完成回调
    const onOkEditHandler = () => {
      closeModal()
      getBaseAttrList()
    }

    // 开始拖动
    const onStartMove = (evt) => {
      state.dragTargetId = evt.draggedContext.element.id as string
    }

    // 结束拖动
    const onEndMove = async (e) => {
      const { oldIndex, newIndex } = e
      if (state.dragTargetId && newIndex !== oldIndex) {
        await sortBaseAttr({ sourceId: state.dragTargetId, index: newIndex })
      }
    }

    watchEffect(() => {
      getBaseAttrList()
    })

    return () => (
      <>
        <div class="mt-6 mb-6" style="min-height: 300px">
          {state.baseAttrList.length === 0 ? (
            <NEmpty description="还没有基本属性" style="min-height: 300px" />
          ) : (
            state.baseAttrList.map((item) => (
              <NCard hoverable title={item.name} class="mb-4" size="small">
                <Draggable
                  group={item.name}
                  list={item.causeAttrData}
                  itemKey="sortId"
                  animation="300"
                  onEnd={onEndMove}
                  move={onStartMove}
                  ghostClass="draggable-ghost"
                  v-slots={{
                    item: ({ element, index }) => (
                      <NGrid cols="7" class=" p-2 my-2  hover:cursor-move" key={index}>
                        <NGi span="1">
                          <NButtonGroup>
                            <NButton type="success" secondary strong size="small" onClick={() => editAttr(element)}>
                              {{
                                icon: () => (
                                  <NIcon>
                                    <EditOutlined />
                                  </NIcon>
                                )
                              }}
                            </NButton>
                            <NButton type="error" secondary strong size="small" onClick={() => deleteAttr(element.id!)}>
                              {{
                                icon: () => (
                                  <NIcon>
                                    <DeleteOutlined />
                                  </NIcon>
                                )
                              }}
                            </NButton>
                          </NButtonGroup>
                        </NGi>
                        <NGi span="6">
                          <p>{element.content}</p>
                        </NGi>
                      </NGrid>
                    )
                  }}
                ></Draggable>
              </NCard>
            ))
          )}
        </div>

        <NButton type="success" onClick={addBaseAttr}>
          增加基本属性
        </NButton>

        <BasicModal onRegister={modalRegister} style={{ width: '70%' }}>
          {h(currentComp.value, { id: state.targetId, baseAttrItem: state.baseAttrItem, onOkEdit: onOkEditHandler, onCancelEdit: () => closeModal() })}
        </BasicModal>
      </>
    )
  }
})
