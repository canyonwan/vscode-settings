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
