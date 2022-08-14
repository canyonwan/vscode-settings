import type { IDeletedEvidence, IDeletedIllegalAct, IDeletedNodeItem } from '@/api/program/types'

export function useCheckAll(checked: boolean, rubbish: Array<IDeletedNodeItem | IDeletedIllegalAct | IDeletedEvidence>): string[] {
  // 选中的集合
  const checkedChildren = ref<string[]>([])

  rubbish.forEach((item) => {
    if (checked) {
      if ('nodeId' in item) {
        checkedChildren.value = rubbish.map((item) => item['recyclingId'])
      } else if ('caseTypeId' in item) {
        // checkedChildren.value = rubbish.map((item) => item['punishId'])
        checkedChildren.value = rubbish.map((item) => `${item['causeId']}&${item['caseTypeId']}`)
      } else if ('evidenceId' in item) {
        checkedChildren.value = rubbish.map((item) => item['evidenceId'])
      }
    } else {
      checkedChildren.value.length = 0
    }
  })

  return checkedChildren.value
}
