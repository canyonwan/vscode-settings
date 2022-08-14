import { IProgramItem, ITimeLineTreeLeaf } from '@/api/program/types'
import { IInitTimeLineInfo } from '@/api/time-line/types'
import { IToolInfoExpress } from '@/api/workflow/types'
import { initTimeLine } from '@/api/time-line/time-line'

export interface ShowContentParam {
  isToolBox: Boolean
  nodeToolInfo: IToolInfoExpress & ITimeLineTreeLeaf
  procedureData: IProgramItem
  programId: string
  timelineId: string
  programType: number
}
/**
 * 时间轴上的执法人信息
 */
interface IUserInfo {
  userId: string // 人员id
  realName: string // 真实姓名
  operatorId: string // 人员id
  operator: string // 真实姓名
  org: any
  position: string
  positionValue: any
  userType: number
}

/**
 * 时间轴工具箱点击判断
 * @param isToolBox true工具箱的操作 false时间轴的操作
 * @param nodeToolInfo 点击节点或工具的信息
 * @param procedureData 程序详情
 */
export async function handleNodeToolClick({ isToolBox, nodeToolInfo, procedureData, programId, programType, timelineId }: ShowContentParam) {
  //工具箱
  if (isToolBox) {
    if (nodeToolInfo.type === 1 || nodeToolInfo.type === 2) {
      const initIds = await getModelTimeLineInit(nodeToolInfo, programId, timelineId)
      // 文书跳转
      return {
        toolType: nodeToolInfo.type,
        typeId: Number(nodeToolInfo.typeId), // 数据id
        toolId: nodeToolInfo.id, // 工具id
        toolGroup: nodeToolInfo.toolGroupId, // 工具组ID
        parentId: timelineId, // 父级时间轴ID
        procedureId: programId, // 程序ID
        childTimeLineId: initIds.timeLineId // 子模型的时间轴id,工具箱没有，时间轴有
      }
    } else if (nodeToolInfo.type === 5) {
      // 出示执法证
      return {
        toolType: nodeToolInfo.type,
        procedureId: programId, // 程序ID
        timeLineId: timelineId, // 时间轴ID
        toolId: nodeToolInfo.id, // 工具ID
        toolGroup: nodeToolInfo.toolGroupId // 工具组ID
      }
    } else if (nodeToolInfo.type === 7) {
      // 更换执法人
      return {
        toolType: nodeToolInfo.type,
        procedureId: programId, // 程序ID
        timeLineId: timelineId, // 时间轴ID
        name: nodeToolInfo.name, // 节点或工具名称
        toolId: nodeToolInfo.id, // 工具ID
        toolGroup: nodeToolInfo.toolGroupId, // 工具组ID
        handingPeopleEntity: procedureData.handingPeopleEntity // 案件当前的执法人
      }
    } else if (nodeToolInfo.type === 8) {
      // 证据
      return {
        toolType: nodeToolInfo.type,
        proceduresId: programId, // 程序ID
        relationType: '1', // 关联类型 1.和程序关联 2.裁量规则 3.裁量类型证据 (23和认定证据有关)
        timeLineId: timelineId, // 时间轴ID
        typeId: nodeToolInfo.typeId, // 证据类型-书证
        typeIdName: nodeToolInfo.typeIdName, // 证据类型名称
        causeId: null,
        causeRuleId: null
      }
    } else if (nodeToolInfo.type === 9) {
      // 检查对象
      return {
        toolId: nodeToolInfo.id, // 工具ID
        toolGroupId: nodeToolInfo.toolGroupId, // 工具组ID
        toolType: nodeToolInfo.type,
        procedureId: programId, // 程序ID
        timeLineId: timelineId // 时间轴ID
      }
    } else if (nodeToolInfo.type === 10) {
      // 回收站
      return {
        toolType: nodeToolInfo.type,
        procedureId: programId, // 程序ID
        timeLineId: timelineId, // 时间轴ID
        typeId: nodeToolInfo.typeId, // 证据类型-书证
        typeIdName: nodeToolInfo.typeIdName // 证据类型名称
      }
    } else if (nodeToolInfo.type === 11) {
      // 违法行为
      return {
        toolId: nodeToolInfo.id, // 工具ID
        toolGroupId: nodeToolInfo.toolGroupId, // 工具组ID
        toolType: nodeToolInfo.type,
        // caseTypeId: procedureData.procedureType, // 案件类型大类id
        caseTypeId: programType, // 案件类型大类id
        targetType: procedureData.targetType, // 检查对象类型id
        procedureId: programId, // 程序ID
        timeLineId: timelineId // 时间轴ID
      }
    } else if (nodeToolInfo.type === 13) {
      // 转出程序
      return {
        title: nodeToolInfo.name ?? '转出程序',
        toolType: nodeToolInfo.type, // 工具类型
        toolId: nodeToolInfo.id, // 工具ID
        toolGroup: nodeToolInfo.toolGroupId, // 工具组ID
        procedureId: programId // 程序ID
      }
    } else if (nodeToolInfo.type === 4) {
      // 关联程序
      return {
        title: nodeToolInfo.name ?? '关联',
        toolType: nodeToolInfo.type, // 工具类型
        toolId: nodeToolInfo.id, // 工具ID
        toolGroup: nodeToolInfo.toolGroupId, // 工具组ID
        timeLineId: timelineId, // 时间轴ID
        dataId: programId, // 当前程序ID
        dataType: programType, // 程序类型(1:行政检查2:行政处罚3:行政强制4:移交移送5任务)
        targetType: nodeToolInfo.typeId, // 关联目标类型(1:行政检查2:行政处罚3:行政强制4:移交移送5:任务)
        targetId: nodeToolInfo.id // 关联目标id 关联目标id 如果是关联任务 这个传选中的任务id
      }
    } else {
      // 是其他: 比如罚款裁量
      return {
        toolType: nodeToolInfo.type || 0,
        toolId: nodeToolInfo.id, // 工具id
        toolGroup: nodeToolInfo.toolGroupId // 工具组ID
      }
    }
    // 时间轴
  } else {
    if (nodeToolInfo.toolType === 1 || nodeToolInfo.toolType === 2) {
      // 文书跳转
      return {
        toolType: nodeToolInfo.toolType,
        typeId: nodeToolInfo.typeId, // 数据id
        toolId: nodeToolInfo.toolId, // 工具id
        toolGroup: nodeToolInfo.toolGroup, // 工具组ID
        parentId: timelineId, // 父级时间轴ID
        procedureId: programId, // 程序ID
        childTimeLineId: nodeToolInfo.id // 子模型的时间轴id
      }
    } else if (nodeToolInfo.toolType === 7) {
      // 更换执法人
      let enforceList
      if (nodeToolInfo.childrenList && nodeToolInfo.childrenList.length) {
        nodeToolInfo.childrenList.find((child) => {
          if (child.toolType === 7) {
            if (child.userList && child.userList.length) {
              enforceList = child.userList.map((item: IUserInfo) => {
                item.userId = item.operatorId
                item.realName = item.operator
                return item
              })
            }
          }
        })
      }
      return {
        toolType: nodeToolInfo.toolType,
        procedureId: programId, // 程序ID
        timeLineId: timelineId, // 时间轴ID
        name: nodeToolInfo.title, // 节点或工具名称
        toolId: null,
        toolGroup: null,
        handingPeopleEntity: enforceList || [] // 时间轴节点历史数据查看
      }
    } else if (nodeToolInfo.toolType === 8) {
      // 证据
      return {
        toolType: nodeToolInfo.toolType,
        proceduresId: programId, // 程序ID
        relationType: '1', // 关联类型 1.和程序关联 2.裁量规则 3.裁量类型证据 (23和认定证据有关)
        timeLineId: timelineId, // 时间轴ID
        typeId: null, // 证据类型
        typeIdName: null,
        causeId: null,
        causeRuleId: null
      }
    } else if (nodeToolInfo.toolType === 9) {
      // 检查对象
      return {
        toolType: nodeToolInfo.toolType,
        toolId: nodeToolInfo.toolId, // 工具id
        toolGroup: nodeToolInfo.toolGroup, // 工具组ID
        targetId: nodeToolInfo.dataId // 检查对象id
      }
    } else if (nodeToolInfo.toolType === 5) {
      // 出示执法证记录
      return {
        procedureId: programId, // 程序ID
        toolType: nodeToolInfo.toolType,
        timeLineId: timelineId, // 时间轴Id
        id: nodeToolInfo.childrenList[0].id, // 亮证记录ID
        toolId: nodeToolInfo.toolId, // 工具ID
        toolGroup: nodeToolInfo.toolGroup // 工具组ID
      }
    } else if (nodeToolInfo.toolType === 13) {
      // 转出程序
      return {
        title: nodeToolInfo.title ?? '转出程序',
        toolType: nodeToolInfo.toolType, // 工具类型
        toolId: nodeToolInfo.toolId, // 工具ID
        toolGroup: nodeToolInfo.toolGroup, // 工具组ID
        procedureId: programId, // 程序ID
        dataId: nodeToolInfo.dataId
      }
    } else if (nodeToolInfo.toolType === 11) {
      // 违法行为
      return {
        toolId: nodeToolInfo.toolId, // 工具ID
        toolGroupId: nodeToolInfo.toolGroup, // 工具组ID
        toolType: nodeToolInfo.toolType,
        procedureId: programId, // 程序ID
        timeLineId: timelineId // 时间轴ID
      }
    } else if (nodeToolInfo.toolType === 4) {
      // 关联程序
      return {
        title: nodeToolInfo.title ?? '关联',
        toolType: nodeToolInfo.toolType, // 工具类型
        toolId: nodeToolInfo.toolId, // 工具ID
        toolGroup: nodeToolInfo.toolGroup, // 工具组ID
        timeLineId: timelineId, // 时间轴ID
        dataId: programId, // 当前程序ID
        id: nodeToolInfo.dataId,
        dataType: programType, // 程序类型(1:行政检查2:行政处罚3:行政强制4:移交移送5任务)
        targetType: nodeToolInfo.typeId, // 关联目标类型
        targetId: nodeToolInfo.id // 关联目标id 如果是关联任务 这个传选中的任务id
      }
    } else {
      return {
        toolType: nodeToolInfo.toolType || 0,
        toolId: nodeToolInfo.toolId, // 工具id
        toolGroup: nodeToolInfo.toolGroup // 工具组ID
      }
    }
  }
}

