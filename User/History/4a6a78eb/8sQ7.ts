import type { IDiscretionMenuItem } from '@/api/program/types'

export function useFindRadioGroup(list: IDiscretionMenuItem[]) {
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

  function findIdByGroup(item: IDiscretionMenuItem[]) {
    let ids: string[] = []
    // 当前已有分组,递归循环查询所有子id
    for (const child of item) {
      // 判断当前选项是不是单选,如果是单选 push 到数组中(其他的可能不要管 要拿什么数据 就直接判断是不是那个想要的数据)
      if (child.selectType === 1) {
        ids.push(child.id)
      }
      // 判断当前还有没有子组,如果有继续递找id
      if (child.hashChildren === 1) {
        ids = [...ids, ...findIdByGroup(child.options)]
      }
    }
    return ids
  }
}
