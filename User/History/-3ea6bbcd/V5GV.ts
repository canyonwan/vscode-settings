import { TreeItem } from '@/api/subject/org-manage'

export default function handleOrgTree(data: TreeItem[], parentList: TreeItem[]): any {
  for (const child of parentList) {
    let isJusticeChild = {} as any
    child.childrenOrganizationInfoOutputs =
      data.filter((item: TreeItem) => {
        if (item.id === child.id) {
          isJusticeChild = item
        }
        if (item.belongJusticeOrgId === child.id) {
          return item
        }
      }) || []

    if (child.childrenOrganizationInfoOutputs && child.childrenOrganizationInfoOutputs.length) {
      const children = handleOrgTree(data, child.childrenOrganizationInfoOutputs)
      child.childrenOrganizationInfoOutputs = [{ ...isJusticeChild, id: isJusticeChild.id + 'self', childrenOrganizationInfoOutputs: [] }, ...children]
    }
    // if (child.organizationName === '保定市司法局') {
    //   child.organizationName = child.organizationName.replace('保定市司法局', '市直机关')
    // } else {
    //   child.organizationName = child.organizationName.replace('司法局', '')
    // }
  }
  return parentList
}
