import type { ICauseSubListItemType, IPrimaryCauseItemType } from '@/api/cause-manage/types'
import type { ILawItemType } from '@/api/law/types'
import { NForm } from 'naive-ui'
import { Transition } from 'vue'
import { causeManageKey } from '../fooKey'
import useDynamicComp from '@/hooks/useDynamicComp'
export default defineComponent({
  name: 'CauseActions',
  setup() {
    const { currentComp, onSwitchComp } = useDynamicComp()
    const bus = useEventBus(causeManageKey)
    // tips: 使用h函数渲染并进行props传参的时候,如果传入的是ref对象,那么在接收的时候需要.value(因为接收到是一个RefImpl对象)
    const causeDetail = ref<IPrimaryCauseItemType | ILawItemType>()
    bus.on((data: [number, IPrimaryCauseItemType | ICauseSubListItemType]) => {
      onSwitchComp(data[0])
      causeDetail.value = data[1]
    })

    return () => (
      <NForm label-placement="left" class="mt-4">
        <Transition name="fade" mode="out-in">
          {h(currentComp.value, { causeDetail: causeDetail.value })}
        </Transition>
      </NForm>
    )
  }
})
