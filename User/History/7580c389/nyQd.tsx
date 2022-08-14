import { NCard, NGi, NGrid } from 'naive-ui'
import GroupList from './components/group-list'
import GroupTabs from './components/group-tabs'

export default defineComponent({
  name: 'DiscretionGroupIndex',
  setup() {
    provide('currentDiscretionGroupId', ref(''))
    return () => (
      <NGrid cols="5" responsive="screen" xGap="12">
        <NGi span="2">
          <NCard style={{ height: 'calc(100vh - ' + 130 + 'px)' }}>
            <GroupList />
          </NCard>
        </NGi>
        <NGi span="3">
          <NCard>
            <GroupTabs />
          </NCard>
        </NGi>
      </NGrid>
    )
  }
})
