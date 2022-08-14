import type { IDeletedIllegalAct, IDeletedNodeItem, IEvidenceItem } from '@/api/program/types'
type rubbishType = IDeletedNodeItem & IDeletedIllegalAct

export function useCheckAll(checked: boolean, rubbish: rubbishType[]): number[] {
  // 选中的集合
  const checkedChildren = ref<number[]>([])
  // //
  // whetherCheckedAll.value = checked
  //
  if (checked) {
    checkedChildren.value = rubbish!.map((item) => item.nodeId)
  } else {
    checkedChildren.value.length = 0
  }

  rubbish.forEach((item) => {
    if (checked) {
      if (whetherNodeName(item.nodeId)) {
        //
        checkedChildren.value = rubbish!.map((item) => item.nodeId)
      }
    } else {
      checkedChildren.value.length = 0
    }
  })

  return checkedChildren.value
}

// node name
function whetherNodeName(value: any): value is IDeletedNodeItem {
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
