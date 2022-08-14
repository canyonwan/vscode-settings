<template>
  <div class="p-2 document-template">
    <n-config-provider :theme="null" :theme-overrides="themeLight">
      <n-spin :show="loadingShow">
        <component :is="currentComponent" :documentData="documentData" :isNoPreview="isNoPreview" ref="docRef" :key="documentData.id" />
        <div v-if="documentData.documentStatus" class="pt-2 pl-1 pr-1">
          <n-button type="info" block @click="showPdf" v-if="documentData.documentFileUrl">查看pdf</n-button>
          <n-button type="info" block @click="docPdf" v-else>生成pdf</n-button>
        </div>
        <template v-else>
          <template v-if="documentData.documentModelApproval">
            <!-- 审批类 -->
            <div
              class="pt-2"
              v-if="
                documentData.isEdit && documentData.currentApprovalLevel && documentData.documentModelApproval.baseDocumentApprovalConfigOutput.approvalLevelTotal > documentData.currentApprovalLevel
              "
            >
              下级审批人：
              <template v-if="approvalUser.length > 0">
                {{ approvalUser[0].realName }}
              </template>
              <n-button @click="openSelectUser">选择审批人</n-button>
            </div>
            <div class="flex pt-2" v-if="documentData.currentApprovalLevel && documentData.isEdit">
              <template v-if="documentData.currentApprovalLevel === 1">
                <n-button type="info" block @click="approvalSave(1)">发起审批</n-button>
              </template>
              <template v-else>
                <div class="flex-1 pr-1">
                  <n-button type="warning" block @click="approvalSave(2)">{{ documentData.documentCodeNum === 9 ? '补充资料' : '退回' }}</n-button>
                </div>
                <div class="flex-1 pl-1">
                  <n-button type="info" block @click="approvalSave(1)">通过</n-button>
                </div>
                <div class="flex-1 pl-1" v-if="documentData.documentCodeNum === 9 && documentData.currentApprovalLevel === 3">
                  <n-button type="info" block @click="approvalSave(3)">退卷</n-button>
                </div>
              </template>
            </div>
          </template>
          <template v-else>
            <!-- 文书类 -->
            <div class="flex pt-2" v-if="docIsEdit">
              <div class="flex-1">
                <n-button strong secondary block @click="switchDocEdit"> {{ isNoPreview ? '文书预览' : '编辑模式' }}</n-button>
              </div>
              <div class="flex-1 pl-1">
                <n-button type="warning" block @click="approvalSave(1)">暂存</n-button>
              </div>
              <div class="flex-1 pl-1">
                <n-button type="info" block @click="approvalSave(2)">生成pdf</n-button>
              </div>
            </div>
          </template>
        </template>
      </n-spin>
    </n-config-provider>
    <basic-modal @register="selectUserModalRegister" style="width: 70%">
      <select-user v-model:users-data="approvalUser" isSingleSelect @close-modal="closeUserModal" />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { documentInit, documentSave, documentPdf, documentDetail, documentRedo } from '@/api/document/document-approve'
  import { IDocumentData, IDocumentApproveInit, IDocumentKeyConfig } from '@/api/document/types'
  import { queryProgramDetail } from '@/api/program/program'
  import { IProgramItem } from '@/api/program/types'
  import { pick, pull } from 'lodash-es'
  import { enforceLightTheme } from '@/enforce-theme'
  import { useModal } from '@/components/modal'
  import { useMessage } from 'naive-ui'
  import { IPersonnelInfo } from '@/api/user/types'
  import { useUserStore } from '@/store/modules/user'
  import { cloneDeep } from 'lodash-es'
  import { getComponentByKey, getGroupKeyValue, getCauseTypeName } from './template-handle'
  import { format } from 'date-fns'
  export default defineComponent({
    components: {},
    props: {
      proceduresId: {
        // 程序id
        type: String,
        default: ''
      },
      documentModelTypeId: {
        // 文书类型id 文书类型 未必是文书模板
        type: String,
        default: ''
      },
      timeLineId: {
        // 时间轴id
        type: String,
        default: ''
      },
      toolId: {
        // 工具id
        type: String,
        default: ''
      },
      toolGroupId: {
        // 工具组id
        type: String,
        default: ''
      },
      documentId: {
        // 文书id
        type: String,
        default: ''
      },
      documentRedoId: {
        // 文书重做的id
        type: String,
        default: ''
      }
    },
    emits: ['updateTimeLine'],
    setup(_props, { emit }) {
      const currentComponent = shallowRef() // 当前组件内容
      const docRef = ref()
      const message = useMessage()
      const userStore = useUserStore()
      const themeLight = ref({
        common: enforceLightTheme
      })
      const state = reactive({
        documentData: {} as IDocumentData, // 文书渲染数据
        approvalUser: [] as Partial<IPersonnelInfo>[], // 审批人
        programDetail: {} as IProgramItem, // 程序详情
        currentComponentName: '', // 当前的文书名称
        currentDocParam: {
          documentId: ''
        } as IDocumentApproveInit, // 当前的文书条件
        loadingShow: false, // 加载提示
        docIsEdit: false, // 为了判断文书情况下 预览时候
        isNoPreview: false // 是否文书预览
      })
      const getProgramInfo = async () => {
        // 获取程序详情 判断共同执法人
        state.programDetail = await queryProgramDetail(state.currentDocParam.proceduresId)
        if (!(state.programDetail && Object.keys(state.programDetail).length > 0)) {
          message.error('程序信息获取失败！')
          return
        }
        if (!(state.programDetail.handingPeopleEntity && state.programDetail.handingPeopleEntity.length > 0)) {
          // 判断共同执法人是否存在
          message.error('程序共同执法人获取失败或没有！')
          return
        }
      }
      const docInit = async () => {
        if (!(state.programDetail && state.programDetail.id === state.currentDocParam.proceduresId)) {
          // 程序id 是改变的需要重新加载程序详情
          await getProgramInfo()
        }
        let res: any = {}
        state.loadingShow = true
        try {
          if (state.currentDocParam.documentRedoId) {
            // 文书重做的id标识
            res = await documentRedo(state.currentDocParam.documentRedoId)
            state.currentDocParam.documentRedoId = ''
            emit('updateTimeLine')
          } else if (state.currentDocParam.documentId) {
            // 存在文书id
            res = await documentDetail(state.currentDocParam.documentId)
          } else {
            state.currentDocParam.toolGroup = state.currentDocParam.toolGroupId
            res = await documentInit({ ...state.currentDocParam })
          }
          state.documentData = {
            ...pick(res, ['id', 'documentStatus', 'proceduresId', 'documentFileUrl']),
            ...pick(res.obj, ['documentCodeNum', 'configOutputList', 'documentModelApproval', 'coreFormData', 'coreForm']),
            currentApprovalLevel: 0,
            isEdit: false,
            documentModelTypeId: _props.documentModelTypeId
          }
          // 文书初始化的数据处理
          docInitHandle(state.documentData.configOutputList)
          const comUrl = getComponentByKey(state.documentData.documentCodeNum)
          if (!!comUrl) {
            if (state.currentComponentName !== comUrl.name) {
              // 判断当前模板地址是否改变
              state.currentComponentName = comUrl.name
              currentComponent.value = defineAsyncComponent(comUrl)
            }
          } else {
            message.error('文书模板配置有误！')
            return
          }
          state.documentData.approvalKeyData = {}
          let isApproval = state.documentData.documentModelApproval && Object.keys(state.documentData.documentModelApproval).length > 0
          // 审批类 key的值处理成 key 的对象
          for (const item of state.documentData.configOutputList) {
            if ((isApproval && !item.baseCauseAttId) || (!isApproval && item.keyAttributeValues?.includes(5))) {
              // 审批情况下 不是违法行为属性的到key对象里， 非审批时候 固定字段配置的到key对象里
              // 动态拼接的字段 wordModelKey 是一个 字段key 根据违法行为动态生成
              state.documentData.approvalKeyData[item.wordModelKey] = item
            }
          }
          state.docIsEdit = false
          state.isNoPreview = false
          if (state.documentData.documentStatus) {
            // 文书已生成
            return
          }
          // documentPdf(state.documentData.id)
          // 判断是否审批处理 documentModelApproval 字段存在是审批， approvalType 是否采用审批层级， 0 审批层级只是渲染不走审批过程
          if (state.documentData.documentModelApproval && Object.keys(state.documentData.documentModelApproval).length > 0) {
            // 处理审批签字信息
            for (const approval of state.documentData.documentModelApproval.baseDocumentApprovalConfigOutput.approvalConfigDataOutputs) {
              if (approval.approvalStatus === 0) {
                state.documentData.currentApprovalLevel = approval.sort
                // 当前操作的审批数据
                approval.approvalSignList = []
                if (approval.sort === 1) {
                  // 公共执法人判断
                  isEnforce()
                  // 判断当前是否需要发起审批 是在赋值共同执法人签字信息及意见
                  if (!(state.documentData.documentModelApproval.attributeList && state.documentData.documentModelApproval.attributeList.includes(1))) {
                    // 发起审批 情况共同执法人签字
                    for (const user of state.programDetail.handingPeopleEntity) {
                      if (user.userType === 1) {
                        approval.approvalSignList.push({
                          userId: user.userId,
                          userName: user.realName,
                          enforceCode: user.enforceCode,
                          signFileId: '',
                          signFileUrl: ''
                        })
                      }
                    }

                    if (!approval.approvalValue) {
                      // 判断发起审批意见是否赋值
                      let sponsorOpinionList = state.documentData.configOutputList.filter((item) => {
                        return item.wordModelKey === 'sponsorOpinion'
                      })
                      if (sponsorOpinionList && sponsorOpinionList.length > 0) {
                        // 存在配置的发起意见数据源 直接拼接到发起意见
                        approval.approvalValue = sponsorOpinionList
                          .map((o) => {
                            return o.defaultValue
                          })
                          .join(' ')
                      }
                    }
                  }
                } else {
                  // 其他审批情况
                  if (userStore.getUserInfo.id === approval.sponsorId) {
                    state.documentData.isEdit = true // 审批人可编辑
                  }
                  approval.approvalSignList.push({
                    userId: approval.sponsorId,
                    signFileId: '',
                    signFileUrl: ''
                  })
                }
              }
            }
          } else {
            // 文书情况判断共同执法人可以操作文书
            isEnforce()
            state.docIsEdit = state.isNoPreview = state.documentData.isEdit
          }
        } finally {
          state.loadingShow = false
        }
      }
      // 判断是否是共同执法人
      const isEnforce = () => {
        const isHaveLoginUser = state.programDetail.handingPeopleEntity.filter((item) => {
          return item.userId === userStore.getUserInfo.id
        })
        if (isHaveLoginUser && isHaveLoginUser.length > 0) {
          state.documentData.isEdit = true
        }
      }
      const [selectUserModalRegister, { openModal: openUserModal, closeModal: closeUserModal }] = useModal({
        title: '选择执法员'
      })
      // 文书保存处理数据过程
      const docSaveHandle = (configOutputList: IDocumentKeyConfig[]) => {
        for (const item of configOutputList) {
          if (item.documentModelDataTypeId === '1000007' && item.groupWordModelKey && item.groupWordModelKey.length > 0) {
            // 处理组合占位数据
            if (item.whetherUse) {
              // 判断分组占位字段可用 并处理
              item.defaultValue = getGroupKeyValue(item.groupWordModelKey || [], configOutputList)
            } else {
              // 不可用赋值空
              item.defaultValue = ''
            }
          } else if (item.documentModelDataTypeId === '1000015') {
            // 时间处理
            if (item.otherId && item.otherId.length > 0 && item.otherId[0]) {
              item.defaultValue = item.otherId[0] ? format(item.otherId[0], 'yyyy年MM月dd日') : ''
            } else if (item.otherId && item.otherId.length > 0 && item.otherId[0] === null) {
              item.otherId = []
              item.defaultValue = ''
            }
          }
        }
      }
      const docInitHandle = (configOutputList: IDocumentKeyConfig[]) => {
        // 违法行为id集合
        let causeIdList = [] as string[]
        // 找到绑定字段中，绑定了违法行为属性的字段模板key集合
        const allCauseTypeName: string[] = getCauseTypeName(configOutputList)
        // 文书初始化处理
        for (const item of configOutputList) {
          if (item.documentModelDataTypeId === '1000015' && item.defaultValue.includes('nowDate')) {
            if (item.otherId && item.otherId.length === 0) {
              item.otherId = [Date.now()]
              item.defaultValue = format(Date.now(), 'yyyy-MM-dd')
            }
          }
          // 分组占位的固定文本处理
          if (item.documentModelDataTypeId === '1000007') {
            if (item.groupWordModelKey && item.groupWordModelKey.length) {
              // 案件的违法行为id获取一次
              if (causeIdList.length === 0) {
                const causeTypeNameList = item.groupWordModelKey.filter((i) => allCauseTypeName.includes(i)) || []
                if (causeTypeNameList && causeTypeNameList.length) {
                  for (const wordModelItem of configOutputList) {
                    if (wordModelItem.wordModelKey === causeTypeNameList[0]) {
                      const type = wordModelItem.englishName.match(/^[0-9]*/g)?.[0] || ''
                      causeIdList.push(type)
                    }
                  }
                }
              }
              if (causeIdList.length) {
                const fixedList: IDocumentKeyConfig[] = []
                // noCauseNameList 分组占位中的非违法行为属性字段名称集合(分组占位key中删除字段中的违法行为属性类型字段)
                const noCauseNameList = pull([...item.groupWordModelKey], ...item.groupWordModelKey.filter((i) => allCauseTypeName.includes(i)))
                // 分组占位中有违法行为属性字段才会继续
                if (noCauseNameList.length !== item.groupWordModelKey.length) {
                  if (noCauseNameList && noCauseNameList.length) {
                    for (const nameItem of noCauseNameList) {
                      for (const wordModelItem of configOutputList) {
                        if (wordModelItem.wordModelKey === nameItem) {
                          wordModelItem.whetherUse = 0
                          for (const causeIdItem of causeIdList) {
                            const englishName: string = causeIdItem + nameItem
                            fixedList.push({ ...wordModelItem, englishName: englishName, id: wordModelItem.id, whetherUse: 1 })
                          }
                        }
                      }
                    }
                    configOutputList.push(...fixedList)
                  }
                }
              }
            }
          }
        }
      }
      const approvalSave = async (type: number) => {
        // 审批保存
        const saveDocData: IDocumentData = cloneDeep(docRef.value.docData) // 深拷贝 层级数据较多
        saveDocData.toolGroup = state.currentDocParam.toolGroupId
        saveDocData.toolId = state.currentDocParam.toolId
        saveDocData.timeLineId = state.currentDocParam.timeLineId
        if (saveDocData.documentModelApproval && Object.keys(saveDocData.documentModelApproval).length > 0) {
          // 审批处理 初始化时候的处理key的对象切换回集合  一般字段 approvalKeyData  动态字段 configOutputList 里
          const causeAttrList = saveDocData.configOutputList.filter((item) => {
            return item.baseCauseAttId
          })
          saveDocData.configOutputList = [...Object.values(saveDocData.approvalKeyData as Object), ...causeAttrList]
          delete saveDocData.approvalKeyData
          docSaveHandle(saveDocData.configOutputList)
          if (saveDocData.documentModelApproval.approvalType === 1 && saveDocData.documentModelApproval.baseDocumentApprovalConfigOutput.approvalLevelTotal > 0) {
            // 存在审批的话
            // 当前审批数据
            const currentApproval = saveDocData.documentModelApproval.baseDocumentApprovalConfigOutput.approvalConfigDataOutputs.filter((item) => {
              if (item.approvalStatus === 0) {
                return item
              }
            })
            if (currentApproval && currentApproval.length > 0) {
              // 找到审批数据 判断审批是否签字
              const noSign = currentApproval[0].approvalSignList?.filter((sign) => {
                return !sign.signFileId
              })
              if (noSign && noSign.length > 0) {
                message.error('请点击签字笔签字')
                return
              }
              // 法制审核意见表 退卷
              if (
                type === 3 &&
                state.documentData.documentCodeNum === 9 &&
                state.documentData.currentApprovalLevel === 3 &&
                docRef.value.docData.approvalKeyData!['debatchingSign'].columnValue.length === 0
              ) {
                message.error('请退卷人签字')
                return
              }
              // 赋值审批人
              if (saveDocData.currentApprovalLevel !== saveDocData.documentModelApproval.baseDocumentApprovalConfigOutput.approvalLevelTotal && (type === 1 || type === 3)) {
                if (state.approvalUser && state.approvalUser.length > 0 && state.approvalUser[0].id) {
                  currentApproval[0].receiverId = state.approvalUser[0].id || ''
                } else {
                  message.error('请选择审批人')
                  return
                }
              }
              currentApproval[0].approvalStatus = type
              currentApproval[0].sponsorId = userStore.getUserInfo.id || ''
              saveDocData.documentModelApproval.baseDocumentApprovalConfigOutput.approvalConfigDataOutputs = [...currentApproval]
            } else {
              message.error('审批数据获取失败')
              return
            }
          }
          state.loadingShow = true
          try {
            await documentSave(saveDocData)
            if (saveDocData.currentApprovalLevel === saveDocData.documentModelApproval.baseDocumentApprovalConfigOutput.approvalLevelTotal && type !== 2) {
              // 当前审批层级 等于配置层级 生成pdf
              await documentPdf(state.documentData.id)
            }
          } finally {
            // 获取详情
            state.currentDocParam.documentId = saveDocData.id
            state.approvalUser = []
            state.loadingShow = false
            docInit()
          }
        } else {
          // 文书判断
          const causeAttrList = saveDocData.configOutputList.filter((item) => {
            return !item.keyAttributeValues?.includes(5)
          })
          saveDocData.configOutputList = [...Object.values(saveDocData.approvalKeyData as Object), ...causeAttrList]
          delete saveDocData.approvalKeyData
          docSaveHandle(saveDocData.configOutputList)
          state.loadingShow = true
          try {
            await documentSave(saveDocData)
            if (type === 2) {
              // 生成pdf
              await documentPdf(state.documentData.id)
            }
          } finally {
            // 获取详情
            state.currentDocParam.documentId = saveDocData.id
            state.loadingShow = false
            docInit()
          }
        }
        if (currentRoute.name === 'app_document') {
          if (type === 2) {
            window['Android'].closePage()
          }
        } else {
          emit('updateTimeLine')
        }
      }
      const showPdf = () => {
        // 查看pdf
        if (state.documentData.documentFileUrl) {
          window.open(state.documentData.documentFileUrl)
        }
      }
      const docPdf = async () => {
        // pdf 生成
        await documentPdf(state.documentData.id)
        state.currentDocParam.documentId = state.documentData.id
        docInit()
      }
      const switchDocEdit = () => {
        // 切换文书预览方式
        // state.documentData.isEdit = !state.documentData.isEdit
        state.isNoPreview = !state.isNoPreview
      }
      const currentRoute = useRoute()
      if (currentRoute.name === 'app_document') {
        // 当前路由是document.html单页的
        state.currentDocParam = { ...currentRoute.params } as unknown as IDocumentApproveInit
        docInit()
        window['getUserInfo'] = (userId: string, userName: string) => {
          if (userId) {
            state.approvalUser.push({
              id: userId,
              realName: userName
            })
          }
        }
      } else {
        // 主程序 index.html
        watch(
          () => _props,
          () => {
            state.currentDocParam = { ..._props }
            docInit()
          },
          { immediate: true, deep: true }
        )
      }
      const openSelectUser = () => {
        // 选择人员
        if (currentRoute.name === 'app_document') {
          window['Android'].selectUser('选择审批人', 1)
        } else {
          openUserModal()
        }
      }
      return {
        ...toRefs(state),
        currentComponent,
        themeLight,
        docRef,
        selectUserModalRegister,
        closeUserModal,
        openSelectUser,
        docInit,
        approvalSave,
        showPdf,
        docPdf,
        switchDocEdit
      }
    }
  })
