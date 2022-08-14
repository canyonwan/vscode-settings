import type { ICaseType, IUnlawfulActItem } from '@/api/cause-manage/types'
import type { IUnlawfulActWithWorkFlow } from '@/api/workflow/types'

export default function useSelectCaseTypes(row: IUnlawfulActItem, way: ICaseType, setupData: IUnlawfulActWithWorkFlow[], selectedWays: ICaseType[]) {
  // const setupData = ref<IUnlawfulActWithWorkFlow[]>([])
  // const selectedWays = ref<ICaseType[]>([])
  //
  // 判断当前的违法行为是否已经添加过一个了,如果已经有了 则不再重复添加违法行为id, 直接往处置方式列表里添加
  // const rowIndex = setupData.value.findIndex((l) => row.id === l.causeSubId)
  const rowIndex = setupData.findIndex((l) => row.groupId === l.groupId)
  // 当前点击的是否已经选中过了
  // 找到和当前点的方式相同的index和item
  const wayIndex = selectedWays.findIndex((f) => f.id === way.id)
  const wayItem = selectedWays.find((f) => f.id === way.id)

  // 这一行点击过 如果当前点击的方式是否已经存在了 就把以前的删掉, 加入现在的
  // 即 1.违法行为已经存在了
  if (rowIndex > -1) {
    // 2.当前点击的处置方式是否也选择过了
    if (wayIndex > -1 && wayItem) {
      const clickedIdx = setupData[rowIndex].caseTypeAndProgramTypeList.findIndex((a) => a.caseTypeId === wayItem!.id)
      selectedWays.splice(wayIndex, 1)
      // 当前点击的和之前添加的是一样的item 则删掉
      setupData[rowIndex].caseTypeAndProgramTypeList.splice(clickedIdx, 1)
      if (setupData[rowIndex].caseTypeAndProgramTypeList.length === 0) setupData.splice(rowIndex, 1)
      way === wayItem ? selectedWays.splice(wayIndex, 1) : selectedWays.push(way)
    } else {
      selectedWays.push(way)
      setupData[rowIndex].caseTypeAndProgramTypeList.push({
        caseTypeId: way.id,
        programTypeId: way.programTypeId!,
        programTypeName: way.programTypeName
      })
    }
  } else {
    const every = setupData.every((f) => {
      return (
        f.lawIds?.sort().toString() ===
        row.lawList
          .map((law) => law.id)
          .sort()
          .toString()
      )
    })
    if (!every) {
      window.$dialog.warning({
        title: '提示',
        content: '当前违法行为法下已有选择, 确定继续吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          setupData = []
          selectedWays = []
          selectedWays.push(way)
          setupData.push({
            causeSubId: row.id,
            groupId: row.groupId,
            lawIds: row.lawList.map((law) => law.id),
            caseTypeAndProgramTypeList: selectedWays.map((i) => {
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

        setupData.forEach((i) => {
          targetSonIndex = i.caseTypeAndProgramTypeList.findIndex((a) => a.caseTypeId === way.id)
          if (targetSonIndex > -1) {
            targetParentIndex = setupData.findIndex((p) => p.causeSubId === i.causeSubId)
          }
        })
        selectedWays.splice(wayIndex, 1)
        selectedWays.push(way) // 为了显示
        setupData[targetParentIndex].caseTypeAndProgramTypeList.splice(targetSonIndex, 1)
        if (setupData[targetParentIndex].caseTypeAndProgramTypeList.length === 0) {
          setupData.splice(targetParentIndex, 1)
        }
        // 删除以前的 添加现在的
        setupData.push({
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
        selectedWays.push(way)
        setupData.push({
          causeSubId: row.id,
          groupId: row.groupId,
          lawIds: row.lawList.map((law) => law.id),
          caseTypeAndProgramTypeList: selectedWays.map((i) => {
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

  return { setupData, selectedWays }
}
