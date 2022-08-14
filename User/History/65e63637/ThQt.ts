import type { ICalcDiscretionSumFormalParameter, IDiscretionMenuItem } from '@/api/program/types'
import { useCalcMoney } from './useCalcMoney'

export function useRadio(state: IDiscretionMenuItem, discretionElements: Recordable<string[]>, target: ICalcDiscretionSumFormalParameter) {
  const { id: optionId } = state
  for (const key in discretionElements) {
    for (const str of discretionElements[key]) {
      if (optionId === str) {
        const index = target!.checkedDiscretionDetail.findIndex((ele) => ele.id === optionId)
        if (index > -1) {
          target!.checkedDiscretionDetail.splice(index, 1)
        } else {
          target!.checkedDiscretionDetail.push({ id: optionId, operatorValue: state.operatorValue })
          discretionElements[key]
            .filter((ele) => ele !== optionId)
            .forEach((partner) => {
              const index = target!.checkedDiscretionDetail.findIndex((item) => item.id === partner)
              if (index > -1) {
                target!.checkedDiscretionDetail.splice(index, 1)
              }
            })
        }
      }
    }
  }
  useCalcMoney(target)
}