</script>

<style lang="less" scoped>
  .document-template {
    color: black;

    ::v-deep(.law-document-tittle) {
      font: 24px '黑体';
      padding: 20px 0;
      text-align: center;
    }

    ::v-deep(.law-document-tip) {
      padding: 5px;
      font-weight: bold;
      color: #f00;
    }

    ::v-deep(.law-document-content) {
      font: 16px '仿宋';
      border-collapse: collapse;
      margin: 0 auto;

      td {
        border-width: 1px;
        border-color: rgba(0, 0, 0, 0.3);
        word-wrap: break-word;
        word-break: break-all;
        padding: 5px;
      }

      .n-input__input-el,
      .n-input__placeholder,
      .n-input__textarea-el {
        text-align: left;
      }

      .direction-text {
        width: 20px;
        line-height: 24px;
        margin: 0 auto;
      }

      // 数据下划线\
      .data-underline {
        border-bottom: 1px solid #808083;
        padding-right: 10px;
      }

      .signImg {
        // 签字图片样式
        width: 80px;
        display: inline-block;
      }

      div {
        // line-height: 30px;
      }
    }

    // 通知书决定书类的文书正文
    ::v-deep(.doc-text) {
      text-indent: 2;
      line-height: 30px;
    }

    // 数据下划线
    ::v-deep(.data-underline) {
      border-bottom: 1px solid #808083;
      padding-right: 10px;
    }
  }
</style>
