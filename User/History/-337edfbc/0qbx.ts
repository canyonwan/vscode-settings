/**
 * @description BasicForm  自定义列的componentDataSourceType 类型判断获取列的数据源
 */
import { queryDictionaries } from '@/api/setting/dictionaries'
import { queryPosition } from '@/api/user/position'
import { queryDepartmentTypes, queryProgramTypes, queryCauseBaseAttrs } from '@/api/setting/base-types'
import type { FormSchema } from '@/components/form/src/types/form-type'
import { queryIndustry } from '@/api/target/industry'
import { queryAllEvidenceType } from '@/api/cause-manage/evidence'
import { queryAllDiscretionCalculateType, queryAllDiscretionType } from '@/api/cause-manage/discretion'
import type { IGroupItemType } from '@/api/cause-manage/types'
import { queryParamTypes } from '@/api/document/param-type'
import { queryDocumentTypes } from '@/api/document/document-type'
import { queryUseWordTypes } from '@/api/document/use-word'
import { getApproveType } from '@/api/approval/approval-type'
import type { IBaseType } from '@/api/setting/types'
import { queryRole } from '@/api/authority/role-set'
import { useUserStore } from '@/store/modules/user'
import { queryModelType } from '@/api/workflow/model-type'
import { queryEnums } from '@/api/workflow/model-manage'
import { queryTipTypeData } from '@/api/tip/tip-type'
import { queryTargetTypes } from '@/api/target/target-type'
import { ITargetType } from '@/api/target/types'
import { ICauseType } from '@/api/law/types'
import { queryCauseTypes } from '@/api/cause-manage/cause-manage'

/**
 * @description BasicForm  自定义列的componentDataSourceType 类型判断获取列的数据源
 */
