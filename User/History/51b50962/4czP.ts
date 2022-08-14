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
      }
    } else {
      checkedChildren.value.length = 0
    }
  })

  return checkedChildren.value
}

function whetherNodeName(value: any): value is IDeletedNodeItem {
  return value.nodeId
}
