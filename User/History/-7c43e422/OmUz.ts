export const caseProgramType = [
  {
    label: '行政检查',
    value: 1
  },
  {
    label: '行政处罚',
    value: 2
  },
  {
    label: '行政强制',
    value: 3
  },
  {
    label: '移交移送',
    value: 4
  }
]

// 适用程序
export const punishProgramType = [
  {
    label: '简易程序',
    value: '1000000'
  },
  {
    label: '普通程序',
    value: '1000001'
  },
  {
    label: '强制措施',
    value: '1000002'
  },
  {
    label: '强制执行',
    value: '1000003'
  }
]
// 4:复议-不予受理
// 5:复议-告知
// 6:复议-转办
// 7:复议-维持
// 8:复议-撤销
// 9:复议-变更
// 10:复议-责令限期履行职责
// 11:复议-确认违法
// 12:复议-驳回
// 13:复议-中止
// 14:复议-调解
// 15;复议-未审结
// 16:复议-其他
// 复议
export const reconsiderationEnum = [
  {
    label: '复议-不予受理',
    value: '4'
  },
  {
    label: '复议-告知',
    value: '5'
  },
  {
    label: '复议-转办',
    value: '6'
  },
  {
    label: '复议-维持',
    value: '7'
  },
  {
    label: '复议-撤销',
    value: '8'
  },
  {
    label: '复议-变更',
    value: '9'
  },
  {
    label: '复议-责令限期履行职责',
    value: '10'
  },
  {
    label: '复议-确认违法',
    value: '11'
  },
  {
    label: '复议-驳回',
    value: '12'
  },
  {
    label: '复议-中止',
    value: '13'
  },
  {
    label: '复议-调解',
    value: '14'
  },
  {
    label: '复议-未审结',
    value: '15'
  },
  {
    label: '复议-其他',
    value: '16'
  }
]

// 程序阶段类型
export const StageTypeEnum = [
  {
    label: '立案',
    value: '1'
  },
  {
    label: '调查取证',
    value: '2'
  },
  {
    label: '事先告知',
    value: '3'
  },
  {
    label: '审核决定',
    value: '4'
  },
  {
    label: '送达执行',
    value: '5'
  },
  {
    label: '结案归档',
    value: '6'
  }
]

export const checkTargetType = [
  {
    label: '法人',
    value: '1000000'
  },
  {
    label: '公民',
    value: '1000001'
  },
  {
    label: '其他组织',
    value: '1000002'
  }
]
export const actionsMap = {
  1: ['基本属性', defineAsyncComponent(() => import('@/views/cause-browse/components/base-attr.vue'))],
  2: ['证据列表', defineAsyncComponent(() => import('@/views/cause-browse/components/evidence-list.vue'))],
  3: ['裁量计算', defineAsyncComponent(() => import('@/views/cause-browse/components/discretion-calc.vue'))]
}
