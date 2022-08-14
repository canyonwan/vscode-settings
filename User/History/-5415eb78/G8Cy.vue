<script setup lang="ts">
  import { deleteCustomDiscretion } from '@/api/program/program'
  import { useCalcMoney } from '@/views/program/discretion/composables/useCalcMoney'
  import { useModal } from '@/components/modal'
  import { IEvidenceConnect } from '@/views/evidence/components/type'
  import EvidenceSelect from '@/views/evidence/index.vue'
  import { CloseFilled } from '@vicons/carbon'
  import { operatorTypeMap } from '@/views/cause-library/discretion/menu/options'
  import { discretionOptionDataKey } from './foo-keys'
  import { useDialog } from 'naive-ui'
  import type { Ref } from 'vue'
  import type { ICalcDiscretionSumFormalParameter, IDiscretionMenuItem, IDiscretionOptions, IProgramItem } from '@/api/program/types'
  import { cancelBoundEvidenceFile } from '@/api/evidence/evidence'
  import { unitIconMap } from '@/views/cause-library/discretion/menu/options'

  const props = defineProps({
    item: {
      type: Object as PropType<IDiscretionMenuItem>,
      default: () => {}
    }
  })

  const dialog = useDialog()
  const discretionData = inject<IDiscretionOptions>(discretionOptionDataKey)!

  const state = ref<IDiscretionMenuItem>()
  const calcMoneyState = inject<ICalcDiscretionSumFormalParameter>('calcMoneyState')
  // 单选集合 (selectType为1的数据集合)
  const discretionElements = inject<Recordable<string[]>>('discretionElements')
  const injectProgramDetail: Ref<IProgramItem> = inject('programDetail')!
  const injectProgramId: Ref<string> = inject('provideProgramId')!
  const [evidenceModalRegister, { openModal, closeModal }] = useModal({ title: '采集证据', displayDirective: 'if' })

  const injectReloadDiscretionDataForJunior = inject<() => Promise<void>>('reloadDiscretionDataForJunior')!

  onBeforeMount(() => {
    state.value = props.item
  })

  const evidenceInfo = reactive<IEvidenceConnect>({
    proceduresId: parseInt(injectProgramId.value),
    relationType: '2', // 2要素/规则 3: 类型
    timeLineId: unref(injectProgramDetail).timeLineId || '',
    causeId: props.item?.causeId || '',
    causeRuleId: props.item.id || '', // 选中的裁量规则id
    typeId: '',
    typeIdName: '',
    toolType: '',
    causeDiscretionId: ''
  })

  // 多选
  function handleUpdateChecked(whetherChecked: boolean): void {
    if (whetherChecked) {
      calcMoneyState!.checkedDiscretionDetail.push({ id: state.value!.id, operatorValue: state.value?.operatorValue })
    } else {
      const index = calcMoneyState!.checkedDiscretionDetail.findIndex((ele) => ele.id === state.value!.id)
      calcMoneyState!.checkedDiscretionDetail.splice(index, 1)
    }
  }

  async function calcTiming() {
    useCalcMoney(calcMoneyState!)
  }

  function pushTiming(str: string) {
    if (state.value!.valueType === 1) {
      calcMoneyState!.checkedDiscretionDetail.push({ id: str, operatorValue: state.value!.operatorValue })
      calcTiming()
    } else {
      calcMoneyState!.checkedDiscretionDetail.push({ id: str, operatorValue: state.value!.unit === 2 ? state.value!.operatorValue / 100 : state.value!.operatorValue })
      if (state.value!.operatorValue > 0) {
        calcTiming()
      }
    }
  }

  function filterPartner(discretionElementsKey: string, optionId: string) {
    discretionElements![discretionElementsKey]
      .filter((broId) => broId !== optionId)
      .forEach((partnerId) => {
        const index = calcMoneyState!.checkedDiscretionDetail.findIndex((item) => item.id === partnerId)
        if (index > -1) {
          calcMoneyState!.checkedDiscretionDetail.splice(index, 1)
        }
      })
  }

  // 单选
  async function handleUpdateRadioChecked(): Promise<void> {
    // 如果选中了且有过值则计算
    // 如果取消选中且也有过值也计算
    const { id: optionId } = state.value!
    for (const key in discretionElements) {
      for (const str of discretionElements[key]) {
        // 如果单选点击的是单选的项
        if (optionId === str) {
          // 从[已选中的要素集合]里找到是不是已经选中过了
          const index = calcMoneyState!.checkedDiscretionDetail.findIndex((ele) => ele.id === optionId)
          if (index > -1) {
            calcMoneyState!.checkedDiscretionDetail.splice(index, 1)
            await calcTiming()
          } else {
            // 1.如果没有选中过就添加进去
            pushTiming(str)
            // 2.并且从单选集合里找到其他同组的partner 找到并且也删除掉
            filterPartner(key, optionId)
          }
        }
      }
    }
  }

  // 当前id 和 calcMoneyState里的checkedDiscretionDetail数组里的id比较
  // 添加上的说明是选中, 不论是接口里的还是正在选中的,
  const whetherRadioChecked = computed(() => {
    return calcMoneyState?.checkedDiscretionDetail.some((item) => item.id === state.value!.id) || false
  })

  function onDeleteCustomDiscretion() {
    dialog.error({
      title: '提示',
      content: '你确定要删除该自定义裁量吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        const index = calcMoneyState!.checkedDiscretionDetail.findIndex((item) => item.id === state.value?.id)
        calcMoneyState!.checkedDiscretionDetail.splice(index, 1)
        await deleteCustomDiscretion(state.value!.id)
        handleDeleteCustomDiscretion(state.value!.id)
      }
    })
  }

  // 删除自定义裁量
  function handleDeleteCustomDiscretion(id: string) {
    const index = discretionData.discretionCustomList.findIndex((item) => item.id === id)
    if (index > -1) {
      discretionData.discretionCustomList.splice(index, 1)
      useCalcMoney(calcMoneyState!)
    }
  }

  function onUpdateOperatorVal(value: number): void {
    value > 0 && debounceFn(value)
  }

  function updateEvidenceMedia(): void {
    openModal()
  }

  const debounceFn = useDebounceFn((value) => {
    // state.value!.operatorValue = value
    for (const ele of calcMoneyState!.checkedDiscretionDetail) {
      if (ele.id === state.value!.id) {
        // ele.operatorValue = value
        if (state.value?.unit === 2) {
          ele.operatorValue = value / 100
        } else {
          ele.operatorValue = value
        }
        useCalcMoney(calcMoneyState!)
      }
    }
  }, 1000)

  // 绑定证据回调
  async function onSubmitEvidence() {
    await injectReloadDiscretionDataForJunior()
    calcMoneyState!.checkedDiscretionDetail.length > 0 && useCalcMoney(calcMoneyState!)
    console.log('%c [  绑定证据回调 ]-171', 'font-size:13px; background:pink; color:#bf2c9f;', calcMoneyState)
    console.log('%c [  绑定证据回调 state]-171', 'font-size:13px; background:pink; color:#bf2c9f;', state.value)
    closeModal()
    for (const item of calcMoneyState!.checkedDiscretionDetail) {
      if (item.id === state.value!.id) {
        state.value!.operatorValue = item.operatorValue
      }
    }
  }

  // 取绑证据材料
  function cancelBoundEvidence(eId: string) {
    dialog.error({
      title: '提示',
      content: '你确定要删除吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await cancelBoundEvidenceFile(eId)
        await injectReloadDiscretionDataForJunior()
        calcMoneyState!.checkedDiscretionDetail.length > 0 && useCalcMoney(calcMoneyState!)
      }
    })
  }

  watch(
    () => props.item,
    (newValue) => {
      state.value = newValue
    }
  )
