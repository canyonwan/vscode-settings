<script lang="ts">
  export default {
    name: 'ProgramDetail'
  }
</script>
<script setup lang="ts">
  import { queryProgramDetail, selectTargetForTimeline } from '@/api/program/program'
  import type { IProgramItem } from '@/api/program/types'
  import { useModal } from '@/components/modal'
  import ToolsBox from '@/views/tool-group/index.vue'
  import FineDiscretion from '@/views/program/discretion/index.vue'
  import Evidence from '@/views/evidence/index.vue'
  import lawEnforce from '@/views/tool-group/components/law-enforce.vue'
  import { handleNodeToolClick } from '../handle-node-tool-click'
  import Waste from '@/views/waste/index.vue'
  import { handelToolsBoxData } from '../tools-box-data'
  import DocumentMark from '@/views/program/document-mark/index.vue'
  import RelatedProgramBar from '../related-program-bar.vue'
  import { useUserStore } from '@/store/modules/user'
  import StageBar from '../stage-bar.vue'
  import TargetDetailSave from '@/views/target/target-manage/components/target-detail-save.vue'
  import TimelineBox from './timeline-box.vue'
  import { stageBarEventKey } from '../../bus-key'
  import { onBeforeRouteLeave } from 'vue-router'
  import SelectTarget from '@/views/target/target-manage/index.vue'
  import CauseBrowse from '@/views/cause-browse/index.vue'
  import type { ITargetInfo } from '@/api/target/types'
  import { saveCauseInWorkflow } from '@/api/workflow/cause'
  import CauseList from './timeline/cause-list.vue'
  import ShowEnforceCertificate from '@/views/tool-group/components/show-enforce-certificate.vue'
  import TransferoutProgram from '@/views/tool-group/components/transferout-program.vue'
  import RelateProgram from '@/views/tool-group/components/relate-program.vue'
  import RelateTask from '@/views/tool-group/components/relate-task.vue'
  import type { IUnlawfulActWithWorkFlow } from '@/api/workflow/types'
  import TaskDetail from './timeline/task-detail.vue'

  const route = useRoute()
  const router = useRouter()
  const timeLineRef = ref<any>()
  const toolsBoxRef = ref<any>()
  const programDetail = ref<IProgramItem>()
  let findSameProgram = ref<IProgramItem>()
  const caseInfo = ref<any>({}) //?????????????????????ids
  const isBox = ref(false) // ????????????????????????>
  const showStageBar = ref(false) //
  const keyWordValueList = ref({}) // ????????????????????????
  const toolsBoxData = ref()
  const user = useUserStore()
  const targetDetailRef = ref()
  const showEnforceCerId = ref('')

  const timelineId = ref<string>('')
  const programTypeId = ref<number>()
  const hideRelatedProgramBar = ref<boolean>(false)
  const programId = ref<string>('')
  const tansferProgramId = ref<string>('') // ?????????????????????id
  const { width, height } = useWindowSize()

  const enteredRouterName = ref('') // will enter router

  const borderColor = computed(() => {
    return hideRelatedProgramBar.value ? '0px' : '2px solid #245590'
  })

  const el = ref<HTMLElement | null>()
  const relatedProgramBarRef = ref()

  const { y } = useScroll(el)

  provide('dispatchCaseInfo', caseInfo)
  provide('provideProgramId', readonly(programId)) // ??????id
  provide('programDetail', readonly(programDetail)) // ????????????

  const [modalRegister, { openModal, closeModal }] = useModal({ title: '?????????', displayDirective: 'if' })
  const [discretionModalRegister, { openModal: discretionOpenModal, closeModal: closeDiscretionModal }] = useModal({ title: '????????????', displayDirective: 'if' })
  const [wasteRegister, { openModal: openWasteModal }] = useModal({ title: '?????????', displayDirective: 'if' })
  const [evidenceModalRegister, { openModal: evidenceOpenModal }] = useModal({ title: '????????????' })
  const [lawEnforcersModal, { openModal: openLawEnforcersModal, closeModal: closeLawEnforcersModal }] = useModal({})
  const [childModelDocumentModal, { openModal: openChildModelDocumentModal }] = useModal({}) // ???????????????????????????
  const [selectTarget, { openModal: openSelectTarget, closeModal: closeSelectTarget }] = useModal({}) // ???????????????????????????
  const [selectUnlawfulAct, { openModal: openSelectUnlawfulAct, closeModal: closeUnlawfulAct }] = useModal({}) // ???????????????????????????
  const [causeListRegister, { openModal: openCauseList }] = useModal({ title: '??????????????????', displayDirective: 'if' }) // ??????????????????
  const [showEnforceCerRegister, { openModal: openShowEnforceCer, closeModal: closeShowEnforceCer }] = useModal({ title: '???????????????', displayDirective: 'if' }) // ???????????????
  const [showTransferoutRegister, { openModal: openTransferout, closeModal: closeTransferout, setProps }] = useModal({ displayDirective: 'if' }) // ????????????

  const [showRelateProgramRegister, { openModal: oenRelateProgram, closeModal: closeRelateProgram, setProps: setRelateProgramProps }] = useModal({ displayDirective: 'if' }) // ????????????

  const [showTaskTimelineRegister, { openModal: openTaskTimeline }] = useModal({ displayDirective: 'if', title: '????????????' }) // ???????????? -> ?????????????????????
  const [showRelateTaskRegister, { openModal: openRelateTask, closeModal: closeRelateTask }] = useModal({ displayDirective: 'if' }) // ????????????
  const [showAvoidRegister, { openModal: openAvoid }] = useModal({ title: '??????????????????', displayDirective: 'if' }) // ??????????????????

  const stageBarBus = useEventBus(stageBarEventKey)

  const { style } = useDraggable(toolsBoxRef, {
    initialValue: { x: width.value - 120, y: height.value - 120 },
    stopPropagation: true,
    preventDefault: true
  })

  // ???????????????????????????
  async function handleNodeClick(node) {
    await handleClickShow(false, node)
  }

  // ???????????????????????????????????????
  async function handleClickShow(isToolBox: boolean, nodeToolInfo) {
    if (programDetail.value) {
      caseInfo.value = await handleNodeToolClick({
        isToolBox,
        nodeToolInfo,
        procedureData: programDetail.value,
        programId: programId.value,
        timelineId: timelineId.value,
        programType: programTypeId.value!
      })
    }
    isBox.value = isToolBox
    if (caseInfo.value.toolType === 8) {
      evidenceOpenModal()
    } else if (caseInfo.value.toolType === 7) {
      openLawEnforcersModal()
    } else if (caseInfo.value.toolType === 1 || caseInfo.value.toolType === 2) {
      // 1???????????? 2?????????
      if (caseInfo.value.typeId === 1) {
        if (isBox.value) {
          closeModal()
        }
        router.push({
          name: 'program-document-mark',
          query: {
            processModelId: toolsBoxData.value.processModelId, //?????????ID
            parentId: caseInfo.value.parentId, // ???????????????ID
            procedureId: caseInfo.value.procedureId, // ??????ID
            toolId: caseInfo.value.toolId, // ??????id
            toolGroup: caseInfo.value.toolGroup, // ?????????ID
            childTimeLineId: caseInfo.value.childTimeLineId // ?????????????????????id,??????????????????????????????
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
      if (isBox.value) {
        openSelectTarget()
      } else {
        targetDetailRef.value.openTargetModal()
      }
    } else if (caseInfo.value.toolType === 11) {
      // ?????????????????????????????????
      if (isBox.value) {
        openSelectUnlawfulAct()
      } else {
        openCauseList()
      }
    } else if (caseInfo.value.toolType === 5) {
      // ?????????????????????
      openShowEnforceCer()
      if (isBox.value) showEnforceCerId.value = ''
      else showEnforceCerId.value = caseInfo.value.id
    } else if (caseInfo.value.toolType === 6) {
      // ??????????????????
      openAvoid()
      if (isBox.value) showEnforceCerId.value = ''
      else showEnforceCerId.value = caseInfo.value.id
    } else if (caseInfo.value.toolType === 13) {
      setProps({ title: caseInfo.value.title })
      // ????????????
      if (isBox.value) openTransferout()
      else jumpRelateProgram()
    } else if (caseInfo.value.toolType === 4) {
      setRelateProgramProps({ title: caseInfo.value.title })
      if (['5', 5].includes(caseInfo.value.targetType)) {
        if (isBox.value) openRelateTask()
        else openTaskTimeline()
      } else {
        // ????????????
        if (isBox.value) oenRelateProgram()
        else jumpRelateProgram()
      }
    }
  }

  function getDataSet(data) {
    keyWordValueList.value = data
    // ???????????????????????????
    if (programDetail.value) {
      toolsBoxData.value = handelToolsBoxData(programTypeId.value, keyWordValueList.value)
    }
  }

  // get program detail
  // ???????????????????????? ????????????bar, ?????????????????????????????? ??????????????????id????????????????????????
  async function getProgramDetail() {
    const res = await queryProgramDetail(programId.value || '')
    programDetail.value = res
    // ???????????????????????????????????????,??????????????????timelineId
    hideRelatedProgramBar.value = programDetail.value.relevanceList!.length === 1 && programDetail.value.id === (tansferProgramId.value || programDetail.value.relevanceList![0].id)
    if (!hideRelatedProgramBar.value) {
      findSameProgram.value = programDetail.value.relevanceList!.find((item) => item.id === (tansferProgramId.value || programDetail.value!.id))!
      timelineId.value = findSameProgram.value!.timeLineId
      programTypeId.value = findSameProgram.value?.procedureType
    } else {
      timelineId.value = programDetail.value.timeLineId
      programTypeId.value = programDetail.value.procedureType
    }
  }

  // ????????????????????????????????????
  async function updateProgramDetail() {
    await getProgramDetail()
    if (caseInfo.value.toolType === 7) {
      updateTimeLine()
      closeLawEnforcersModal()
    }
  }

  // ?????????????????????????????????
  function updateTimeLine() {
    timeLineRef.value.getTimelineList()
  }

  // ??????????????????
  async function handleSaveDiscretion() {
    await updateProgramDetail()
    updateTimeLine()
    closeDiscretionModal()
  }

  // ????????????????????????
  function dispatchRelatedProgram(item: IProgramItem) {
    // function dispatchRelatedProgram(timeLineId: string, programType: number, produceId: string) {
    programTypeId.value = item.procedureType
    showStageBar.value = false
    timelineId.value = item.timeLineId || programDetail.value!.timeLineId
    programId.value = item.id || (route.query.programId as string)
  }

  async function jumpRelateProgram() {
    tansferProgramId.value = caseInfo.value.dataId
    await updateProgramDetail()
    relatedProgramBarRef.value.onTabChange(findSameProgram.value)
  }

  // ?????????????????????????????????
  const isEnforcer = computed(() => {
    const isTrue = programDetail.value?.handingPeopleEntity.filter((item) => item.userId === user.getUserInfo.id)
    return isTrue && isTrue.length
  })

  function switchDisplayMode(value: boolean) {
    showStageBar.value = value
    !value && stageBarBus.emit(0)
  }

  // ????????????????????????
  async function selectedTargetHandler(values: ITargetInfo[]) {
    await selectTargetForTimeline({
      ...caseInfo.value,
      targetId: values.map((item) => item.id!)[0]
    })
    updateTimeLine()
    closeSelectTarget()
  }

  // ????????????????????????
  async function selectUnlawfulActHandler(values: IUnlawfulActWithWorkFlow[]) {
    await saveCauseInWorkflow({
      ...caseInfo.value,
      causeList: values
    })
    updateTimeLine()
    closeUnlawfulAct()
    closeModal()
  }

  // ??????[???????????????]??????
  function submitShowEnforceCerHandler() {
    updateTimeLine()
    closeShowEnforceCer()
  }

  // ??????[????????????]??????
  async function submitTransferoutProgram(id: string) {
    tansferProgramId.value = id
    closeTransferout()
    await updateProgramDetail()
  }

  // ??????[????????????]??????
  async function submitRelateProgram() {
    closeRelateProgram()
    await updateProgramDetail()
  }

  // ??????[????????????]??????
  async function submitRelateTask() {
    closeRelateTask()
    updateTimeLine()
  }

  // ??????[??????????????????]??????
  // function submitAvoidHandler() {
  //   updateTimeLine()
  //   closeAvoid()
  // }

  onBeforeRouteLeave((to) => {
    enteredRouterName.value = to.name?.toString() || ''
  })

  onActivated(() => {
    if (enteredRouterName.value === 'program-document-mark') {
      // getProgramDetail()
      el.value?.scrollTo(0, y.value)
      // stageBarBus.emit(0)
      updateTimeLine()
    } else {
      programId.value = route.query.programId as string
      getProgramDetail()
    }
  })
</script>
<template>
  <div class="px-5 py-3 v-case-detail">
    <!-- toolbox -->
    <div v-if="isEnforcer" class="fixed z-50 w-20 h-20 bg-no-repeat cursor-move animate-pulse bg-e-tools-box-icon bg-full" ref="toolsBoxRef" :style="style" @click="openModal"></div>
    <NSpace justify="space-between" class="pb-3 text-xs pl-7">
      <EBreadcrumb />
      <NSwitch :round="false" :value="showStageBar" @update:value="switchDisplayMode" v-show="programTypeId === 2">
        <template #checked> ??????????????? </template>
        <template #unchecked> ????????????????????? </template>
      </NSwitch>
    </NSpace>
    <!-- timeline -->
    <div class="flex p-3 detail">
      <RelatedProgramBar
        ref="relatedProgramBarRef"
        v-if="!hideRelatedProgramBar"
        class="flex-none mr-3"
        :data="programDetail?.relevanceList"
        :timelineId="timelineId"
        @dispatch-related-program="dispatchRelatedProgram"
      />

      <div class="flex-grow overflow-auto rounded-lg TimelineBox" ref="el">
        <StageBar v-if="showStageBar" />
        <TimelineBox :timelineId="timelineId" @node-click="handleNodeClick" @data-set="getDataSet" @refreshProgramDetailHandler="updateProgramDetail" ref="timeLineRef" />
      </div>
    </div>
    <!-- modal -->
    <BasicModal @register="modalRegister" style="width: 70%">
      <!-- v-if="toolsBoxData.toolGroupData && toolsBoxData.toolGroupData.length" -->
      <ToolsBox
        :toolGroupData="toolsBoxData.toolGroupData"
        :currentGroupData="toolsBoxData.currentGroupData"
        :logicOptions="toolsBoxData.logicOptionsData"
        :judgeOptions="toolsBoxData.judgeOptionsData"
        :keyWordValueList="keyWordValueList"
        @tool-click="handleClickShow"
      />
    </BasicModal>
    <!-- ???????????? modal -->
    <BasicModal @register="discretionModalRegister" style="width: 70%">
      <FineDiscretion @handle-save-discretion="handleSaveDiscretion" />
    </BasicModal>
    <!-- ?????? -->
    <BasicModal @register="evidenceModalRegister" style="width: 70%">
      <Evidence :caseInfo="caseInfo" @on-submit="updateTimeLine" v-if="Object.keys(caseInfo).length && caseInfo.toolType === 8" />
    </BasicModal>
    <!-- ????????? -->
    <BasicModal @register="wasteRegister" style="width: 70%" @on-close="updateTimeLine">
      <Waste />
    </BasicModal>
    <BasicModal @register="lawEnforcersModal" :title="Object.keys(caseInfo).length && caseInfo.name ? caseInfo.name : '??????????????????'">
      <!-- ????????????????????????????????????7 -->
      <lawEnforce :caseInfo="caseInfo" @close-modal="closeLawEnforcersModal" @on-submit="updateProgramDetail" :isAction="isBox" v-if="Object.keys(caseInfo).length && caseInfo.toolType === 7" />
    </BasicModal>
    <BasicModal @register="childModelDocumentModal" style="width: 50%">
      <document-mark :caseInfo="caseInfo" @on-submit="updateTimeLine" v-if="Object.keys(caseInfo).length && caseInfo.toolType === 1 && caseInfo.typeId === 2" />
    </BasicModal>

    <!-- ?????????????????? -->
    <BasicModal @register="selectTarget" style="width: 50%">
      <SelectTarget isSelection @update:selectTargets="selectedTargetHandler" @cancelModal="closeSelectTarget" />
    </BasicModal>

    <!-- ?????????????????? -->
    <BasicModal @register="selectUnlawfulAct" style="width: 80%">
      <CauseBrowse :case-type-id="caseInfo.caseTypeId" :target-type="caseInfo.targetType" allowSelect @submitHandler="selectUnlawfulActHandler" />
    </BasicModal>

    <!-- ?????????????????? -->
    <BasicModal @register="causeListRegister" style="width: 50%">
      <CauseList :program-id="programId" />
    </BasicModal>

    <!-- ??????????????? -->
    <BasicModal @register="showEnforceCerRegister" style="width: 50%">
      <ShowEnforceCertificate :id="showEnforceCerId" :caseInfo="caseInfo" @submit-handler="submitShowEnforceCerHandler" />
    </BasicModal>

    <!-- ???????????? -->
    <BasicModal @register="showTransferoutRegister" style="width: 50%">
      <TransferoutProgram :caseInfo="caseInfo" @submit-handler="submitTransferoutProgram" />
    </BasicModal>

    <!-- ???????????? -->
    <BasicModal @register="showRelateProgramRegister" style="width: 70%">
      <RelateProgram :caseInfo="caseInfo" @submit-handler="submitRelateProgram" />
    </BasicModal>

    <!-- ???????????? -->
    <BasicModal @register="showRelateTaskRegister" style="width: 70%">
      <RelateTask :caseInfo="caseInfo" @submit-handler="submitRelateTask" />
    </BasicModal>

    <!-- ??????????????? -->
    <BasicModal @register="showTaskTimelineRegister" style="width: 70%">
      <TaskDetail :dataId="caseInfo.id" />
    </BasicModal>

    <!-- ?????????????????? -->
    <BasicModal @register="showAvoidRegister" style="width: 50%">
      <div>??????????????????????????????!</div>
      <!-- <ShowEnforceCertificate :caseInfo="caseInfo" @submit-handler="submitAvoidHandler" /> -->
    </BasicModal>
    <!-- ?????????????????? -->
    <target-detail-save :targetId="caseInfo.targetId" ref="targetDetailRef" />
  </div>
</template>
<style lang="less" scoped>
  .v-case-detail {
    // height: calc(100vh - 110px);
    background-color: #173358;

    .detail {
      background-color: #041c36;
      height: calc(100vh - 110px - 66px);

      .timeline-box {
        background-color: #121b2e;
        border: v-bind('borderColor');
      }
    }
  }
</style>