const schemaDataHandle = async (schema: FormSchema[]) => {
  if (schema && schema.length) {
    const dictionariesKeys: string[] = [] // 字典的key 集合
    let isHavePosition = false // 职位类型
    let isHaveDept = false // 部门类型
    let isHaveIndustry = false // 行业类型
    let isHasProgramType = false // 程序类型
    let isHasEvidenceType = false // 证据类型
    let isHasDiscretionType = false // 裁量类型
    let isHasDiscretionCalculateType = false // 裁量计算类型
    let isDocumentModelDataType = false // 文书数据类型
    let isDocumentModelType = false // 文书类型
    let isDocumentModelUseWord = false // 文书使用"字"
    let isApprovalType = false // 文书审批类型
    let isRoleType = false // 角色类型
    let isModelType = false // 模型类型
    let isTipType = false // 提示信息类型
    let isCaseAttrType = false // 违法行为基本属性类型
    let isCheckedTargetType = false // 检查对象类型
    let isCauseTypeEnum = false // 违法行为类型
    const enumsNameList: string[] = [] // 枚举name的集合
    for (const item of schema) {
      if (item.componentDataSourceType === 'Dictionaries' && item.componentDataSourceName) {
        // 是字典类的
        dictionariesKeys.push(item.componentDataSourceName)
      } else if (item.componentDataSourceType === 'Position') {
        isHavePosition = true
      } else if (item.componentDataSourceType === 'Department') {
        isHaveDept = true
      } else if (item.componentDataSourceType === 'Industry') {
        isHaveIndustry = true
      } else if (item.componentDataSourceType === 'ProgramType') {
        isHasProgramType = true
      } else if (item.componentDataSourceType === 'RelaEvidenceType') {
        isHasEvidenceType = true
      } else if (item.componentDataSourceType === 'DiscretionType') {
        isHasDiscretionType = true
      } else if (item.componentDataSourceType === 'DiscretionCalculateType') {
        isHasDiscretionCalculateType = true
      } else if (item.componentDataSourceType === 'documentModelDataType') {
        isDocumentModelDataType = true
      } else if (item.componentDataSourceType === 'documentModelType') {
        isDocumentModelType = true
      } else if (item.componentDataSourceType === 'documentModelUseWord') {
        isDocumentModelUseWord = true
      } else if (item.componentDataSourceType === 'ApprovalType') {
        isApprovalType = true
      } else if (item.componentDataSourceType === 'RoleType') {
        isRoleType = true
      } else if (item.componentDataSourceType === 'ModelType') {
        isModelType = true
      } else if (item.componentDataSourceType === 'EnumsType' && item.componentDataSourceName) {
        // 枚举
        enumsNameList.push(item.componentDataSourceName)
      } else if (item.componentDataSourceType === 'TipType') {
        isTipType = true
      } else if (item.componentDataSourceType === 'CaseAttrType') {
        // 违法行为属性类型
        isCaseAttrType = true
      } else if (item.componentDataSourceType === 'CheckedTargetType') {
        // 违法行为属性类型
        isCheckedTargetType = true
      } else if (item.componentDataSourceType === 'CauseTypeEnum') {
        // 违法行为类型
        isCauseTypeEnum = true
      }
    }
    let dictionariesData: any = []
    let positionData: any = []
    let departmentData: IBaseType[] = []
    let industryData: any = []
    let programTypeData: any = []
    let documentModelDataTypeData: any = []
    let documentModelData: any = []
    let documentModelUseWordData: any = []
    let approvalTypeData: IBaseType[] = []
    let roleTypeData: any[] = []
    let modelTypeData: any[] = []
    let enumsTypeData: any[] = []
    let tipTypeData: any[] = []
    let caseAttrTypeData: any[] = []
    const causeTypeData: ICauseType[] = []

    let evidenceTypeData: IGroupItemType[] = []
    let discretionTypeData: IGroupItemType[] = []
    let discretionCalculateTypeData: IGroupItemType[] = []
    let checkedTargetData: ITargetType[] = []

    if (dictionariesKeys.length) {
      // 有字典数据源配置
      dictionariesData = await queryDictionaries({ typeList: dictionariesKeys.join(',') })
    }
    if (isHavePosition) {
      // 查询职位 数据源
      positionData = await queryPosition()
    }
    if (isHaveDept) {
      departmentData = await queryDepartmentTypes()
    }
    if (isHaveIndustry) {
      industryData = await queryIndustry()
    }
    if (isHasProgramType) {
      programTypeData = await queryProgramTypes()
    }
    if (isHasEvidenceType) {
      evidenceTypeData = await queryAllEvidenceType()
    }
    if (isHasDiscretionType) {
      discretionTypeData = await queryAllDiscretionType()
    }
    if (isHasDiscretionCalculateType) {
      discretionCalculateTypeData = await queryAllDiscretionCalculateType()
    }
    if (isDocumentModelDataType) {
      documentModelDataTypeData = await queryParamTypes(null)
    }
    if (isDocumentModelType) {
      documentModelData = await queryDocumentTypes()
    }
    if (isDocumentModelUseWord) {
      documentModelUseWordData = await queryUseWordTypes(null)
    }
    if (isApprovalType) {
      approvalTypeData = await getApproveType()
    }
    if (isRoleType) {
      const user = useUserStore()
      const userInfo = user.getUserInfo
      roleTypeData = await queryRole({ orgId: userInfo.orgId })
    }
    if (isModelType) {
      modelTypeData = await queryModelType({})
    }
    if (enumsNameList.length) {
      enumsTypeData = await queryEnums({ columnNameList: enumsNameList })
    }
    if (isTipType) {
      tipTypeData = await queryTipTypeData({})
    }
    if (isCaseAttrType) {
      caseAttrTypeData = await queryCauseBaseAttrs()
    }
    if (isCheckedTargetType) {
      checkedTargetData = await queryTargetTypes()
    }
    // 违法行为类型
    if (isCauseTypeEnum) {
      causeTypeData = await queryCauseTypes()
    }
    if (
      isHavePosition ||
      isHaveDept ||
      isHaveIndustry ||
      isHasProgramType ||
      isHasEvidenceType ||
      isHasDiscretionType ||
      isDocumentModelType ||
      isHasDiscretionCalculateType ||
      isDocumentModelDataType ||
      isApprovalType ||
      isRoleType ||
      isModelType ||
      isTipType ||
      enumsNameList.length ||
      dictionariesKeys.length ||
      checkedTargetData.length ||
      causeTypeData.length
    ) {
      for (const item of schema) {
        if (item.componentDataSourceType === 'Dictionaries' && item.componentDataSourceName) {
          item.componentProps.options = dictionariesData[item.componentDataSourceName].map((item) => {
            return {
              label: item.displayValue,
              value: item.hiddenValue
            }
          })
        } else if (item.componentDataSourceType === 'Position') {
          // 处理 职位信息
          item.componentProps.options = positionData
          item.componentProps.childrenField = 'list'
          item.componentProps.keyField = 'id'
          item.componentProps.labelField = 'name'
        } else if (item.componentDataSourceType === 'Department') {
          item.componentProps.options = departmentData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'Industry') {
          item.componentProps.options = industryData
          item.componentProps.childrenField = 'childrenList'
          item.componentProps.keyField = 'id'
          item.componentProps.labelField = 'industryName'
          item.componentProps.filterable = true
        } else if (item.componentDataSourceType === 'ProgramType') {
          item.componentProps.options = programTypeData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'documentModelDataType') {
          item.componentProps.options = documentModelDataTypeData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'documentModelType') {
          item.componentProps.options = documentModelData
          item.componentProps.childrenField = 'childrenList'
          item.componentProps.keyField = 'id'
          item.componentProps.labelField = 'name'
          item.componentProps.filterable = true
        } else if (item.componentDataSourceType === 'documentModelUseWord') {
          item.componentProps.options = documentModelUseWordData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'RelaEvidenceType') {
          item.componentProps.options = evidenceTypeData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'DiscretionType') {
          item.componentProps.options = discretionTypeData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'DiscretionCalculateType') {
          item.componentProps.options = discretionCalculateTypeData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'ApprovalType') {
          item.componentProps.options = approvalTypeData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'RoleType') {
          item.componentProps.options = roleTypeData.map((item) => {
            return {
              label: item.roleName,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'ModelType') {
          item.componentProps.options = modelTypeData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'EnumsType' && item.componentDataSourceName) {
          item.componentProps.options = enumsTypeData.filter((info) => {
            if (item.componentDataSourceName === info.pojoEntityName) {
              info.label = info.enumChineseDescription
              info.value = info.enumCode
              return info
            }
          })
        } else if (item.componentDataSourceType === 'TipType') {
          item.componentProps.options = tipTypeData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'CaseAttrType') {
          item.componentProps.options = caseAttrTypeData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'CheckedTargetType') {
          item.componentProps.options = checkedTargetData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else if (item.componentDataSourceType === 'CheckedTargetType') {
          item.componentProps.options = checkedTargetData.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          })
        }
      }
    }
  }
}

export default schemaDataHandle
