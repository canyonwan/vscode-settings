import { calcDiscretionSum } from '@/api/program/program'
import type { ICalcDiscretionSumFormalParameter } from '@/api/program/types'
import { remove } from 'lodash'

export async function useCalcMoney(calcMoneyState: ICalcDiscretionSumFormalParameter) {
  remove(calcMoneyState!.checkedDiscretionDetail, (item) => {
    return item.operatorValue === null
  })
  console.log('%c [ calcMoneyState!.checkedDiscretionDetail ]-7', 'font-size:13px; background:pink; color:#bf2c9f;', calcMoneyState!.checkedDiscretionDetail)
  useDebounceFn(async () => {
    const bus = useEventBus('discretionElements')
    const res = await calcDiscretionSum(calcMoneyState!)
    bus.emit(res)
  }, 1200)()
}
