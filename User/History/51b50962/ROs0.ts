import type { IDeletedIllegalAct, IDeletedNodeItem } from '@/api/program/types'

type RubbishType = IDeletedNodeItem & IDeletedIllegalAct

export function useCheckAll(checked: boolean, rubbish: RubbishType[]): number[] {
  // 选中的集合
  const checkedChildren = ref<number[]>([])

  rubbish.forEach((item) => {
    if (checked) {
      if (isNodeName(item.nodeId)) {
        checkedChildren.value = rubbish!.map((item) => item.nodeId)
      } else if (isIllegalAct(item.punishId)) {
        checkedChildren.value = rubbish!.map((item) => item.punishId)
      }
    } else {
      checkedChildren.value.length = 0
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

// evidence material
function isEvidence(value: any): value is IDeletedNodeItem {
  return value.nodeId
}

// doc
function isDocument(value: any): value is IDeletedNodeItem {
  return value.nodeId
}
