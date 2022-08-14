<script setup lang="ts">
  import type { IDiscretionOptions, IDiscretionTypeItem, IProgramItem } from '@/api/program/types'
  import { ArrowRight } from '@vicons/carbon'
  import { discretionOptionDataKey, handleNextStepKey, IDiscretionBaseState } from './foo-keys'
  import { discretionTypeOptions } from '../options'
  import { useDialog, useMessage } from 'naive-ui'
  import { useModal } from '@/components/modal'
  import EvidenceSelect from '@/views/evidence/index.vue'
  import { IEvidenceConnect } from '@/views/evidence/components/type'
  import { CloseFilled } from '@vicons/carbon'
  import type { Ref } from 'vue'
  import { cancelBoundEvidenceFile } from '@/api/evidence/evidence'

  const props = defineProps({
    // causeId
    programCauseId: {
      type: String as PropType<string>,
      default: ''
    }
  })
  const emits = defineEmits(['handleDiscretionBaseState', 'currentCheckedMoney'])

  const injectReloadDiscretionDataForJunior = inject<() => Promise<void>>('reloadDiscretionDataForJunior')!
  // 发送裁量基准信息给裁量要素
  const bus = useEventBus('dispatchDiscretionBaseStateKey')
  const message = useMessage()

  // 裁量基准/规则/类型的入参
  const discretionBaseState = reactive<IDiscretionBaseState>({
    discretionBaseId: '',
    baseValue: 0 // 基准值
  })

  // 当前选中的裁量类型item
  const currentSelectDiscretionItem = ref<IDiscretionTypeItem>()

  provide('currentSelectDiscretionItem', currentSelectDiscretionItem)
  const injectProgramDetail: Ref<IProgramItem> = inject('programDetail')!
  const injectHandleStepFn: () => void = inject(handleNextStepKey)!
  const injectDiscretionOptions = inject<IDiscretionOptions>(discretionOptionDataKey)!
  const [evidenceModalRegister, { openModal, closeModal }] = useModal({ title: '采集证据', displayDirective: 'if' })

  function onNextStep() {
    if (discretionBaseState.discretionBaseId) {
      // 1000000 金额幅度 不需要 baseValue
      if (currentSelectDiscretionItem.value?.discretionTypeId === '1000000') {
        injectHandleStepFn()
        emits('handleDiscretionBaseState', discretionBaseState)
        bus.emit(discretionBaseState)
      } else {
        if (discretionBaseState.baseValue > 0) {
          injectHandleStepFn()
          emits('handleDiscretionBaseState', discretionBaseState)
          bus.emit(discretionBaseState)
        } else {
          message.error('请输入裁量基准值')
        }
      }
    } else {
      message.error('请选择裁量类型')
    }
  }

  // 上传证据材料的入参
  const evidenceInfo = reactive<IEvidenceConnect>({
    typeId: '',
    typeIdName: '',
    toolType: '',
    proceduresId: parseInt(unref(injectProgramDetail).id),
    relationType: '3', // 2要素/规则 3: 类型
    timeLineId: unref(injectProgramDetail).timeLineId,
    causeId: props.programCauseId,
    causeDiscretionId: '',
    causeRuleId: '' // 选中的裁量规则id
  })

  function onRadioGroupChanged(value: string) {
    evidenceInfo.causeRuleId = value
    discretionBaseState.discretionBaseId = value
  }

  // bound evidence files handler
  async function onSubmit() {
    await injectReloadDiscretionDataForJunior()
    closeModal()
  }

  // when base value changed
  function onUpdateBaseValue(value: number) {
    discretionBaseState.baseValue = value
  }

  // 上传证据材料
  function onUploadEvidence(id: string) {
    openModal()
    evidenceInfo.causeRuleId = id
  }

  const dialog = useDialog()

  // 取绑证据材料
  function cancelBoundEvidence(id: string) {
    dialog.error({
      title: '提示',
      content: '你确定要删除吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await cancelBoundEvidenceFile(id)
        injectReloadDiscretionDataForJunior()
      }
    })
  }

  watchEffect(() => {
    if (injectDiscretionOptions.discretionList.length > 0) {
      // 查询当前选中的裁量类型
      // const res = injectDiscretionOptions.discretionList.find((item) => item.isChecked === 1)
      const res = injectDiscretionOptions.discretionList.find((item) => item.id === discretionBaseState.discretionBaseId)
      // debugger
      console.log('%c [ res ]-120', 'font-size:13px; background:pink; color:#bf2c9f;', res)
      if (res) {
        res.isChecked = 1
        currentSelectDiscretionItem.value = res
        // discretionBaseState.baseValue = res.baseValue
        discretionBaseState.discretionBaseId = res.id
        emits('currentCheckedMoney', res.discretionResult)
      }
    }
  })

  // 首次进入判断是否有isChecked的
  // watch(
  //   () => injectDiscretionOptions.discretionList,
  //   () => {
  //     const res = injectDiscretionOptions.discretionList.find((item) => item.isChecked === 1)
  //     if (res) {
  //       currentSelectDiscretionItem.value = res
  //       discretionBaseState.baseValue = res.baseValue
  //       discretionBaseState.discretionBaseId = res.id
  //       emits('currentCheckedMoney', res.discretionResult)
  //     }
  //   },
  //   { immediate: true }
  // )

  onMounted(() => {
    const res = injectDiscretionOptions.discretionList.find((item) => item.isChecked === 1)
    if (res) {
      currentSelectDiscretionItem.value = res
      discretionBaseState.baseValue = res.baseValue
      discretionBaseState.discretionBaseId = res.id
      emits('currentCheckedMoney', res.discretionResult)
    }
  })
