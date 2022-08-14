import { IDiscretionMenuType } from '@/api/cause-manage/types'
import { DataTableColumn } from 'naive-ui'
import { unitMap } from './options'

export const menuTableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 140
  },
  {
    title: '清单名称',
    key: 'name',
    width: 140
  },
  {
    title: '是否组区分',
    key: 'whetherGroupType',
    width: 100,
    render(row: IDiscretionMenuType) {
      return row.whetherGroupType === 1 ? '是' : '否'
    }
  },
  {
    title: '是否必选',
    key: 'whetherSelect',
    width: 100,
    render(row: IDiscretionMenuType) {
      return row.whetherSelect === 1 ? '是' : '否'
    }
  },
  {
    title: '选择类型 ',
    key: 'selectType',
    width: 100,
    render(row: IDiscretionMenuType) {
      return row.selectType === 2 ? '多选' : '单选'
    }
  },
  {
    title: '值类型 ',
    key: 'valueType',
    width: 100,
    render(row: IDiscretionMenuType) {
      return row.valueType === 2 ? '多个值' : '一个值'
    }
  },
  {
    title: '标准运算方式 ',
    key: 'operatorType',
    width: 120,
    render(row: IDiscretionMenuType) {
      return operatorTypeMap[row.operatorType]
    }
  },
  {
    title: '标准运算值 ',
    key: 'operatorValue',
    width: 100
  },
  {
    title: '提示语 ',
    key: 'tips',
    width: 100
  },
  {
    title: '证据类型 ',
    key: 'relaEvidenceTypeList',
    width: 100,
    render(row: IDiscretionMenuType) {
      return row.relaEvidenceTypeList?.map((item) => item.name).join(',')
    }
  },
  {
    title: '最小值 ',
    key: 'minValue',
    width: 100
  },
  {
    title: '最大值 ',
    key: 'maxValue',
    width: 100
  },
  {
    title: '单位 ',
    key: 'unit',
    width: 100,
    render(row: IDiscretionMenuType) {
      return unitMap[row.unit]
    }
  },
  {
    title: '备注',
    key: 'remarks',
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

export const tableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 140
  },
  {
    title: '清单名称',
    key: 'name',
    width: 140
  },
  {
    title: '是否组区分',
    key: 'whetherGroupType',
    width: 100,
    render(row: IDiscretionMenuType) {
      return row.whetherGroupType === 1 ? '是' : '否'
    }
  },
  {
    title: '是否必选',
    key: 'whetherSelect',
    width: 100,
    render(row: IDiscretionMenuType) {
      return row.whetherSelect === 1 ? '是' : '否'
    }
  },
  {
    title: '选择类型 ',
    key: 'selectType',
    width: 100,
    render(row: IDiscretionMenuType) {
      return row.selectType === 2 ? '多选' : '单选'
    }
  },
  {
    title: '值类型 ',
    key: 'valueType',
    width: 100,
    render(row: IDiscretionMenuType) {
      return row.valueType === 2 ? '多个值' : '一个值'
    }
  },
  {
    title: '标准运算方式 ',
    key: 'operatorType',
    width: 120,
    render(row: IDiscretionMenuType) {
      return operatorTypeMap[row.operatorType]
    }
  },
  {
    title: '标准运算值 ',
    key: 'operatorValue',
    width: 100
  },
  {
    title: '提示语 ',
    key: 'tips',
    width: 100
  },
  {
    title: '证据类型 ',
    key: 'relaEvidenceTypeList',
    width: 100,
    render(row: IDiscretionMenuType) {
      return row.relaEvidenceTypeList?.map((item) => item.name).join(',')
    }
  },
  {
    title: '最小值 ',
    key: 'minValue',
    width: 100
  },
  {
    title: '最大值 ',
    key: 'maxValue',
    width: 100
  },
  {
    title: '单位 ',
    key: 'unit',
    width: 100,
    render(row: IDiscretionMenuType) {
      return unitMap[row.unit]
    }
  },
  {
    title: '备注',
    key: 'remarks',
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
