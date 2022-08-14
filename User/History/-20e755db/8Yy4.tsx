import { bindDiscretionGroupForHandlingWayGroup, queryBoundDiscretionGroups } from '@/api/cause-manage/discretion'
import { ICommonBindParameterType, IDiscretionGroupType } from '@/api/cause-manage/types'
import { BasicModal, useModal } from '@/components/modal'
import { discretionGroupSwitchEventKey } from '@/views/cause-library/manage/outdated/fooKey'
import { PlusOutlined } from '@vicons/antd'
import { NButton, NCollapse, NIcon, NSpace } from 'naive-ui'
import AllDiscretionGroupList from '@/views/cause-library/discretion/group/components/group-list'
export default defineComponent({
  name: 'DiscretionGroupList',
  props: {
    groupId: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props) {
    const state = reactive({
      groupList: [] as IDiscretionGroupType[]
    })

    const [modalRegister, { openModal, closeModal }] = useModal({
      title: '绑定裁量分组'
    })
    const bus = useEventBus(discretionGroupSwitchEventKey)

    // 新增分组绑定
    const bindGroup = () => {
      openModal()
    }

    // 获取已经绑定的分组列表
    const getBoundGroupList = async (groupId: string) => {
      const res = await queryBoundDiscretionGroups(groupId)
      state.groupList = res
    }

    const viewMenu = (id: string) => {
      bus.emit(['menu', id])
    }

    const submitBind = async (keys: string[]) => {
      closeModal()
      const params: ICommonBindParameterType = {
        sourceId: props.groupId,
        targetList: keys
      }
      await bindDiscretionGroupForHandlingWayGroup(params)
      await getBoundGroupList(props.groupId)
    }

    watchEffect(() => {
      getBoundGroupList(props.groupId)
    })

    return () => (
      <div>
        <NCollapse>
          {state.groupList.map((item) => (
            <NSpace justify="space-between">
              <NButton text type="primary" key={item.id} v-slots={{ default: () => item.name }} onClick={() => viewMenu(item.id!)} />
            </NSpace>
          ))}
        </NCollapse>
        <NButton type="success" onClick={bindGroup}>
          绑定裁量分组
          <NIcon>
            <PlusOutlined />
          </NIcon>
        </NButton>
        <BasicModal onRegister={modalRegister} style="width: 70%">
          <AllDiscretionGroupList
            useCheckbox
            v-slots={{
              extraButton: (keys: string[]) => (
                <NButton class="mt-4 mb-4" type="primary" onClick={() => submitBind(keys)}>
                  确定绑定
                </NButton>
              )
            }}
          />
        </BasicModal>
      </div>
    )
  }
})
