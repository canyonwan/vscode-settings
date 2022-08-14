import { DataTableColumn } from 'naive-ui'
import type { ICauseSubListItemType } from '@/api/cause-manage/types'
import type { IBaseType } from '@/api/setting/types'
import { orgPropertiesOptionsA } from './options'

export const causeTableColumns = [
  {
    title: '案由编号',
    key: 'identifier',
    width: 80
  },
  {
    title: '案由名称',
    key: 'name',
    width: 140
  },
  {
    title: '检查对象类型',
    key: 'penaltyObjectTypeList',
    width: 140,
    render(row: ICauseSubListItemType) {
      return row.penaltyObjectTypeList?.map((target, index) => `${target.name}${index === row.penaltyObjectTypeList.length - 1 ? '' : '、'}`)
    }
  },
  {
    title: '违法主体',
    key: 'illegalSubject',
    width: 100
  },
  {
    title: '案由法',
    key: 'lawList',
    width: 140,
    render(row: ICauseSubListItemType) {
      return row.lawList.map((law, index) => `${law.lawName}${index === row.lawList.length - 1 ? '' : '、'}`)
    }
  },
  {
    title: '机关层级',
    key: 'orgProperties',
    width: 100,
    render(row: ICauseSubListItemType) {
      if (row.orgProperties?.length > 0) {
        const toArray = (row.orgProperties as string).split(',')
        const labelArr = toArray.map((item) => {
          for (const org of orgPropertiesOptionsA) {
            if (item === org.value) return org.label
          }
        })
        const res = labelArr.map((item, index) => `${item}${index === labelArr.length - 1 ? '' : '、'}`)
        return res
      }
    }
  },
  {
    title: '部门类型',
    key: 'deptList',
    width: 100,
    render(row: ICauseSubListItemType) {
      return row.deptList.map((dept: IBaseType) => dept.name)
    }
  },
  {
    title: '适用提示',
    key: 'tips',
    width: 100
  }
] as DataTableColumn[]
