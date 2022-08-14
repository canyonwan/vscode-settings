import { discretionGroupSwitchEventKey } from '@/views/cause-library/manage/fooKey'
import { NTabPane, NTabs, useMessage } from 'naive-ui'
import { Ref } from 'vue'
import MenuTable from '@/views/cause-library/discretion/group/components/components/menu-table'
import TypeTable from '@/views/cause-library/discretion/group/components/components/type-table'
export default defineComponent({
  name: 'DiscretionGroupTabs',
  setup() {
    const message = useMessage()
    const state = reactive({
      tabs: ['menu', 'type'],
      currentTab: 'menu'
    })
    const targetDiscretionGroupId = ref<string>('')
    const menuTableRef = ref<InstanceType<typeof MenuTable> | null>(null)
    const typeTableRef = ref<InstanceType<typeof TypeTable> | null>(null)

    const bus = useEventBus(discretionGroupSwitchEventKey)

    bus.on((data: [string, string]) => {
      state.currentTab = data[0]
      targetDiscretionGroupId.value = data[1]!

      data[1] && menuTableRef.value?.reload()
    })

    const injectCurrentDiscretionGroupId: Ref<string> = inject('currentDiscretionGroupId') || ref('')

    watch(
      () => injectCurrentDiscretionGroupId.value,
      () => {
        if (injectCurrentDiscretionGroupId && injectCurrentDiscretionGroupId.value !== targetDiscretionGroupId.value) {
          targetDiscretionGroupId.value = injectCurrentDiscretionGroupId.value
        }
      },
      {
        immediate: !!injectCurrentDiscretionGroupId.value
      }
    )

    provide('currentDiscretionGroupId', readonly(targetDiscretionGroupId))

    const onBeforeLeave = () => {
      if (!targetDiscretionGroupId.value) {
        message.warning('请从左侧左侧一项裁量分组')
        return false
      }
      return true
    }

    return () => (
      <NTabs onBeforeLeave={onBeforeLeave} v-model:value={state.currentTab} justify-content="space-evenly" default-value="baseInfo" type="line" size="small">
        {state.tabs.map((item) => (
          <NTabPane display-directive="if" key={item} name={item} tab={item === 'menu' ? '裁量清单' : '裁量类型'}>
            {{
              default: () => (item === 'menu' ? <MenuTable ref={menuTableRef} /> : <TypeTable ref={typeTableRef} />)
            }}
          </NTabPane>
        ))}
      </NTabs>
    )
  }
})