</script>

<template>
  <div class="d-menu-item ml-4">
    <div v-if="state?.whetherGroupType === 1">
      <div class="m-4 text-purple-500">
        <!-- TAG: 河北裁量没有必选 河南有 -->
        <!-- <span class="text-red-500 text-2xl align-middle" v-show="item.whetherGroupType === 1 && item.whetherSelect === 1">*</span> -->
        {{ `${item.name} (${item.selectType === 1 ? '单选' : '多选'})` }}
      </div>
      <div v-for="per in state.options" :key="per.id">
        <d-menu-item :item="per" />
      </div>
    </div>
    <div v-if="!state?.whetherGroupType || state?.whetherGroupType === 0">
      <!-- 可选项 -->
      <div class="mb-4 p-2 bg-highlightBgColor rounded">
        <n-space justify="space-between" v-if="state?.parentId !== '0'">
          <n-checkbox v-if="state?.selectType === 2" :checked="state.isChecked === 1" @update:checked="handleUpdateChecked">{{
            `${state?.name}  (${state.selectType === 1 ? '单选' : '多选'})`
          }}</n-checkbox>
          <n-checkbox v-else-if="state?.selectType === 1" :checked="whetherRadioChecked" @update:checked="handleUpdateRadioChecked">{{
            `${state.name}   (${state.selectType === 1 ? '单选' : '多选'})`
          }}</n-checkbox>
          <div v-else>{{ state?.name }}</div>
          <n-space>
            <!-- 值类型: 单个值为固定结果(具体值[标准运算值])不可填 -->
            <n-space v-if="state?.valueType === 1 && state.operatorValue > 0" class="text-gray-400">
              {{ operatorTypeMap[state.operatorType] }}{{ state?.unit === 2 ? `${state.operatorValue * 100} ${unitIconMap[state!.unit]}` : state.operatorValue }}
              <!-- {{ `${state.operatorValue * 100} ${state?.unit === 2 && '%'}` }} -->
            </n-space>
            <!-- 值类型: 多个值是范围情况(区间是最大值~最小值),具体值不固定, 需要确定最小值  -->
            <n-space v-if="state?.valueType === 2" align="center">
              <!-- <span class="text-gray-400 leading-5">{{ state?.minValue ? `最小值: ${state?.minValue} ~ ` : '' }} {{ state?.maxValue ? `最大值: ${state?.maxValue} ` : '' }} </span> -->
              <span
                class="text-gray-400 leading-5"
                >{{ state?.unit === 2 ? `${state.minValue * 100}% ~ ${state.maxValue * 100}%` : `${state?.minValue}${unitIconMap[state!.unit]} ~ ${state?.maxValue}${unitIconMap[state!.unit]}` }}</span
              >
              <n-input-number
                v-if="calcMoneyState!.checkedDiscretionDetail.some((item) => item.id === state!.id)"
                :min="state?.unit === 2 ? state?.minValue * 100 : state?.minValue"
                :max="state?.unit === 2 ? state?.maxValue * 100 : state?.maxValue"
                :placeholder="state?.unit === 2 ? `${state?.minValue * 100}~${state?.maxValue * 100}` : `${state?.minValue}~${state?.maxValue}`"
                v-model:value="state!.operatorValue"
                class="w-36"
                clearable
                size="small"
                :show-button="false"
                @update:value="onUpdateOperatorVal"
              />
            </n-space>
            <!-- 自定义裁量 -->
            <div v-if="!state?.selectType">
              {{ operatorTypeMap[state!.operatorType] }}
              <!-- {{ `${state!.operatorValue * 100} ${state?.unit === 2 && '%'}` }} -->
              {{ state?.unit === 2 ? `${state.operatorValue * 100} %` : `${state?.operatorValue} ${unitIconMap[state!.unit]}` }}
              <!-- {{ state?.operatorValue }} {{ unitIconMap[state!.unit] }} -->
            </div>
            <n-button v-if="calcMoneyState!.checkedDiscretionDetail.some((item) => item.id === state!.id)" strong secondary size="small" type="primary" @click="updateEvidenceMedia">上传材料</n-button>
            <!-- 自定义裁量的删除 -->
            <n-button v-if="!state?.selectType" strong secondary size="small" type="error" @click="onDeleteCustomDiscretion">删除</n-button>
          </n-space>
        </n-space>
        <n-space v-else>
          <div>{{ state?.name }}</div>
        </n-space>
        <!-- 证据 -->
        <n-space v-if="calcMoneyState!.checkedDiscretionDetail.some((item) => item.id === state!.id)">
          <!-- <n-space v-show="showEvidence"> -->
          <div class="p-2 rounded ml-6 transition duration-300 ease-in-out" v-for="ele in state?.evidenceDetailedList" :key="ele.id">
            <n-image-group>
              <n-space>
                <div v-for="e in ele.fileInfoOutputs" :key="e.id" class="relative h-28 w-28 border border-red-300 border-opacity-25 hover:border-red-500 transition duration-500 ease-in-out">
                  <n-image :src="e.fileInfoOutput.fileUrl" />
                  <n-button text type="error" class="absolute -right-1.5 -top-2 transform hover:scale-150 transition duration-500 ease-in-out" @click="cancelBoundEvidence(e.evidenceFocusRelationId)">
                    <n-icon size="20" :component="CloseFilled" />
                  </n-button>
                </div>
              </n-space>
            </n-image-group>
          </div>
        </n-space>
      </div>
    </div>
    <basic-modal @register="evidenceModalRegister" style="width: 70%">
      <evidence-select isSelect :case-info="evidenceInfo" @on-cancel="() => closeModal()" @onSubmit="onSubmitEvidence" />
    </basic-modal>
  </div>
</template>