// 时间轴初始化id，parentId父级时间轴id,
export async function getModelTimeLineInit(nodeToolInfo: IToolInfoExpress, programId: string, timelineId: string): Promise<IInitTimeLineInfo> {
  // 文书程序id和时间轴id
  return await initTimeLine({
    parentId: timelineId,
    procedureId: programId,
    toolId: nodeToolInfo.id as string,
    toolGroup: nodeToolInfo.toolGroupId as string
  })
}

// { 1, 'navigate', '跳转' },
// { 2, 'docDo', '文书制作' },
// { 3, 'tip', '提示信息' },
// { 4, 'relevance', '关联程序' },
// { 5, 'showCertificates', '出示执法证' },
// { 6, 'avoid', '告知回避' },
// { 7, 'enforcePersonnel', '更换执法人员' },
// { 8, 'evidence', '证据' },
// { 9, 'target', '选择检查对象' },
// { 10, 'recycle', '回收站' },
// { 11, 'cause', '违法行为' },
// { 12, 'approval', '审批' },
// { 13, 'shiftRelevance', '转出程序' },
// { 14, 'penaltyDiscretion', '罚款裁量' },
// { 15, 'confiscateDiscretion', '没收裁量' },
// { 16, 'transferEvidence', '移送材料' },
// { 17, 'caseType', '案件类型' },
// { 18, 'punishProcedure', '处罚程序类型' },
// { 19, 'docRedo', '文书重做' },
// { 20, 'docSeal', '文书盖章' },
// { 21, 'docLook', '文书查看' },
// { 22, 'uploadFile', '文件上传' },
// { 23, 'informationDocument', '资料文件' },
// { 24, 'selectPersonnel', '选择人员' },
// { 25, 'buttonSelect', '选择按钮' },
// { 26, 'dossier', '卷宗' },
// { 27, 'inputData', '输入值/输入框' },
// { 28, 'docPrint', '打印文书' }
