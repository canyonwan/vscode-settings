<template>
  <div class="tool-express-save">
    <n-form :label-width="140" label-placement="left">
      <n-form-item label="是否显示判定" :show-require-mark="true">
        <n-button @click="handleExpress(1)">编辑</n-button>
      </n-form-item>
      <n-form-item label="是否可用判定" :show-require-mark="true">
        <n-button @click="handleExpress(2)">编辑</n-button>
      </n-form-item>
      <n-form-item label="权限信息" :show-require-mark="true">
        <n-button @click="handlePermissions">编辑</n-button>
      </n-form-item>
    </n-form>
    <model-tool-save :toolData="toolData" :disabled="true" />
    <div class="flex justify-end items-end">
      <n-button @click="handleSubmit" type="primary">确定</n-button>
    </div>
    <basic-modal @register="expressRegister" style="width: 80%" :mask-closable="false">
      <express-group
        v-model:expressionData="expressionData"
        :tool-key-list="toolKeyList"
        :express-type="expressType"
        :logicOptions="logicOptions"
        :judgeLinkLogicList="judgeLinkLogicList"
        @on-submit="handleSubmitExpress"
        :isShowLinkLogic="false"
        ref="expressGroupSubmit"
      />
      <div class="flex justify-end items-end mt-3">
        <n-button class="ml-2" @click="submitExpress" type="primary">确定</n-button>
      </div>
    </basic-modal>
    <!-- 权限信息 -->
    <basic-modal @register="permissionsRegister" :mask-closable="false" style="width: 50%">
      <select-menu-permissions :is-check="true" :bind-keys="permissionsKeys" @on-select="selectPermissions" @close-modal="closeModelPermissions" />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { DropdownOption, useMessage } from 'naive-ui'
  import { BasicModal, useModal } from '@/components/modal'
  import expressGroup from './express-group.vue'
  import ModelToolSave from '../../model-tool/components/model-tool-save.vue'
  import SelectMenuPermissions from './select-menu-permissions.vue'
  import { IAvailableExpressGroup, IDisplayExpressGroup, IPermissionsInfo, IToolInfoExpress } from '@/api/workflow/types'
  import { handleEnumsKeys } from '@/hooks/enums-keys'
  import { validateExpress } from './group-tree'
  export default defineComponent({
    name: 'ToolExpressSave',
    components: {
      expressGroup,
      BasicModal,
      ModelToolSave,
      SelectMenuPermissions
    },
    props: {
      toolData: {
        type: Object as PropType<IToolInfoExpress>,
        default: () => {}
      },
      toolKeyList: {
        // 工具中的key列表
        type: Array as PropType<DropdownOption[]>,
        default: () => []
      }
    },
    emits: ['onSubmit'],
    setup(props, context) {
      const message = useMessage()
      const enumsDataRef = ref()
      const expressGroupSubmit = ref() // 表达式确定
      const state = reactive({
        displayGroups: [] as IDisplayExpressGroup[],
        availableGroups: [] as IAvailableExpressGroup[],
        expressionData: [] as IDisplayExpressGroup[] | IAvailableExpressGroup[],
        toolGroupToolPermissions: [] as IPermissionsInfo[],
        expressType: 1,
        logicOptions: [], // 连接方式
        judgeLinkLogicList: [], // 运算符列表
        permissionsKeys: [] as string[] // 权限信息绑定的id集合
      })
      const [expressRegister, { openModal: openModalExpress, closeModal: closeModal }] = useModal({
        title: '工具判定公式'
      })
      const [permissionsRegister, { openModal: openModalPermissions, closeModal: closeModelPermissions }] = useModal({
        title: '权限信息'
      })

      const getEnumsData = async () => {
        enumsDataRef.value = await handleEnumsKeys(['LinkLogic', 'JudgeLinkLogic'], true)
        state.logicOptions = enumsDataRef.value.LinkLogic
        state.judgeLinkLogicList = enumsDataRef.value.JudgeLinkLogic
      }
      onMounted(() => {
        getEnumsData()
      })

      const handleSubmit = () => {
        const expressData = {
          displayJudgeExpressionGroups: state.displayGroups ? state.displayGroups : [],
          availableJudgeExpressionGroups: state.availableGroups ? state.availableGroups : [],
          toolGroupToolPermissions: state.toolGroupToolPermissions
        }
        const param = { ...props.toolData, ...expressData }
        context.emit('onSubmit', param)
      }
      // 编辑显示判定组
      const handleExpress = (type) => {
        state.expressType = type
        if (type === 1) {
          state.expressionData = state.displayGroups
          if (state.displayGroups && state.displayGroups.length > 0) {
            state.expressionData = state.displayGroups
          } else {
            state.expressionData = [
              {
                toolGroupId: null,
                toolGroupToolRelationId: null,
                type: 1,
                beforeLinkLogic: null,
                sort: 0,
                displayJudgeExpressionGroups: [],
                judgeExpressions: [
                  {
                    toolGroupExpressionGroupId: undefined,
                    judgeLinkLogic: null,
                    beforeLinkLogic: null,
                    keyword: null,
                    operand: null,
                    sort: 0
                  }
                ]
              }
            ]
          }
        } else {
          state.expressionData = state.availableGroups
          if (state.availableGroups && state.availableGroups.length > 0) {
            state.expressionData = state.availableGroups
          } else {
            state.expressionData = [
              {
                toolGroupId: null,
                toolGroupToolRelationId: null,
                type: 2,
                beforeLinkLogic: null,
                sort: 0,
                availableJudgeExpressionGroups: [],
                judgeExpressions: [
                  {
                    toolGroupExpressionGroupId: undefined,
                    judgeLinkLogic: null,
                    beforeLinkLogic: null,
                    keyword: null,
                    operand: null,
                    sort: 0
                  }
                ]
              }
            ]
          }
        }
        openModalExpress()
      }
      // 表达式确定
      const submitExpress = async () => {
        await expressGroupSubmit.value.handleSubmit()
      }
      // 表达式确定回调处理
      const handleSubmitExpress = (data) => {
        const isFull = validateExpress(data, false, state.expressType)
        if (!isFull) {
          message.warning('请检查必填项！')
        } else {
          if (state.expressType === 1) {
            state.displayGroups = data
          } else {
            state.availableGroups = data
          }
          closeModal()
        }
      }
      // 权限信息
      const handlePermissions = () => {
        if (state.toolGroupToolPermissions && state.toolGroupToolPermissions.length) {
          state.permissionsKeys = state.toolGroupToolPermissions.map((item) => item.frontEndPermissionsId)
        } else {
          state.permissionsKeys = []
        }
        openModalPermissions()
      }
      // 权限信息选择的回调
      const selectPermissions = (keys) => {
        if (keys.length) {
          state.toolGroupToolPermissions = keys.map((item) => {
            return {
              toolGroupId: props.toolData.toolGroupId,
              frontEndPermissionsId: item
            }
          })
        } else {
          state.toolGroupToolPermissions = []
        }
      }

      watch(
        () => props.toolData,
        () => {
          state.displayGroups = props.toolData.displayJudgeExpressionGroups
          state.availableGroups = props.toolData.availableJudgeExpressionGroups
          state.toolGroupToolPermissions = props.toolData.toolGroupToolPermissions
        },
        {
          immediate: true
        }
      )
      return {
        permissionsRegister,
        closeModelPermissions,
        expressRegister,
        openModalExpress,
        expressGroupSubmit,
        ...toRefs(state),
        handleSubmit,
        handleExpress,
        submitExpress,
        handleSubmitExpress,
        handlePermissions,
        selectPermissions
      }
    }
  })
</script>
