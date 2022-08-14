import type { IProgramItem } from '@/api/program/types'
import { format } from 'date-fns'
import { DataTableColumn } from 'naive-ui'

// 检查
export const inspectColumns = [
  {
    title: '序号',
    key: 'id',
    width: 60
  },
  {
    title: '检查时间',
    key: 'createTime',
    width: 140,
    render: (rowData: any) => {
      return rowData.createTime ? format(rowData.createTime, 'yyyy-MM-dd') : ''
    }
  },
  {
    title: '检查地址',
    key: 'address',
    width: 100
  },
  {
    title: '检查对象',
    key: 'targetName',
    width: 100
  },
  {
    title: '对象类型',
    key: 'targetTypeName',
    width: 100
  },
  {
    title: '任务来源',
    key: '',
    width: 100
  },
  {
    title: '执法人员',
    key: 'handingPeopleEntity',
    width: 100,
    render: (row: IProgramItem) => {
      return row.handingPeopleEntity.map((item) => `${item.realName || ''}(${item.deptName || ''} - ${item.enforceCode || ''})、`)
    }
  },
  {
    title: '检查事项',
    key: '',
    width: 100
  },
  {
    title: '是否产生案件',
    key: '',
    width: 100
  },
  {
    title: '记录方式',
    key: '',
    width: 100
  }
] as DataTableColumn[]

// 处罚
export const punishColumns = [
  {
    title: '序号',
    key: 'id',
    width: 60
  },
  {
    title: '立案日期',
    key: 'name',
    width: 120,
    render: (rowData: any) => {
      return rowData.createTime ? format(rowData.createTime, 'yyyy-MM-dd') : ''
    }
  },
  {
    title: '违法行为人',
    key: 'targetName',
    width: 200
  },
  {
    title: '案件名称',
    key: 'unlawfulAct',
    width: 100
  },
  {
    title: '处罚方式',
    key: 'caseType',
    width: 100
  },
  {
    title: '程序类型',
    key: 'programTypeName',
    width: 100
  },
  {
    title: '办案人员',
    key: 'handingPeopleEntity',
    width: 100,
    render: (row: IProgramItem) => {
      return row.handingPeopleEntity.map((item) => `${item.realName || ''}(${item.deptName || ''} - ${item.enforceCode || ''})、`)
    }
  },
  {
    title: '决定书送达日期',
    key: 'whetherGroupType',
    width: 150
  },
  {
    title: '决定书文号',
    key: 'whetherGroupType',
    width: 130
  },
  {
    title: '罚没金额(万元)',
    key: 'whetherGroupType',
    width: 100
  },
  {
    title: '结案日',
    key: 'whetherGroupType',
    width: 100
  }
] as DataTableColumn[]

// force
export const forceColumns = [
  {
    title: '违法行为人',
    key: 'targetName',
    width: 120
  },
  {
    title: '案件名称',
    key: 'unlawfulAct',
    width: 140
  },
  {
    title: '强制措施种类',
    key: '',
    width: 100
  },
  {
    title: '强制执行种类',
    key: '',
    width: 100
  },
  {
    title: '办案人员',
    key: 'handingPeopleEntity',
    width: 100,
    render: (row: IProgramItem) => {
      return row.handingPeopleEntity.map((item) => `${item.realName || ''}(${item.deptName || ''} - ${item.enforceCode || ''})、`)
    }
  },

  {
    title: '强制措施决定书送达日期',
    key: '',
    width: 300
  },
  {
    title: '强制执行决定书送达日期',
    key: '',
    width: 100
  },
  {
    title: '复议结果',
    key: '',
    width: 100
  },
  {
    title: '诉讼结果',
    key: '',
    width: 100
  }
] as DataTableColumn[]

// hand-over
export const handOverColumns = [
  {
    title: '违法行为人',
    key: 'targetName',
    width: 120
  },
  {
    title: '案件名称',
    key: 'name',
    width: 140
  },
  {
    title: '移送机关',
    key: '',
    width: 100
  },
  {
    title: '司法机关是否受理',
    key: '',
    width: 100
  },
  {
    title: '办案人员',
    key: 'handingPeopleEntity',
    width: 100,
    render: (row: IProgramItem) => {
      return row.handingPeopleEntity.map((item) => `${item.realName || ''}(${item.deptName || ''} - ${item.enforceCode || ''})、`)
    }
  }
] as DataTableColumn[]
