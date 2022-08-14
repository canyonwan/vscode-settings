import type { IDeletedIllegalAct, IDeletedNodeItem } from '@/api/program/types'
type rubbishType = IDeletedNodeItem | IDeletedIllegalAct

export function useCheckAll(checked: boolean, rubbish: rubbishType[]) {
  switch (rubbish === 'IDeletedNodeItem') {
    case value:
      break

    default:
      break
  }
  // 是否全选
  const whetherCheckedAll = ref<boolean>(false)
  // 选中的集合
  const checkedChildren = ref<number[]>([])
  //
  whetherCheckedAll.value = checked
  //
  if (whetherCheckedAll.value) {
    checkedChildren.value = rubbish!.map((item) => item.nodeId)
  } else {
    checkedChildren.value.length = 0
  }
}
