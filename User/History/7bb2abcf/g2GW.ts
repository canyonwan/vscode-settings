import { calcDiscretionSum } from '@/api/program/program'
import type { ICalcDiscretionSumFormalParameter } from '@/api/program/types'
import { remove } from 'lodash'

export async function useCalcMoney(calcMoneyState: ICalcDiscretionSumFormalParameter) {
  const calcLoading = ref(true)
  // 计算前判断是否有 operatorValue 为null的项
  remove(calcMoneyState!.checkedDiscretionDetail, (item) => {
    return item.operatorValue === null
  })

  useDebounceFn(async () => {
    const bus = useEventBus('discretionElements')
    const res = await calcDiscretionSum(calcMoneyState!)
    bus.emit(res)
    calcLoading.value = false
    console.log('%c [ calcLoading.value ]-18', 'font-size:13px; background:#0095FF; color:white;', calcLoading.value)
  }, 1000)()

  return calcLoading
}
