import type { ICalcDiscretionSumFormalParameter, IDiscretionMenuItem } from '@/api/program/types'
import { useCalcMoney } from '@/views/program/discretion/composables/useCalcMoney'

export function useRadio(state: IDiscretionMenuItem, discretionElements: Recordable<string[]>) {
  const calcMoneyState = inject<ICalcDiscretionSumFormalParameter>('calcMoneyState')
  const { id: optionId } = state
  for (const key in discretionElements) {
    for (const str of discretionElements[key]) {
      if (optionId === str) {
        const index = calcMoneyState!.checkedDiscretionDetail.findIndex((ele) => ele.id === optionId)
        if (index > -1) {
          calcMoneyState!.checkedDiscretionDetail.splice(index, 1)
        } else {
          calcMoneyState!.checkedDiscretionDetail.push({ id: optionId, operatorValue: state.operatorValue })
          discretionElements[key]
            .filter((ele) => ele !== optionId)
            .forEach((partner) => {
              const index = calcMoneyState!.checkedDiscretionDetail.findIndex((item) => item.id === partner)
              if (index > -1) {
                calcMoneyState!.checkedDiscretionDetail.splice(index, 1)
              }
            })
        }
      }
    }
  }
  useCalcMoney(calcMoneyState!)
  return { calcMoneyState }
}
