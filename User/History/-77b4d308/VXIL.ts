import type { ICaseType, IUnlawfulActItem } from '@/api/cause-manage/types'
import type { IUnlawfulActWithWorkFlow } from '@/api/workflow/types'

export default function useSelectCaseTypes(row: IUnlawfulActItem, way: ICaseType) {
  const setupData = ref<IUnlawfulActWithWorkFlow[]>([])
  const selectedWays = ref<ICaseType[]>([])
  //
  // 判断当前的违法行为是否已经添加过一个了,如果已经有了 则不再重复添加违法行为id, 直接往处置方式列表里添加
  // const rowIndex = setupData.value.findIndex((l) => row.id === l.causeSubId)
  const rowIndex = setupData.value.findIndex((l) => row.groupId === l.groupId)
  // 当前点击的是否已经选中过了
  // 找到和当前点的方式相同的index和item
  const wayIndex = selectedWays.value.findIndex((f) => f.id === way.id)
  const wayItem = selectedWays.value.find((f) => f.id === way.id)

  // 这一行点击过 如果当前点击的方式是否已经存在了 就把以前的删掉, 加入现在的
  // 即 1.违法行为已经存在了
  if (rowIndex > -1) {
    // 2.当前点击的处置方式是否也选择过了
    if (wayIndex > -1 && wayItem) {
      const clickedIdx = setupData.value[rowIndex].caseTypeAndProgramTypeList.findIndex((a) => a.caseTypeId === wayItem!.id)
      selectedWays.value.splice(wayIndex, 1)
      // 当前点击的和之前添加的是一样的item 则删掉
      setupData.value[rowIndex].caseTypeAndProgramTypeList.splice(clickedIdx, 1)
      if (setupData.value[rowIndex].caseTypeAndProgramTypeList.length === 0) setupData.value.splice(rowIndex, 1)
      way === wayItem ? selectedWays.value.splice(wayIndex, 1) : selectedWays.value.push(way)
    } else {
      selectedWays.value.push(way)
      setupData.value[rowIndex].caseTypeAndProgramTypeList.push({
        caseTypeId: way.id,
        programTypeId: way.programTypeId!,
        programTypeName: way.programTypeName
      })
    }
  } else {
    const every = setupData.value.every((f) => {
      return (
        f.lawIds?.sort().toString() ===
        row.lawList
          .map((law) => law.id)
          .sort()
          .toString()
      )
    })
    if (!every) {
      dialog.warning({
        title: '提示',
        content: '当前选中项已有？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          setupData.value = []
          selectedWays.value = []
          selectedWays.value.push(way)
          setupData.value.push({
            causeSubId: row.id,
            groupId: row.groupId,
            lawIds: row.lawList.map((law) => law.id),
            caseTypeAndProgramTypeList: selectedWays.value.map((i) => {
              return {
                caseTypeId: i.id,
                programTypeId: i.programTypeId!,
                programTypeName: i.programTypeName
              }
            })
          })
        },
        onNegativeClick: () => {
          return
        }
      })
    } else {
      if (wayIndex > -1 && wayItem) {
        // 当前这个way已经点击过了 需要从lastIds找到这个way
        let targetParentIndex = -1
        let targetSonIndex = -1

        setupData.value.forEach((i) => {
          targetSonIndex = i.caseTypeAndProgramTypeList.findIndex((a) => a.caseTypeId === way.id)
          if (targetSonIndex > -1) {
            targetParentIndex = setupData.value.findIndex((p) => p.causeSubId === i.causeSubId)
          }
        })
        selectedWays.value.splice(wayIndex, 1)
        selectedWays.value.push(way) // 为了显示
        setupData.value[targetParentIndex].caseTypeAndProgramTypeList.splice(targetSonIndex, 1)
        if (setupData.value[targetParentIndex].caseTypeAndProgramTypeList.length === 0) {
          setupData.value.splice(targetParentIndex, 1)
        }
        // 删除以前的 添加现在的
        setupData.value.push({
          causeSubId: row.id,
          groupId: row.groupId,
          lawIds: row.lawList.map((law) => law.id),
          caseTypeAndProgramTypeList: Array.of({
            caseTypeId: way.id,
            programTypeId: way.programTypeId!,
            programTypeName: way.programTypeName
          })
        })
      } else {
        selectedWays.value.push(way)
        setupData.value.push({
          causeSubId: row.id,
          groupId: row.groupId,
          lawIds: row.lawList.map((law) => law.id),
          caseTypeAndProgramTypeList: selectedWays.value.map((i) => {
            return {
              caseTypeId: i.id,
              programTypeId: i.programTypeId!,
              programTypeName: i.programTypeName
            }
          })
        })
      }
    }
  }
  emit('onSubmit', setupData.value)
}
