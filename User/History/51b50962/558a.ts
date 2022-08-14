import type { IDeletedEvidence, IDeletedIllegalAct, IDeletedNodeItem } from '@/api/program/types'

export function useCheckAll(checked: boolean, rubbish: Array<IDeletedNodeItem | IDeletedIllegalAct | IDeletedEvidence>): string[] {
  // 选中的集合
  const checkedChildren = ref<string[]>([])

  rubbish.forEach((item) => {
    if (checked) {
      if ('nodeId' in item) {
        checkedChildren.value = rubbish.map((item) => item['recyclingId'].toString())
      } else if ('caseTypeId' in item) {
        checkedChildren.value = rubbish.map((item) => `${item['causeId']}&${item['caseTypeId']}&${item['recyclingId']}`)
      } else if ('evidenceId' in item) {
        checkedChildren.value = rubbish.map((item) => item['recyclingId'].toString())
      }
    } else {
      checkedChildren.value.length = 0
    }
  })

  return checkedChildren.value
}