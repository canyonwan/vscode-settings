import { IDocumentKeyConfig } from '@/api/document/types'
import { orderBy } from 'lodash-es'
/**
 * 动态引入组件
 * @param key
 * @returns
 */
export function getComponentByKey(key) {
  const viewsModules = import.meta.glob('/src/views/document/document-template/template/*.vue')
  return viewsModules[`/src/views/document/document-template/template/doc-${key}.vue`] || ''
}

/**
 * 获取分组占位的key集合 value
 * @param keys 分组占位key
 * @param sourceConfigList 数据源
 */
export function getGroupKeyValue(keys: string[], sourceConfigList: IDocumentKeyConfig[]): string {
  // 获取分组key的值
  let keyValueList = sourceConfigList.filter((item) => {
    return keys.includes(item.wordModelKey) && item.documentModelDataTypeId !== '1000007' && item.whetherUse === 1
  })
  const causeOrder: string[] = []
  for (const item of keyValueList) {
    // 标识违法行为id 在分组 在按照顺序排序
    item.causeId = item.englishName.match(/^[0-9]*/g)?.[0] || ''
    item.causeId && causeOrder.push(item.causeId)
    item.causeOrder = causeOrder.indexOf(item.causeId)
    item.sort = keys.indexOf(item.wordModelKey)
  }
  keyValueList = orderBy(keyValueList, ['causeOrder', 'sort'])
  return keyValueList
    .map((k) => {
      let str = k.defaultValue
      if (k.keyAttributeValues?.includes(1) || k.keyAttributeValues?.includes(4)) {
        // 换行
        str += '\n'
      }
      if (k.keyAttributeValues?.includes(7)) {
        // 冒号
        str += '：'
      }
      return str
    })
    .join('')
}
/**
 * 是否发起审批判断
 */
export function isSendApproval(currentId: string): boolean {
  const noSendIds = ['1000049', '1000037', '1000061'] // 不发起审批的文书模板集合
  return !noSendIds.includes(currentId)
}

/**
 * 返回绑定字段中违法行为属性类型的字段的模板key
 */
export function getCauseTypeName(configOutputList: IDocumentKeyConfig[]): string[] {
  const allCauseTypeName: string[] = []
  for (const paramItem of configOutputList) {
    if (paramItem.baseCauseAttId) {
      allCauseTypeName.push(paramItem.wordModelKey)
    }
  }
  return allCauseTypeName
}