</script>

<template>
  <div class="discretion-type bg-contentBgColor" v-if="injectDiscretionOptions.discretionList?.length > 0">
    <n-space vertical>
      <n-radio-group :value="discretionBaseState.discretionBaseId" @update:value="onRadioGroupChanged" name="radiogroup">
        <n-space vertical v-for="item in injectDiscretionOptions.discretionList" :key="item.id" class="my-4">
          <n-space justify="space-between">
            <n-radio :value="item.id">
              <span class="font-medium">{{ `${discretionTypeOptions.get(item.discretionTypeId)}（${item.baseKey}）` }}</span>
            </n-radio>
            <!--金额百分比: 1000001; 金额倍数: 1000002; 金额幅度 1000000 不需要 baseValue -->
            <!-- 金额百分比&倍数的时候 输入框输入金额(baseValue), 并显示limit(如果有值)作提示 -->
            <n-space class="pl-1 text-gray-400 text-xs leading-5">
              <span class="pl-4 text-sm" v-if="item.discretionTypeId === '1000000'">{{ `${item.minValue}元 ~ ${item.maxValue}元` }}</span>
              <span class="pl-4 text-sm" v-if="item.discretionTypeId === '1000001'">{{ `${item.minValue * 100}% - ${item.maxValue * 100}%` }}</span>
              <span class="pl-4 text-sm" v-if="item.discretionTypeId === '1000002'">{{ `${item.minValue}倍 - ${item.maxValue}倍` }}</span>
              <span class="pl-4 text-sm" v-if="item.discretionTypeId === '1000001' || item.discretionTypeId === '1000002'">
                {{ item.limitMin ? `金额最小值: ${item.limitMin} -` : '' }} {{ item.limitMax ? `金额最大值: ${item.limitMax}` : '' }}
              </span>
              <n-input-number
                v-if="item.discretionTypeId !== '1000000'"
                v-model:value="discretionBaseState.baseValue"
                @update:value="onUpdateBaseValue"
                size="small"
                :placeholder="`请输入${item.baseKey}`"
                :show-button="false"
              />
              <!-- <n-input-number
                v-if="item.discretionTypeId !== '1000000'"
                :value="discretionBaseState.baseValue"
                @update:value="onUpdateBaseValue"
                size="small"
                :placeholder="`请输入${item.baseKey}`"
                :show-button="false"
              /> -->
            </n-space>
          </n-space>
          <!-- 裁量金额 -->
          <div class="ml-6 text-2xl text-blue-500"> <span class="text-sm text-gray-500">裁量金额：</span> {{ item.discretionResult.discretionMoney }}<span class="text-sm">&nbsp;元</span> </div>
          <!-- 证据列表 -->
          <div v-if="item.isChecked === 1">
            <div class="bg-highlightBgColor px-2 rounded ml-6" v-for="ele in item.discretionEvidenceList" :key="ele.id">
              <n-space justify="space-between">
                <div>{{ ele.name }}</div>
                <n-button strong secondary size="small" type="primary" @click="onUploadEvidence(ele.id)">上传材料</n-button>
              </n-space>
              <div class="my-4">
                <n-space>
                  <n-image-group v-for="i in ele.evidenceDetailedList" :key="i.id">
                    <n-space data-set>
                      <div
                        class="relative h-28 w-28 border border-red-300 border-opacity-25 hover:border-red-500 transition duration-500 ease-in-out"
                        v-for="e in i.fileInfoOutputs"
                        :key="e.evidenceFocusRelationId"
                      >
                        <n-image height="112px" :src="e.fileInfoOutput.fileUrl" />
                        <n-button
                          text
                          type="error"
                          class="absolute -right-1.5 -top-2 transform hover:scale-150 transition duration-500 ease-in-out"
                          @click="cancelBoundEvidence(e.evidenceFocusRelationId)"
                        >
                          <n-icon size="20" :component="CloseFilled" />
                        </n-button>
                      </div>
                    </n-space>
                  </n-image-group>
                </n-space>
              </div>
            </div>
          </div>
        </n-space>
      </n-radio-group>
      <!-- 操作 -->
      <n-button type="primary" icon-placement="right" size="large" @click="onNextStep" class="float-right">
        下一步
        <template #icon> <n-icon :component="ArrowRight" /></template>
      </n-button>
    </n-space>
    <!-- 选择证据 -->
    <basic-modal @register="evidenceModalRegister" style="width: 70%">
      <evidence-select isSelect :case-info="evidenceInfo" @on-cancel="() => closeModal()" @onSubmit="onSubmit" />
    </basic-modal>
  </div>
  <n-empty v-else description="什么都没找到 🤔 " class="py-8" />
</template>
