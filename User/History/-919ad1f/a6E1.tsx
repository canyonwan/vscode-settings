import { bindEvidenceGroup, queryBoundEvidenceGroups } from '@/api/cause-manage/evidence'
import { IEvidenceGroupType } from '@/api/cause-manage/types'
import { BasicModal, useModal } from '@/components/modal'
import { NAlert, NButton, NEmpty, NList, NListItem } from 'naive-ui'
import useDynamicComp from '../../../options'
import { HandlingWayCommonPropsType, handlingWayCommonPropsType } from '../../../types'

export default defineComponent({
  name: 'Evidence',
  props: handlingWayCommonPropsType,
  setup(props: HandlingWayCommonPropsType) {
    const state = reactive({
      targetGroupId: '',
      boundEvidenceList: [] as IEvidenceGroupType[],
      boundEvidenceListKeys: [] as string[],
      evidenceGroupItem: {} as IEvidenceGroupType
    })

    const [modalRegister, { openModal, closeModal, setProps }] = useModal({
      title: '选择证据分组'
    })
    const { currentComp, onSwitchComp } = useDynamicComp()

    // 获取已绑定的证据清单列表
    const getBoundEvidenceGroups = async (id: string) => {
      const res = await queryBoundEvidenceGroups(id)
      state.boundEvidenceList = res
      state.boundEvidenceListKeys = res.map((item) => item.id!)
    }

    // 打开新增证据规则的modal
    const openAddEvidence = () => {
      openModal()
      onSwitchComp(10)
    }

    // 绑定完成handler
    const onOkBoundEvidenceGroupHandler = async (keys: string[]) => {
      closeModal()
      await bindEvidenceGroup({ sourceId: props.groupChild.id!, targetList: keys })
      await getBoundEvidenceGroups(props.groupChild.id!)
    }

    // 取消绑定分组
    const onCancelBindEvidenceGroup = () => {
      closeModal()
    }

    const viewEvidenceDetail = (record: IEvidenceGroupType) => {
      onSwitchComp(12)
      setProps({ title: '绑定证据分组' })
      state.evidenceGroupItem = record
      openModal()
    }

    watchEffect(() => {
      getBoundEvidenceGroups(props.groupChild.id!)
    })

    return () => (
      <div class="mt-6 mb-6" style="min-height: 300px">
        {state.boundEvidenceList.length === 0 ? (
          <NEmpty description="没有已经绑定的证据分组" style="min-height: 300px" />
        ) : (
          <>
            <NAlert title="已绑定的证据分组" type="info" closable class="mb-6">
              点击下方按钮查看详情
            </NAlert>
            <NList bordered>
              {state.boundEvidenceList.map((item, index) => (
                <NListItem
                  key={index}
                  v-slots={{
                    suffix: () => (
                      <NButton type="primary" size="small" onClick={() => viewEvidenceDetail(item)}>
                        查看详情
                      </NButton>
                    )
                  }}
                >
                  {item.name}
                </NListItem>
              ))}
            </NList>
          </>
        )}

        <NButton class="mt-10" type="success" onClick={openAddEvidence}>
          绑定证据分组
        </NButton>

        <BasicModal onRegister={modalRegister} style={{ width: '70%' }}>
          {h(currentComp.value, {
            useSelection: true,
            evidenceGroupItem: state.evidenceGroupItem,
            boundKeys: state.boundEvidenceListKeys,
            onCancelBindEvidenceGroup: onCancelBindEvidenceGroup,
            onSubmitBindEvidenceGroupHandler: onOkBoundEvidenceGroupHandler
          })}
        </BasicModal>
      </div>
    )
  }
})
