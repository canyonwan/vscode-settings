import type { IDeletedIllegalAct, IDeletedNodeItem } from '@/api/program/types'

type RubbishType = IDeletedNodeItem | IDeletedIllegalAct

export function useCheckAll(checked: boolean, rubbish: Array<IDeletedNodeItem | IDeletedIllegalAct>): number[] {
  // 选中的集合
  const checkedChildren = ref<number[]>([])

  rubbish.forEach((item) => {
    if (checked) {
      if ('nodeId' in item) {
        checkedChildren.value = rubbish!.map((item) => item['nodeId'])
      } else {
        checkedChildren.value.length = 0
      }
    }
  })

  return checkedChildren.value
}

// node name
function isNodeName(value: any): value is IDeletedNodeItem {
  return value.nodeId
}

// illegal act
function isIllegalAct(value: any): value is IDeletedIllegalAct {
  return value.punishId
}
