import { queryEnums } from '@/api/workflow/model-manage'

export async function handleEnumsKeys(types: string[], isChange: Boolean = true) {
  const data: any = await queryEnums({ columnNameList: types })
  const enumsTypeData: any = {}
  if (data && data.length > 0) {
    for (const key of types) {
      enumsTypeData[key] = data.filter((item) => {
        if (item.pojoEntityName === key) {
          if (isChange) {
            item['label'] = item.enumChineseDescription
            item['value'] = item.enumCode
          }
          return item
        }
      })
    }
  }
  console.log('%c [ enumsTypeData ]-20', 'font-size:13px; background:#0095FF; color:white;', enumsTypeData)
  return { ...enumsTypeData }
}
