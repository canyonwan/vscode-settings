import { IEvidenceMenuType } from '@/api/cause-manage/types'
import { NTag, DataTableColumn } from 'naive-ui'
export const tableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 60
  },
  {
    title: '证据名称',
    key: 'name',
    width: 120
  },
  {
    title: '证据类型',
    key: 'evidenceTypeList',
    width: 120,
    render(row: IEvidenceMenuType) {
      return row.evidenceTypeList?.map((item) => item.name).join('、')
    }
  },
  {
    title: '分组时必传数',
    key: 'groupMiniRequire',
    width: 80
  },
  {
    title: '证明事项',
    key: 'provMatters',
    width: 90
  },
  {
    title: '是否必填',
    key: 'whetherRequire',
    width: 60,
    render(row: any) {
      return row.whetherRequire === 1 ? '必填' : '不必填'
    }
  },
  {
    title: '是否分组',
    key: 'whetherGroup',
    width: 50,
    render(row: any) {
      return row.whetherGroup === 1 ? '分组' : '不分组'
    }
  },
  {
    title: '提示语',
    key: 'tips',
    width: 100
  },
  {
    title: '备注',
    key: 'remarks',
    width: 100
  }
] as DataTableColumn[]
