import { DataTableColumn } from 'naive-ui'
import type { ICauseSubListItemType } from '@/api/cause-manage/types'

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
    key: 'penaltyObjectType',
    width: 140
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
    width: 100
  },
  {
    title: '部门类型',
    key: 'deptList',
    width: 100,
    render(row: ICauseSubListItemType) {
      return row.deptList.map((law, index) => `${law.lawName}${index === row.lawList.length - 1 ? '' : '、'}`)
    }
  },
  {
    title: '适用提示',
    key: 'tips',
    width: 100
  }
] as DataTableColumn[]
