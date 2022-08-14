import { calcDiscretionSum } from '@/api/program/program'
import type { ICalcDiscretionSumFormalParameter } from '@/api/program/types'

export async function useCalcMoney(calcMoneyState: ICalcDiscretionSumFormalParameter) {
  useDebounceFn(() => {
    const bus = useEventBus('discretionElements')
    const { discretionMoney } = await calcDiscretionSum(calcMoneyState!)
    bus.emit(discretionMoney)
  }, 1000)
}
