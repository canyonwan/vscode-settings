// 选择其他程序回调
// TODO 选择其他程序时 timeline树没有被调用
function dispatchRelatedProgram(id: string, programType: number) {
  if (programTypeId.value === 2 && showStageBar.value) {
    stageId.value = 1
    timeLineRef.value.filterTimelineNodes()
  } else {
    showStageBar.value = false
    updateTimeLine()
  }
  debugger
  // showStageBar.value && stageBarBus.emit(1)
  programTypeId.value = programType
  timelineId.value = id ? id : programDetail.value!.timeLineId
  // timeLineRef.value.getTimelineList()
}
