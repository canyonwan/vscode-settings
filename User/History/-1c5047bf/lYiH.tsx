import { NTabPane, NTabs } from 'naive-ui'
import { HandlingWayCommonPropsType, handlingWayCommonPropsType } from '../../types'
import Evidence from './evidence/evidence'
import BaseAttr from './base-attr/base-attr'
import Discretion from './discretion/discretion'

// 新增分组
export default defineComponent({
  name: 'GroupDetailTabs',
  props: handlingWayCommonPropsType,
  emits: ['cancelEdit', 'okSaveGroup', 'submitEdit'],
  setup(props: HandlingWayCommonPropsType) {
    const state = reactive({
      currentTab: 'baseAttr'
    })

    // 从这里分发, 将拿到的props转发给其他三个组件及子组件
    provide('dispatchHandlingWayProps', { ...props })

    return () => (
      <>
        <NTabs v-model:value={state.currentTab} justify-content="space-evenly" default-value="baseInfo" type="segment" size="small">
          <NTabPane display-directive="show" name="baseAttr" tab="文书数据">
            <BaseAttr {...props} />
          </NTabPane>
          <NTabPane display-directive="show" name="discretion" tab="裁量">
            <Discretion {...props} />
          </NTabPane>
          <NTabPane display-directive="show" name="evidence" tab="证据">
            <Evidence {...props} />
          </NTabPane>
        </NTabs>
      </>
    )
  }
})
