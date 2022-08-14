<script setup lang="ts">
  import { queryProgramDetail } from '@/api/program/program'
  import type { IProgramItem } from '@/api/program/types'
  import { useModal } from '@/components/modal'
  import ToolsBox from '@/views/tool-group/index.vue'
  import FineDiscretion from '@/views/program/discretion/index.vue'
  import Timeline from './timeline.vue'
  import Evidence from '@/views/evidence/index.vue'
  import lawEnforce from '@/views/tool-group/components/law-enforce.vue'
  import { handleNodeToolClick } from './handle-node-tool-click'
  import Waste from '@/views/waste/index.vue'
  import { handelToolsBoxData } from './tools-box-data'
  import DocumentMark from '@/views/program/document-mark/index.vue'
  import RelatedProgramBar from './related-program-bar.vue'
  import { useUserStore } from '@/store/modules/user'
  import StageBar from './stage-bar.vue'
  // import { ICaseConnectInfo } from '@/api/time-line/types'
  import type { ISelectOption } from '@/components/main-header'
  import TargetDetailSave from '@/views/target/target-manage/components/target-detail-save.vue'
  // import { UseDraggable as Draggable } from  '@vueuse/core'

  const route = useRoute()
  const router = useRouter()
  const timeLineRef = ref<any>()
  const toolsBoxRef = ref<any>()
  const programDetail = ref<IProgramItem>()
  const caseInfo = ref<any>({}) //点击操作需要的ids
  const isBox = ref(false) // 是否是工具箱点击>
  const showStageBar = ref(false) //
  const keyWordValueList = ref({}) // 工具关键字的值们
  const toolsBoxData = ref()
  const user = useUserStore()
  const targetDetailRef = ref()

  provide('dispatchCaseInfo', caseInfo)

  const timelineId = ref<string>('')
  const programTypeId = ref<number>()
  const hideRelatedProgramBar = ref<boolean>(false)

  const { width, height } = useWindowSize()

  const { style } = useDraggable(toolsBoxRef, {
    initialValue: { x: width.value - 120, y: height.value - 120 },
    stopPropagation: true,
    preventDefault: true
  })

  const [modalRegister, { openModal }] = useModal({ title: '工具箱', displayDirective: 'if' })
  const [discretionModalRegister, { openModal: discretionOpenModal, closeModal: closeDiscretionModal }] = useModal({ title: '罚款裁量', displayDirective: 'if' })
  const [wasteRegister, { openModal: openWasteModal }] = useModal({ title: '回收站', displayDirective: 'if' })
  const [evidenceModalRegister, { openModal: evidenceOpenModal }] = useModal({ title: '采集证据' })
  const [lawEnforcersModal, { openModal: openLawEnforcersModal, closeModal: closeLawEnforcersModal }] = useModal({})
  const [childModelDocumentModal, { openModal: openChildModelDocumentModal }] = useModal({}) // 子模型文书类型弹窗

  // 时间轴节点和工具箱点击操作
  async function handleClickShow(isToolBox: boolean, nodeToolInfo) {
    if (programDetail.value) {
      caseInfo.value = await handleNodeToolClick({ isToolBox, nodeToolInfo, procedureData: programDetail.value })
    }
    isBox.value = isToolBox
    if (caseInfo.value.toolType === 8) {
      evidenceOpenModal()
    } else if (caseInfo.value.toolType === 7) {
      openLawEnforcersModal()
    } else if (caseInfo.value.toolType === 1 || caseInfo.value.toolType === 2) {
      // 1跳转界面 2弹出窗体
      if (caseInfo.value.typeId === 1) {
        router.push({
          name: 'program-document-mark',
          query: {
            processModelId: toolsBoxData.value.processModelId, //主模型ID
            parentId: caseInfo.value.parentId, // 父级时间轴ID
            procedureId: caseInfo.value.procedureId, // 程序ID
            toolId: caseInfo.value.toolId, // 工具id
            toolGroup: caseInfo.value.toolGroup, // 工具组ID
            childTimeLineId: caseInfo.value.childTimeLineId // 子模型的时间轴id,工具箱没有，时间轴有
          }
        })
      } else {
        caseInfo.value.processModelId = toolsBoxData.value.processModelId
        openChildModelDocumentModal()
      }
    } else if (caseInfo.value.toolType === 14) {
      // 14: fine discretion
      discretionOpenModal()
    } else if (caseInfo.value.toolType === 10) {
      // waste
      openWasteModal()
    } else if (caseInfo.value.toolType === 9) {
      targetDetailRef.value.openTargrtModal()
    }
  }

  // 时间轴节点点击处理
  function handleNodeClick(node) {
    handleClickShow(false, node)
  }

  function getDataSet(data) {
    keyWordValueList.value = data
    // 获取处理工具箱数据
    if (programDetail.value) {
      toolsBoxData.value = handelToolsBoxData(programDetail.value.procedureType, keyWordValueList.value)
    }
  }

  const programId = ref<string>()
  provide('provideProgramId', readonly(programId)) // 程序id
  provide('programDetail', readonly(programDetail)) // 程序详情

  // get program detail
  // 获取到程序详情后 如查显示了bar, 说明有多个关联的程序 找到和主程序id相同的程序并选中
  async function getProgramDetail() {
    const res = await queryProgramDetail(programId.value || '')
    programDetail.value = res
    // 只有一个关联的程序并且相等,则取第一个的timelineId
    hideRelatedProgramBar.value = programDetail.value.relevanceList.length === 1 && programDetail.value.id === programDetail.value.relevanceList[0].id
    if (!hideRelatedProgramBar.value) {
      const findSameProgram = programDetail.value.relevanceList.find((item) => item.id === programDetail.value!.id)
      timelineId.value = findSameProgram!.timeLineId
      programTypeId.value = findSameProgram?.procedureType
    } else {
      timelineId.value = programDetail.value.timeLineId
      programTypeId.value = programDetail.value.procedureType
    }
  }

  // 操作成功之后更新程序详情
  function updateProgramDetail() {
    getProgramDetail()
    if (caseInfo.value.toolType === 7) {
      updateTimeLine()
      closeLawEnforcersModal()
    }
  }

  // 操作成功之后更新时间轴
  function updateTimeLine() {
    timeLineRef.value.getTimelineList()
  }

  // 保存裁量回调
  function handleSaveDiscretion() {
    updateProgramDetail()
    updateTimeLine()
    closeDiscretionModal()
  }

  // 选择其他程序回调
  function dispatchRelatedProgram(id: string, programType: number) {
    programTypeId.value = programType
    if (programTypeId.value !== 2) showStageBar.value = false
    timelineId.value = id || programDetail.value!.timeLineId
  }

  // 登录人是否为共同执法人
  const isEnforcer = computed(() => {
    const isTrue = programDetail.value?.handingPeopleEntity.filter((item) => item.userId === user.getUserInfo.id)
    return isTrue && isTrue.length
  })

  function switchDisplayMode(value: boolean) {
    showStageBar.value = value
  }

  onMounted(() => {
    programId.value = route.query.programId as string
    getProgramDetail()
  })

  const clickItemHandler = (item: ISelectOption) => {
    router.push({ name: 'ProgramHome', params: { value: item.value, label: item.label } })
  }
