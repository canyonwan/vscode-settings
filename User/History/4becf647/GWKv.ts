import { calcDiscretionSum } from '@/api/program/program'

export function useCalcMoney() {
  //
  const { discretionMoney } = await calcDiscretionSum(calcMoneyState!)
  bus.emit(discretionMoney)
}
