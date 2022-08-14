<script setup lang="ts">
  import type { IDiscretionOptions, IProgramItem } from '@/api/program/types'
  import { ArrowRight } from '@vicons/carbon'
  import { discretionOptionDataKey, handleNextStepKey, IDiscretionBaseState } from './foo-keys'
  import { discretionTypeOptions } from '../options'
  import { useMessage } from 'naive-ui'
  import { useModal } from '@/components/modal'
  import EvidenceSelect from '@/views/evidence/index.vue'
  import { IEvidenceConnect } from '@/views/evidence/components/type'
  import type { Ref } from 'vue'

  const props = defineProps({
    // causeId
    programCauseId: {
      type: String as PropType<string>,
      default: ''
    }
  })
  const emits = defineEmits(['handleDiscretionBaseState'])
  const message = useMessage()

  const discretionBaseState = reactive<IDiscretionBaseState>({
    discretionBaseId: '',
    baseValue: 0 // 基准值
  })

  const injectProgramId: Ref<string> = inject('provideProgramId')!
  const programDetail = inject<IProgramItem>('programDetail')
  const injectHandleStepFn: () => void = inject(handleNextStepKey)!
  const injectDiscretionOptions = inject<IDiscretionOptions>(discretionOptionDataKey)!
  const [evidenceModalRegister, { openModal, closeModal }] = useModal({ title: '采集证据' })

  function onNextStep() {
    if (discretionBaseState.discretionBaseId) {
      injectHandleStepFn()
      emits('handleDiscretionBaseState', discretionBaseState)
    } else {
      message.error('请选择裁量类型')
    }
  }

  const evidenceInfo = reactive<IEvidenceConnect>({
    typeId: '',
    typeIdName: '',
    toolType: '',
    proceduresId: parseInt(injectProgramId.value),
    relationType: '3', // 2要素/规则 3: 类型
    timeLineId: programDetail!.timeLineId,
    causeId: props.programCauseId,
    causeRuleId: '' // 选中的裁量规则id
  })

  function onRadioGroupChanged(value: string) {
    evidenceInfo.causeRuleId = value
  }

  // bound evidence files handler
  function onSubmit() {
    closeModal()
  }

  function onUploadEvidence() {
    if (evidenceInfo.causeRuleId) {
      openModal()
      return
    }
    message.error('请点选一项裁量类型')
  }
</script>

<template>
  <div class="discretion-type bg-contentBgColor">
    <n-space vertical>
      <n-radio-group v-model:value="discretionBaseState.discretionBaseId" name="radiogroup" @update:value="onRadioGroupChanged">
        <n-space vertical v-for="item in injectDiscretionOptions.discretionList" :key="item.id" class="my-4">
          <n-space justify="space-between">
            <n-radio :value="item.id" :checked="item.isChecked === 1">
              <span class="font-medium">{{ `${discretionTypeOptions.get(item.discretionTypeId)}（${item.baseKey}）` }}</span>
            </n-radio>
            <!--金额百分比: 1000001; 金额倍数: 1000002;金额幅度 1000000 不需要 baseValue -->
            <!-- 百分比&倍数的时候 输入框输入金额(baseValue), 并显示limit(如果有值)作提示 -->
            <n-space class="pl-1 text-gray-400 text-xs leading-5">
              <span class="pl-4 text-sm" v-if="item.discretionTypeId === '1000001'">{{ `${item.minValue * 100}% - ${item.maxValue * 100}%` }}</span>
              <span class="pl-4 text-sm" v-else-if="item.discretionTypeId === '1000002'">{{ `${item.minValue}倍 - ${item.maxValue}倍` }}</span>
              <span class="pl-4 text-sm" v-if="item.discretionTypeId === '1000001' || item.discretionTypeId === '1000002'">
                {{ item.limitMin ? `金额最小值: ${item.limitMin} -` : '' }} {{ item.limitMax ? `金额最大值: ${item.limitMax}` : '' }}
              </span>
              <n-input-number v-if="item.discretionTypeId !== '1000000'" v-model:value="discretionBaseState.baseValue" size="small" :placeholder="`请输入${item.baseKey}`" :show-button="false" />
            </n-space>
          </n-space>
          <!-- 证据列表 -->
          <div class="bg-highlightBgColor p-2 rounded ml-6" v-for="ele in item.discretionEvidenceList" :key="ele.id">
            <n-space>
              <n-image-group>
                <n-space v-for="i in ele.evidenceDetailedList" :key="i.id">
                  <div v-for="e in i.fileInfoOutputs" :key="e.id"> </div>
                  <n-image v-for="per in ele.evidenceDetailedList" :key="ele.id" width="100" :src="ele.fileInfoOutput.fileUrl" />
                  <!-- <n-image v-for="ele in 3" :key="ele" width="100" height="60" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" /> -->
                </n-space>
              </n-image-group>
              <n-button strong secondary size="small" type="primary" @click="onUploadEvidence">上传材料</n-button>
            </n-space>
          </div>
        </n-space>
      </n-radio-group>
      <n-button type="primary" icon-placement="right" size="large" @click="onNextStep" class="float-right">
        下一步
        <template #icon> <n-icon :component="ArrowRight" /></template>
      </n-button>
    </n-space>
    <basic-modal @register="evidenceModalRegister" style="width: 70%">
      <evidence-select :isSelect="true" :case-info="evidenceInfo" @on-cancel="() => closeModal()" @onSubmit="onSubmit" />
    </basic-modal>
  </div>
</template>
