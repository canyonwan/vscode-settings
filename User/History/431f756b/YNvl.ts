import { DataTableColumn } from 'naive-ui'
import type { ICauseSubListItemType } from '@/api/cause-manage/types'

export const causeTableColumns = [
  {
    title: '案由编号',
    key: 'identifier',
    width: 140
  },
  {
    title: '案由名称',
    key: 'name',
    width: 140
  },
  {
    title: '案由法',
    key: 'lawList',
    width: 140,
    render(row: ICauseSubListItemType) {
      return row.lawList.map((law) => law.lawName)
    }
  },
  {
    title: '违法主体',
    key: 'illegalSubject',
    width: 100
  },
  {
    title: '裁量得分',
    key: 'discretionScoreConf',
    width: 100,
    render(row: any) {
      return row.discretionScoreConf?.map((item) => item.discretionLevel).join(',')
    }
  }
] as DataTableColumn[]
