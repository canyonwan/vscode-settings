import type { IDiscretionMenuItem } from '@/api/program/types'

export function useFindRadioGroup(list: IDiscretionMenuItem[]) {
  const discretionElements: Recordable<string[]> = {}
  for (const item of list) {
    if (item.whetherGroupType === 1) {
      // 如果当前是组,判断子是否是组,是组继续递归, 不是组递归取id
      const hasNoGroup = item.options.filter((son) => son.whetherGroupType === 0).length
      if (hasNoGroup) {
        // 存在不是组的数据, 则是裁量选项
        discretionElements[item.id] = findIdByGroup(item.options)
      } else {
        findOption(item.options)
      }
    }
  }

  return { discretionElements }
}
