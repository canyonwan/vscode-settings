import { HandlingWayCommonPropsType, handlingWayCommonPropsType } from '@/views/cause-library/manage/components/types'
import { NAlert, NButton, NCard, NEmpty, NGi, NGrid, NList, NListItem } from 'naive-ui'
import { bindDiscretionGroupForHandlingWayGroup, queryBoundDiscretionGroups } from '@/api/cause-manage/discretion'
import { ICommonBindParameterType, IDiscretionGroupType } from '@/api/cause-manage/types'
import { BasicModal, useModal } from '@/components/modal'
import GroupList from '@/views/cause-library/discretion/group/components/group-list'
import GroupTabs from '@/views/cause-library/discretion/group/components/group-tabs'
import { discretionGroupSwitchEventKey } from '../../../fooKey'
export default defineComponent({
  name: 'DiscretionIndex',
  props: handlingWayCommonPropsType,
  setup(props: HandlingWayCommonPropsType) {
    const currentDiscretionGroupId = ref<string>('')
    const groupList = ref<IDiscretionGroupType[]>([])
    const useCheckbox = ref<boolean>(false)
    // 获取已经绑定的分组列表
    const getBoundGroupList = async (groupId: string) => {
      const res = await queryBoundDiscretionGroups(groupId)
      groupList.value = res
    }

    const [modalRegister, { openModal, closeModal }] = useModal({
      title: '查看详情'
    })

    const bus = useEventBus(discretionGroupSwitchEventKey)

    provide('currentDiscretionGroupId', readonly(currentDiscretionGroupId))

    const viewDetail = (id: string) => {
      currentDiscretionGroupId.value = id
      bus.emit(['menu', id])
      openModal()
      useCheckbox.value = false
    }

    // 绑定裁量分组
    const bindDiscretionGroup = () => {
      useCheckbox.value = true
      openModal()
    }

    const submitBind = async (keys: string[]) => {
      closeModal()
      const params: ICommonBindParameterType = {
        sourceId: props.groupChild.id!,
        targetList: keys
      }
      await bindDiscretionGroupForHandlingWayGroup(params)
      await getBoundGroupList(props.groupChild.id!)
    }

    watchEffect(() => {
      getBoundGroupList(props.groupChild.id!)
    })

    return () => (
      <div class="mt-6 mb-6" style="min-height: 300px">
        {groupList.value.length === 0 ? (
          <NEmpty description="没有已经绑定的裁量分组" class="justify-center" style="min-height: 300px" />
        ) : (
          <div>
            <NAlert title="已绑定的裁量分组" type="info" closable class="mb-6">
              点击下方按钮查看详情
            </NAlert>
            <NList bordered>
              {groupList.value.map((item, index) => (
                <NListItem
                  key={index}
                  v-slots={{
                    suffix: () => (
                      <NButton type="primary" size="small" onClick={() => viewDetail(item.id!)}>
                        查看详情
                      </NButton>
                    )
                  }}
                >
                  {item.name}
                </NListItem>
              ))}
            </NList>
          </div>
        )}
        <NButton class="mt-10" type="success" onClick={bindDiscretionGroup}>
          绑定裁量分组
        </NButton>
        <BasicModal onRegister={modalRegister} style="width: 70%">
          <NGrid cols="5" responsive="screen" xGap="12">
            <NGi span="2">
              <NCard>
                <GroupList
                  useCheckbox={useCheckbox.value}
                  checkedGroups={groupList.value.map((item) => item.id!)}
                  v-slots={{
                    extraButton: (keys: string[]) => (
                      <NButton class="mt-4 mb-4" type="primary" onClick={() => submitBind(keys)}>
                        确定绑定
                      </NButton>
                    )
                  }}
                />
              </NCard>
            </NGi>
            <NGi span="3">
              <NCard>
                <GroupTabs />
              </NCard>
            </NGi>
          </NGrid>
        </BasicModal>
      </div>
    )
  }
})
