import { bindCauseTagsForPrimaryCause, queryAllCauseTags, queryCauseTagsFromPrimaryCause, saveCause } from '@/api/cause-manage/outdated/cause-manage'
import type { IPrimaryCauseItemType } from '@/api/cause-manage/types'
import type { ILawTagType } from '@/api/law/types'
import { NButton, NForm, NFormItem, NInput, NSpace, NTag } from 'naive-ui'
import { causeEventKey } from '../fooKey'
import useDynamicComp from '../options'
import { BasicModal, useModal } from '@/components/modal'
import { HandlingWayCommonPropsType, handlingWayCommonPropsType } from '../types'

export default defineComponent({
  name: 'PrimaryCause',
  props: handlingWayCommonPropsType,
  setup(props: HandlingWayCommonPropsType) {
    const bus = useEventBus(causeEventKey)
    const state = reactive({
      data: {} as IPrimaryCauseItemType, // 案由详情数据
      boundCauseTags: [] as ILawTagType[], // 已绑定的案由标签
      boundCauseTagKeys: [] as string[], // 已绑定的案由标签,用于回显Tree
      causeTagTreeData: [] as ILawTagType[] // 案由标签树Data
    })
    const { currentComp, onSwitchComp } = useDynamicComp()
    const [modalRegister, { openModal, closeModal }] = useModal({
      title: '选择案由标签',
      displayDirective: 'if'
    })

    // 查询主案由下的已经绑定所有案由标签
    async function getCauseTags() {
      const res = await queryCauseTagsFromPrimaryCause(state.data.id!)
      state.boundCauseTags = res
      state.boundCauseTagKeys = res.map((item) => item.id!)
    }

    // 打开案由标签modal
    async function onSelectCauseTags() {
      await queryCauseTags()
      onSwitchComp(1)
      openModal()
    }

    // 获取案由标签树
    async function queryCauseTags() {
      const res = await queryAllCauseTags()
      state.causeTagTreeData = processTreeData(res)
    }

    function processTreeData(data: ILawTagType[]) {
      if (data.length > 0) {
        for (const ele of data) {
          if (ele.list && ele.list.length > 0) {
            processTreeData(ele.list)
          } else {
            delete ele.list
          }
        }
      }
      return data
    }

    // 选中案由标签回调
    async function onSelectRawHandler(checkedAllKeys: string[]) {
      await bindCauseTagsForPrimaryCause({
        sourceId: state.data.id,
        targetList: checkedAllKeys
      })
      await getCauseTags()
      closeModal()
    }

    // 提交表单
    async function onSubmit() {
      const params: IPrimaryCauseItemType = {
        id: state.data.id,
        name: state.data.name
      }
      if (!state.data?.id) delete params.id
      await saveCause(params)
      bus.emit('submitHandler')
    }

    watchEffect(() => {
      state.data = { ...props.causeDetail }
      state.data?.id && getCauseTags()
    })
    return () => {
      return (
        <div>
          <NForm label-placement="left" labelWidth="auto">
            {/* cause name */}
            <NFormItem label="案由名称">
              <NInput type="textarea" v-model:value={state.data.name} placeholder="请输入案由名称"></NInput>
            </NFormItem>
            <NFormItem label="">
              <NButton type="success" onClick={onSubmit} class="ml-16 mb-10">
                保存
              </NButton>
            </NFormItem>
            {/* cause tag  */}
            <NFormItem label="案由标签" v-show={state.data?.id}>
              <NSpace vertical>
                <NButton type="primary" onClick={onSelectCauseTags}>
                  选择案由标签
                </NButton>
                <NSpace>
                  {state.boundCauseTags.map((item) => (
                    <NTag type="success" key={item.id}>
                      {item.name}
                    </NTag>
                  ))}
                </NSpace>
              </NSpace>
            </NFormItem>
          </NForm>
          <BasicModal onRegister={modalRegister} style={{ with: '70%' }}>
            {h(currentComp.value, {
              lawData: state.causeTagTreeData,
              checkedKeys: state.boundCauseTagKeys,
              useCheck: true,
              onOnSelectOk: onSelectRawHandler,
              onOnCloseModal: () => closeModal()
            })}
          </BasicModal>
        </div>
      )
    }
  }
})
