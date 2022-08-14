import { IDiscretionMenuItem } from '@/api/program/types'
import { useCalcMoney } from './useCalcMoney'

export function useRadio(currentItemId: IDiscretionMenuItem, list: Recordable<string[]>, target: ICalcDiscretionSumFormalParameter) {
  const { id: optionId } = state.value!
  for (const key in discretionElements) {
    for (const str of discretionElements[key]) {
      if (optionId === str) {
        const index = calcMoneyState!.checkedDiscretionDetail.findIndex((ele) => ele.id === optionId)
        if (index > -1) {
          calcMoneyState!.checkedDiscretionDetail.splice(index, 1)
        } else {
          calcMoneyState!.checkedDiscretionDetail.push({ id: optionId, operatorValue: state.value?.operatorValue })
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
}
