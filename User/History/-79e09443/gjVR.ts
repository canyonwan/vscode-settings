import dayjs from 'dayjs'
import { getCurrentInstance, reactive } from 'vue'
// 执法统计  查询数据
export default function useSearchStatistics(): any {
  const searchData = reactive({
    isSameLevel: false, // 同级
    isSubordinate: false, // 下级
    orgId: undefined,
    startDate: '',
    endDate: ''
  })
  const internalInstance = getCurrentInstance()
  const paramsHandle = (param: any, isDistrictType: boolean, timeList?: string[]) => {
    const params = { ...param }
    // TODO: if (params?.orgId){
    if (params.orgId) {
      if (params.orgId === '1') {
        params.isSameLevel = true
        delete params.orgId
      } else if (params.orgId === '2') {
        params.isSubordinate = true
        delete params.orgId
      } else {
        if (isDistrictType) {
          params.isSubordinate = true
          params.orgId = searchData.orgId
        } else {
          params.orgId = searchData.orgId
        }
      }
    }
    if (timeList && timeList.length > 0) {
      // params.startDate = internalInstance?.appContext.config.globalProperties.$parseTime(timeList[0], '{y}-{m}-{d} 00:00:00')
      params.startDate = dayjs(timeList[0]).format('YYYY-MM-DD 00:00:00')
      params.endDate = dayjs(timeList[1]).format('YYYY-MM-DD 23:59:59')
      // params.endDate = internalInstance?.appContext.config.globalProperties.$parseTime(timeList[1], '{y}-{m}-{d} 23:59:59')
    }
    return params
  }
  return { searchData, paramsHandle }
}
