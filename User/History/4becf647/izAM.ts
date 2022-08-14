import { calcDiscretionSum } from '@/api/program/program'

export async function useCalcMoney() {
  const bus = useEventBus('discretionElements')
  const { discretionMoney } = await calcDiscretionSum(calcMoneyState!)
  bus.emit(discretionMoney)
}