</script>
<template>
  <div class="case-detail">
    <!-- TOP -->
    <n-space justify="space-between">
      <main-header @click-item-handler="clickItemHandler" />
      <n-switch :round="false" :value="showStageBar" @update:value="switchDisplayMode" v-show="programTypeId === 2">
        <template #checked> 按阶段展示 </template>
        <template #unchecked> 按全部展示 </template>
      </n-switch>
    </n-space>
    <n-grid cols="1 s:1 m:1 l:24 xl:24 2xl:24" responsive="screen" :x-gap="12" :style="{ height: 'calc(100vh - ' + 45 + 'px)' }">
      <!-- 关联程序bar -->
      <n-gi span="1" v-if="!hideRelatedProgramBar">
        <related-program-bar :data="programDetail?.relevanceList" :timelineId="timelineId" @dispatch-related-program="dispatchRelatedProgram" />
      </n-gi>
      <!-- 阶段bar & timeline -->
      <n-gi :span="!hideRelatedProgramBar ? 23 : 24">
        <n-space vertical>
          <stage-bar v-if="showStageBar" />
          <timeline :timelineId="timelineId" @node-click="handleNodeClick" @data-set="getDataSet" ref="timeLineRef" />
        </n-space>
      </n-gi>
    </n-grid>

    <!-- toolbox -->
    <div v-if="isEnforcer" class="fixed z-50 animate-pulse cursor-move bg-e-tools-box-icon bg-no-repeat bg-full h-20 w-20" ref="toolsBoxRef" :style="style" @click="openModal()"></div>

    <!-- modal -->
    <basic-modal @register="modalRegister" style="width: 70%">
      <!-- v-if="toolsBoxData.toolGroupData && toolsBoxData.toolGroupData.length" -->
      <tools-box
        :toolGroupData="toolsBoxData.toolGroupData"
        :currentGroupData="toolsBoxData.currentGroupData"
        :logicOptions="toolsBoxData.logicOptionsData"
        :judgeOptions="toolsBoxData.judgeOptionsData"
        :keyWordValueList="keyWordValueList"
        @tool-click="handleClickShow"
      />
    </basic-modal>
    <!-- 罚款裁量 modal -->
    <basic-modal @register="discretionModalRegister" style="width: 70%">
      <fine-discretion @handle-save-discretion="handleSaveDiscretion" />
    </basic-modal>
    <!-- 证据 -->
    <basic-modal @register="evidenceModalRegister" style="width: 70%">
      <evidence :caseInfo="caseInfo" @on-submit="updateTimeLine" v-if="Object.keys(caseInfo).length && caseInfo.toolType === 8" />
    </basic-modal>
    <!-- 回收站 -->
    <basic-modal @register="wasteRegister" style="width: 70%" @on-close="updateTimeLine">
      <waste />
    </basic-modal>
    <basic-modal @register="lawEnforcersModal" :title="Object.keys(caseInfo).length && caseInfo.name ? caseInfo.name : '选择执法人员'">
      <!-- 更换执法人员的工具类型是7 -->
      <law-enforce :caseInfo="caseInfo" @close-modal="closeLawEnforcersModal" @on-submit="updateProgramDetail" :isAction="isBox" v-if="Object.keys(caseInfo).length && caseInfo.toolType === 7" />
    </basic-modal>
    <basic-modal @register="childModelDocumentModal" style="width: 50%">
      <DocumentMark :caseInfo="caseInfo" @on-submit="updateTimeLine" v-if="Object.keys(caseInfo).length && caseInfo.toolType === 1 && caseInfo.typeId === 2" />
    </basic-modal>
    <!-- 检查对象详情 -->
    <target-detail-save :targetId="caseInfo.targetId" ref="targetDetailRef" />
  </div>
</template>

<style lang="less" scoped>
  .case-detail {
    // height: calc(100vh- 58px);
    .main {
      height: calc(100vh - 58px);
    }
  }
</style>
