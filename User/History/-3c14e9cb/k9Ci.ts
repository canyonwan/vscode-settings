import { TreeItem } from '@/api/subject/org-manage'

export default function handleOrgTree(data: TreeItem[], parentOrg: TreeItem): any {
  parentOrg.childrenOrganizationInfoOutputs = data.filter((item: TreeItem) => item.belongJusticeOrgId === parentOrg.id)
  if (parentOrg.childrenOrganizationInfoOutputs && parentOrg.childrenOrganizationInfoOutputs.length) {
    for (const item of parentOrg.childrenOrganizationInfoOutputs) {
      handleOrgTree(data, item)
    }
  }
  return parentOrg.childrenOrganizationInfoOutputs
}
