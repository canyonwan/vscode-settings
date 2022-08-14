import type { ICaseType, IEvidenceMenuType, IUnlawfulActItem } from '@/api/cause-manage/types'
import { DataTableColumn, DataTableColumns, NRadio, NRadioGroup, NSpace } from 'naive-ui'
import { RowData } from 'naive-ui/lib/data-table/src/interface'

export const createColumns = ({
  sendMail,
  allowSelect,
  ids
}: {
  sendMail: (values: string, row: IUnlawfulActItem, son: ICaseType[]) => void
  allowSelect: boolean
  ids: string[]
}): DataTableColumns<RowData> => {
  return [
    {
      title: '案由编号',
      key: 'identifier',
      width: 90
    },
    {
      title: '案由名称',
      key: 'name',
      width: 120
    },

    {
      title: '案由法',
      key: 'lawList',
      width: 140,
      render(row: IUnlawfulActItem) {
        return row.lawList?.map((law, index) => `${law.lawName}${index === row.lawList!.length - 1 ? '' : '、'}`)
      }
    },
    {
      title: '处置方式',
      key: 'caseTypeList',
      // width: 200,
      render(row: IUnlawfulActItem) {
        const canSelectRows = row.caseTypeList?.map((ele) => {
          return h(
            NSpace,
            {},
            {
              default: () => {
                return [
                  `${ele.name}： `,
                  h(
                    NRadioGroup,
                    { value: ids },
                    // { onUpdateValue: (value: string) => sendMail(value, row, ele.list), value: ids },
                    { default: () => ele.list.map((e) => h(NRadio, { label: e.name, value: e.id })) }
                    // { onUpdateValue: (values: string[]) => sendMail(values, row.identifier), value: ids },
                    // { default: () => ele.list.map((e) => h(NCheckbox, { label: e.name, value: `${row.identifier}-${e.id}` })) }
                  )
                ]
              }
            }
          )
        })

        const not = row.caseTypeList?.map((ele, index) => `${ele.name}：${ele.list.map((minor) => minor.name)}${index === row.caseTypeList!.length - 1 ? '' : '、'}`)

        return allowSelect ? canSelectRows : not
      }
    },
    {
      title: '检查对象类型',
      key: 'penaltyObjectTypeList',
      width: 140,
      render(row: IUnlawfulActItem) {
        return row.penaltyObjectTypeList?.map((target, index) => `${target.name}${index === row.penaltyObjectTypeList!.length - 1 ? '' : '、'}`)
      }
    },
    {
      title: '机关层级',
      key: 'orgPropertiesList',
      width: 140,
      render(row: IUnlawfulActItem) {
        return row.orgPropertiesList?.map((target, index) => `${target.name}${index === row.orgPropertiesList!.length - 1 ? '' : '、'}`)
      }
    },
    {
      title: '违法主体描述',
      key: 'illegalSubject',
      width: 140
    }
  ]
}

export const tableColumns = [
  {
    title: '案由编号',
    key: 'identifier',
    width: 90
  },
  {
    title: '案由名称',
    key: 'name',
    width: 120
  },

  {
    title: '案由法',
    key: 'lawList',
    width: 140,
    render(row: IUnlawfulActItem) {
      return row.lawList?.map((law, index) => `${law.lawName}${index === row.lawList!.length - 1 ? '' : '、'}`)
    }
  },
  {
    title: '处置方式',
    key: 'caseTypeList',
    // width: 140,
    render(row: IUnlawfulActItem) {
      const rows = row.caseTypeList?.map((ele) => {
        // return h(NTag, {}, { default: () => ele.name })
        // return h(NCheckbox, { label: ele.name, value: ele.id })
        return h(
          NSpace,
          {},
          {
            default: () => {
              // return [`${ele.name}： `, ele.list.map((e) => h(NCheckbox, { label: e.name, value: e.id }))]
              return [`${ele.name}： `, h(NCheckboxGroup, {}, { default: () => ele.list.map((e) => h(NCheckbox, { label: e.name, value: e.id })) })]
            }
          }
        )

        // return h(
        //   'div',
        //   {},
        //   {
        //     default: () =>
        //       h(
        //         NCheckboxGroup,
        //         {},
        //         {
        //           default: () =>
        //             ele.list.map((e) => {
        //               return h(NCheckbox, { label: e.name, value: e.id })
        //             })
        //         }
        //       )
        //   }
        // )
      })
      console.log({ rows })
      return rows
    }

    // render(row: IUnlawfulActItem) {
    //   return row.caseTypeList?.map((ele, index) => `${ele.name}：${ele.list.map((minor) => minor.name)}${index === row.caseTypeList!.length - 1 ? '' : '、'}`)
    // }
  },
  {
    title: '检查对象类型',
    key: 'penaltyObjectTypeList',
    width: 140,
    render(row: IUnlawfulActItem) {
      return row.penaltyObjectTypeList?.map((target, index) => `${target.name}${index === row.penaltyObjectTypeList!.length - 1 ? '' : '、'}`)
    }
  },
  {
    title: '机关层级',
    key: 'orgPropertiesList',
    width: 140,
    render(row: IUnlawfulActItem) {
      return row.orgPropertiesList?.map((target, index) => `${target.name}${index === row.orgPropertiesList!.length - 1 ? '' : '、'}`)
    }
  },
  {
    title: '违法主体描述',
    key: 'illegalSubject',
    width: 140
  }
] as DataTableColumn[]

export const evidenceColumns = [
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
      // return row.evidenceTypeList?.map((item, i) => item.name).join('、')
      return row.evidenceTypeList?.map((target, index) => `${target.name}${index === row.evidenceTypeList!.length - 1 ? '' : '、'}`)
    }
  },
  {
    title: '证明事项',
    key: 'provMatters',
    width: 90
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
