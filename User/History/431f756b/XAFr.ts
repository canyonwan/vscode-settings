import { DataTableColumn } from 'naive-ui'

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
