import type { IDeletedIllegalAct, IDeletedNodeItem } from '@/api/program/types'
type NodeNameType = IDeletedNodeItem
type IllegalActType = IDeletedIllegalAct

export function useCheckAll<T>(checked: boolean, rubbish: T[]) {
  switch (T instanceof IDeletedNodeItem) {
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
