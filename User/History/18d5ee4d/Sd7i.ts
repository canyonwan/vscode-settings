// 0: 案由法 1: 案由标签 2: 部门类型 3: 主案由组件 4: 子案由组件
// 5: 新增处置方式 6: 新增分组 7: 分组详情Tab 8: 机关选择树 9: 增加案由基本属性modal
// 10: 增加证据规则(选择证据清单列表)modal 11: 选择证据清单 12: 证据清单分页数据 13: 保存证据modal 14: 保存证据清单modal
// 15: 编辑裁量类型modal
const LawCauseComp = defineAsyncComponent(() => import('@/views/law/law-cause/index.vue'))
const LawTreeComp = defineAsyncComponent(() => import('@/views/law/components/law-tree-comp.vue'))
const BaseTypes = defineAsyncComponent(() => import('@/components/base-types/index.vue'))
const PrimaryCause = defineAsyncComponent(() => import('@/views/cause-library/manage/components/components/primary-cause'))
// const SubCause = defineAsyncComponent(() => import('@/views/cause-library/manage/components/sub-cause.vue'))
const SaveHandlingWay = defineAsyncComponent(() => import('@/views/cause-library/manage/components/components/save-handling-way'))
const SaveGroup = defineAsyncComponent(() => import('@/views/cause-library/manage/components/components/save-group'))
const GroupDetailTabs = defineAsyncComponent(() => import('@/views/cause-library/manage/components/components/group-details/group-detail-tabs'))
const OrgSelect = defineAsyncComponent(() => import('@/views/user/org-manage/components/org-select.vue'))
const SaveBaseAttrModal = defineAsyncComponent(() => import('@/views/cause-library/manage/components/components/group-details/base-attr/save-base-attr'))
const SelectEvidenceGroupModal = defineAsyncComponent(() => import('@/views/cause-library/evidence/group/index'))
const SelectEvidenceMenu = defineAsyncComponent(() => import('@/views/cause-library/evidence/menu/index'))
const EvidenceMenuManageModal = defineAsyncComponent(() => import('@/views/cause-library/evidence/group/bound-menus'))
const SaveEvidenceModal = defineAsyncComponent(() => import('@/views/cause-library/evidence/group/save-evidence'))
const SaveEvidenceMenuModal = defineAsyncComponent(() => import('@/views/cause-library/evidence/menu/save-evidence-menu'))
const SaveDiscretionTypeModal = defineAsyncComponent(() => import('@/views/cause-library/discretion/type/save-type'))
const SaveDiscretionMenuModal = defineAsyncComponent(() => import('@/views/cause-library/discretion/menu/save-menu.vue'))

const actionsMap = new Map()
  .set(0, LawCauseComp)
  .set(1, LawTreeComp)
  .set(2, BaseTypes)
  .set(3, PrimaryCause)
  // .set(4, SubCause)
  .set(5, SaveHandlingWay)
  .set(6, SaveGroup)
  .set(7, GroupDetailTabs)
  .set(8, OrgSelect)
  .set(9, SaveBaseAttrModal)
  .set(10, SelectEvidenceGroupModal)
  .set(11, SelectEvidenceMenu)
  .set(12, EvidenceMenuManageModal)
  .set(13, SaveEvidenceModal)
  .set(14, SaveEvidenceMenuModal)
  .set(15, SaveDiscretionTypeModal)
  .set(16, SaveDiscretionMenuModal)

export default function useDynamicComp() {
  // TIP: async component needs provide a default value!
  const currentComp = shallowRef(PrimaryCause)

  const onSwitchComp = (switchIndex: number) => {
    currentComp.value = actionsMap.get(switchIndex)
  }

  return { currentComp, onSwitchComp }
}
