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
          <NCard>
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
