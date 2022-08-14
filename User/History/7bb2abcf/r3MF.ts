import { calcDiscretionSum } from '@/api/program/program'
import type { ICalcDiscretionSumFormalParameter } from '@/api/program/types'
import { remove } from 'lodash'

export async function useCalcMoney(calcMoneyState: ICalcDiscretionSumFormalParameter) {
  const calcLoading = ref(false)
  // 计算前判断是否有 operatorValue 为null的项
  calcLoading.value = true
  remove(calcMoneyState!.checkedDiscretionDetail, (item) => {
    return item.operatorValue === null
  })

  useDebounceFn(async () => {
    const bus = useEventBus('discretionElements')
    const res = await calcDiscretionSum(calcMoneyState!)
    calcLoading.value = false
    bus.emit(res)
  }, 1000)()
}
