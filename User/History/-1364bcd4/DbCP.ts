import { IProgramItem, ITimeLineTreeLeaf } from '@/api/program/types'
import { IToolInfoExpress } from '@/api/workflow/types'

interface ShowContentParam {
  isToolBox: Boolean
  nodeToolInfo: IToolInfoExpress & ITimeLineTreeLeaf
  procedureData: IProgramItem
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
export function handleNodeToolClick({ isToolBox, nodeToolInfo, procedureData }: ShowContentParam) {
  //工具箱
  if (isToolBox) {
    if (nodeToolInfo.type === 2) {
      // 文书
      return {
        toolType: nodeToolInfo.type,
        toolId: nodeToolInfo.id, // 工具id
        procedureType: procedureData.procedureType // 主模型id
      }
    } else if (nodeToolInfo.type === 7) {
      // 更换执法人
      return {
        toolType: nodeToolInfo.type,
        procedureId: procedureData.id, // 程序ID
        timeLineId: procedureData.timeLineId, // 时间轴ID
        name: nodeToolInfo.name, // 节点或工具名称
        toolId: nodeToolInfo.id, // 工具ID
        toolGroup: nodeToolInfo.toolGroupId, // 工具组ID
        handingPeopleEntity: procedureData.handingPeopleEntity // 案件当前的执法人
      }
    } else if (nodeToolInfo.type === 8) {
      // 书证
      return {
        toolType: nodeToolInfo.type,
        procedureId: procedureData.id, // 程序ID
        relationType: '1', // 关联类型 1.和程序关联 2.裁量规则 3.裁量类型证据 (23和认定证据有关)
        timeLineId: procedureData.timeLineId, // 时间轴ID
        typeId: nodeToolInfo.typeId, // 证据类型-书证
        typeIdName: nodeToolInfo.typeIdName // 证据类型名称
      }
    } else if (nodeToolInfo.type === 10) {
      //
    } else {
      return {
        toolType: nodeToolInfo.type || 0
      }
    }
    // 时间轴
  } else {
    if (nodeToolInfo.type === 2) {
      // 文书
      return {
        toolType: nodeToolInfo.type,
        toolId: nodeToolInfo.id, // 工具id
        procedureType: procedureData.procedureType // 主模型id
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
        procedureId: procedureData.id, // 程序ID
        timeLineId: procedureData.timeLineId, // 时间轴ID
        name: nodeToolInfo.title, // 节点或工具名称
        toolId: null,
        toolGroup: null,
        handingPeopleEntity: enforceList || [] // 时间轴节点历史数据查看
      }
    } else if (nodeToolInfo.toolType === 8) {
      // 书证
      return {
        toolType: nodeToolInfo.toolType,
        procedureId: procedureData.id, // 程序ID
        relationType: '1', // 关联类型 1.和程序关联 2.裁量规则 3.裁量类型证据 (23和认定证据有关)
        timeLineId: procedureData.timeLineId, // 时间轴ID
        typeId: null, // 证据类型
        typeIdName: null
      }
    } else {
      return {
        toolType: nodeToolInfo.type || 0
      }
    }
  }
}

// 1	navigate	跳转子模型（具体跳转以工具组toolid配置得跳转子模型定）
// 2	doc	文书（跳转文书操作， 具体跳转那个 根据工具得typeid 配置）
// 3	tip	提示信息（显示提示得操作， 具体提示类型为typeid）
// 4	relevance	关联程序（关联程序操作， 具体程序类型为typeid）
// 5	showCertificates	出示执法证
// 6	avoid	告知回避
// 7	enforcePersonnel	更换执法人员
// 8	evidence	证据 （证据类型操作， 具体证据类型为typeid）
// 9	target	选择检查对象
// 10	recycle	回收站
// 11	cause	违法行为
// 12	approval	审批
// 13	shiftRelevance	转出程序
// 14	penaltyDiscretion	罚款裁量
// 15	confiscateDsicretion	没收裁量
// 16	transferEvidence	移送材料
// 17	caseType	案件类型
