<template>
  <div class="document-mark rounded-tl-3xl px-5 py-3">
    <e-breadcrumb isDocMake class="pl-7 pb-3" v-if="!Object.keys(caseInfo).length" />
    <!-- <div :style="{ border: Object.keys(caseInfo).length ? '' : '15px solid #0c3157', borderRadius: Object.keys(caseInfo).length ? 0 : '2px' }"> -->
    <div class="content">
      <n-grid :cols="Object.keys(caseInfo).length ? 8 : 20" :x-gap="48" :style="{ height: 'calc(100vh - ' + 185 + 'px)' }">
        <n-gi :span="8">
          <n-scrollbar :style="{ maxHeight: 'calc(100vh - ' + 185 + 'px)' }" class="pr-3">
            <document-model
              :style="{ height: Object.keys(caseInfo).length ? 'calc(100vh - ' + 195 + 'px)' : '', 'overflow-y': Object.keys(caseInfo).length ? 'auto' : 'none' }"
              :modelData="modelData"
              :timeLineData="timeLineData"
              :caseParams="caseParams"
              :dataSet="dataSet"
              @make-document="makeDocument"
              @update-time-line="getDocumentData"
            />
          </n-scrollbar>
        </n-gi>
        <n-gi v-if="!Object.keys(caseInfo).length" :span="10">
          <n-scrollbar :style="{ maxHeight: 'calc(100vh - ' + 185 + 'px)' }" class="pr-3">
            <document-template
              :proceduresId="caseParams.procedureId"
              :documentModelTypeId="currentToolInfo.typeId || ''"
              :timeLineId="caseParams.childTimeLineId"
              :toolId="currentToolInfo.toolId || ''"
              :toolGroupId="currentToolInfo.toolGroupId || ''"
              :documentId="currentToolInfo.dataId || ''"
              :documentRedoId="currentToolInfo.documentRedoId || ''"
              v-if="currentToolInfo.toolId"
              class="p-10 bg-white"
              @update-time-line="getDocumentData"
            />
          </n-scrollbar>
        </n-gi>
        <n-gi v-if="!Object.keys(caseInfo).length" :span="2">
          <div class="back_bg">
            <div class="cursor-pointer back_button_bg bg-blue-50 bg-opacity-10" type="primary" @click="$router.back()">??????<br />?????????</div>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts">
  import { useUserStore } from '@/store/modules/user'
  import { queryChildModel } from '@/api/workflow/model-manage'
  import type { IModelDataInfo } from '@/api/workflow/types'
  import type { ITimeLineTreeLeaf } from '@/api/program/types'
  import { queryTimeLine } from '@/api/program/program'
  import DocumentTemplate from '@/views/document/document-template/index.vue'
  import type { ICurrentToolInfo, IDocumentConnect } from './components/types'
  import DocumentModel from './components/document-model.vue'
  import { typeOptions } from '../options'
  import type { ISelectOption } from '@/components/main-header'
  export default defineComponent({
    name: 'DocumentMark',
    components: {
      DocumentTemplate,
      DocumentModel
    },
    props: {
      caseInfo: {
        type: Object as PropType<IDocumentConnect>,
        default: () => {
          return {}
        }
      }
    },
    emits: ['onSubmit'],
    setup(props, context) {
      const user = useUserStore()
      const route = useRoute()
      const router = useRouter()
      const modelData = ref<IModelDataInfo>() // ??????????????????
      const dataSet = ref({}) // ????????????????????????
      const timeLineData = ref<ITimeLineTreeLeaf>() // ???????????????
      const currentToolInfo = ref<Partial<ICurrentToolInfo>>({})

      const caseParams = ref<IDocumentConnect>({
        processModelId: '',
        parentId: '',
        procedureId: '',
        toolId: '',
        toolGroup: '',
        childTimeLineId: ''
      }) // ??????????????????

      // ????????????????????????
      const getChildModel = async () => {
        modelData.value = await queryChildModel(user.getUserInfo.groupId, caseParams.value.processModelId, caseParams.value.toolId)
      }

      // ??????????????????
      const getDocumentData = async (type = 0) => {
        if (caseParams.value.childTimeLineId) {
          const data = await queryTimeLine(caseParams.value.childTimeLineId)
          timeLineData.value = data.timeLineTree
          dataSet.value = data.dataSet
          if (Object.keys(props.caseInfo).length && type === 0) {
            context.emit('onSubmit')
          }
        }
      }
      onMounted(() => {
        if (Object.keys(props.caseInfo).length) {
          caseParams.value = props.caseInfo
        } else {
          caseParams.value = {
            processModelId: route.query.processModelId as string, //?????????ID
            parentId: route.query.parentId as string, // ???????????????ID
            procedureId: route.query.procedureId as string, // ??????ID
            toolId: route.query.toolId as string, // ??????id
            toolGroup: route.query.toolGroup as string, // ?????????ID
            childTimeLineId: route.query.childTimeLineId as string // ?????????????????????id,??????????????????????????????
          }
        }
        getChildModel()
        getDocumentData(1)
      })

      // ????????????
      const makeDocument = async (toolInfo) => {
        currentToolInfo.value = toolInfo
      }

      const onSubmit = () => {
        context.emit('onSubmit')
      }
      // ????????????
      const clickItemHandler = (item: ISelectOption) => {
        router.push({ name: 'ProgramHome', params: { value: item.value, label: item.label } })
      }

      watch(
        () => props.caseInfo,
        () => {
          // ???????????? ?????????
          caseParams.value = props.caseInfo
          getChildModel()
          getDocumentData(1)
        }
      )
      return {
        typeOptions,
        modelData,
        timeLineData,
        caseParams,
        dataSet,
        getDocumentData,
        makeDocument,
        currentToolInfo,
        onSubmit,
        clickItemHandler
      }
    }
  })
</script>
<style lang="less" scoped>
  .document-mark {
    height: calc(100vh - 110px);
    background-color: #173358;
    // border-image: linear-gradient(180deg, #0c3157 0%, #0e2849 100%);
    .content {
      background-color: #041c36;
      height: calc(100vh - 110px - 66px);
    }

    .back_bg {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 185px);
      background-image: url('@/assets/images/time-line/back_bg.svg');
      background-repeat: no-repeat;
      background-size: 100% 100%;

      .back_button_bg {
        // width: 79px;
        // height: 72px;
        background: #0c3366;
        box-shadow: inset 0px 0px 11px 10px rgba(24, 124, 248, 0.39);
        border-radius: 12px 12px 12px 12px;
        opacity: 1;
        border: 4px solid #041c35;
        // font-size: 14px;
        // padding: 15px 10px;
        // text-align: center;
        // background-color: rgb(19, 54, 92);
        // background-image: url('@/assets/images/time-line/back_button_bg.svg');
        // background-repeat: no-repeat;
        // background-size: cover;
      }
    }
  }
</style>
