export const lawEnforcerColumn = [
  // {
  //   title: '序号',
  //   dataIndex: 'sort',
  //   width: 60
  // },
  {
    title: '单位名称',
    dataIndex: 'departname',
    width: 200,
    ellipsis: true
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 200,
    ellipsis: true
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 60,
    ellipsis: true
  },
  {
    title: '执法证号',
    dataIndex: 'certifNumber',
    width: 120,
    ellipsis: true
  },
  {
    title: '执法领域',
    dataIndex: 'enforcementType',
    width: 120,
    ellipsis: true
  },
  {
    title: '执法区域',
    dataIndex: 'supervisionRegion',
    width: 120,
    ellipsis: true
  }
]

// 执法监督人员
export const supervisorsColumn = [
  // {
  //   title: '序号',
  //   dataIndex: 'sort',
  //   width: 60
  // },
  {
    title: '单位名称',
    dataIndex: 'departname',
    width: 200,
    ellipsis: true
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 200,
    ellipsis: true
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 60,
    ellipsis: true
  },
  {
    title: '监督证号',
    dataIndex: 'certifNumber',
    width: 120,
    ellipsis: true
  },
  {
    title: '监督领域',
    dataIndex: 'enforcementType',
    width: 120,
    ellipsis: true
  },
  {
    title: '监督区域',
    dataIndex: 'supervisionRegion',
    width: 120,
    ellipsis: true
  }
]

// 执法主体
export const subjectColumn = [
  // {
  //   title: '序号',
  //   dataIndex: 'sort',
  //   width: 60
  // },
  {
    title: '执法部门',
    dataIndex: 'lawDepartment',
    width: 200,
    ellipsis: true
  },
  {
    title: '执法主体',
    dataIndex: 'lawMaint',
    width: 200,
    ellipsis: true
  },
  {
    title: '行政许可',
    dataIndex: 'allowance',
    width: 80,
    ellipsis: true
  },
  {
    title: '行政处罚',
    dataIndex: 'punish',
    width: 80,
    ellipsis: true
  },
  {
    title: '行政强制',
    dataIndex: 'compel',
    width: 80,
    ellipsis: true
  },
  {
    title: '征收征用',
    dataIndex: 'collection',
    width: 80,
    ellipsis: true
  },
  {
    title: '行政检查',
    dataIndex: 'inspect',
    width: 80,
    ellipsis: true
  }
]

// 执法事项
export const matterPermitColumn = [
  // {
  //   title: '序号',
  //   dataIndex: 'sort',
  //   width: 60
  // },
  {
    title: '事项名称',
    dataIndex: 'authorityName',
    width: 250,
    ellipsis: true
  },
  {
    title: '实施单位', // 部门也是实施单位
    dataIndex: 'laworganName',
    width: 150,
    ellipsis: true
  },
  {
    title: '执法类别',
    dataIndex: 'lawtypeCode',
    width: 130,
    ellipsis: true
  }
]

export const typeList = [
  {
    type: 1,
    text: '执法人员',
    icon: require('@/assets/publicity-platform/before/zhifarenyuan.svg'),
    column: lawEnforcerColumn
  },
  {
    type: 2,
    text: '执法监督人员',
    icon: require('@/assets/publicity-platform/before/zhifajiandurenyuan.svg'),
    column: supervisorsColumn
  },
  {
    type: 3,
    text: '执法主体',
    icon: require('@/assets/publicity-platform/before/zhifazhuti.svg'),
    column: subjectColumn
  },
  {
    type: 4,
    text: '执法事项',
    icon: require('@/assets/publicity-platform/before/zhifashixiang.svg'),
    column: matterPermitColumn
  },
  {
    type: 5,
    text: '执法流程',
    icon: require('@/assets/publicity-platform/before/zhifaliucheng.svg'),
    column: []
  }
]

// 执法事项-行政处罚
export const matterPunishColumn = [
  // {
  //   title: '序号',
  //   dataIndex: 'sort',
  //   width: 60
  // },
  {
    title: '事项名称',
    dataIndex: 'authorityName',
    width: 250,
    ellipsis: true
  },
  {
    title: '执法部门名称',
    dataIndex: 'laworganName',
    width: 150,
    ellipsis: true
  },
  {
    title: '执法主体名称',
    dataIndex: 'mainName',
    width: 150,
    ellipsis: true
  },
  {
    title: '执法类别',
    dataIndex: 'lawtypeCode',
    width: 100,
    ellipsis: true
    // customRender: ({ text, reocrd }: any): any => {
    //   return {
    //     children: reocrd.lawtypeCode === 110 ? '行政许可' : text === 120 ? '行政处罚' : text === 130 ? '行政强制' : text === 160 ? '行政检查' : '征收征用'
    //   }
    // }
  },
  {
    title: '罚没许可证号',
    dataIndex: 'punishLicensenumber',
    width: 120,
    ellipsis: true
  }
]

// 执法事项-行政强制/行政检查/征用征收
export const matterOtherColumn = [
  // {
  //   title: '序号',
  //   dataIndex: 'sort',
  //   width: 60
  // },
  {
    title: '事项名称',
    dataIndex: 'authorityName',
    width: 250,
    ellipsis: true
  },
  {
    title: '执法部门名称',
    dataIndex: 'laworganName',
    width: 150,
    ellipsis: true
  },
  {
    title: '执法主体名称',
    dataIndex: 'mainName',
    width: 150,
    ellipsis: true
  },
  {
    title: '执法类别',
    dataIndex: 'lawtypeCode',
    width: 100,
    ellipsis: true
  }
]
