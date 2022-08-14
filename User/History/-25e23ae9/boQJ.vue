<script setup lang="ts">
  import type { IDiscretionMenuItem, IDiscretionOptions, IProgramItem } from '@/api/program/types'
  import { Add, ArrowLeft } from '@vicons/carbon'
  import { discretionOptionDataKey, handleNextStepKey, IDiscretionBaseState } from './foo-keys'
  import DMenuItem from './d-menu-item.vue'
  import { ICalcDiscretionSumFormalParameter } from '@/api/program/types'
  import { Ref } from 'vue'
  import { useModal } from '@/components/modal'
  import CustomDiscretion from './custom-discretion.vue'
  import { useCalcMoney } from '../useCalcMoney'

  const props = defineProps({
    programCauseId: {
      type: String as PropType<string>,
      default: ''
    },
    discretionBaseState: {
      type: Object as PropType<IDiscretionBaseState>,
      default: () => {}
    }
  })

  const [modalRegister, { openModal, closeModal }] = useModal({
    title: '自定义裁量',
    displayDirective: 'if'
  })

  let discretionElements: Recordable<string[]> = {}

  const injectHandleStepFn: () => void = inject(handleNextStepKey)!
  const injectProgramId: Ref<string> = inject('provideProgramId')!
  const programDetail = inject<IProgramItem>('programDetail')
  const { discretionDetailList, discretionCustomList } = inject<IDiscretionOptions>(discretionOptionDataKey)!

  // radio选中的push到checkedDiscretionDetail里
  const calcMoneyState = reactive<ICalcDiscretionSumFormalParameter>({
    proceduresCauseId: props.programCauseId,
    causeDiscretionId: props.discretionBaseState.discretionBaseId,
    timeLineId: programDetail!.timeLineId,
    toolId: '',
    toolGroupId: '',
    proceduresId: unref(injectProgramId),
    baseValue: props.discretionBaseState.baseValue,
    checkedDiscretionDetail: []
  })

  provide('calcMoneyState', calcMoneyState)
  provide('discretionElements', discretionElements)

  function onNextStep() {
    injectHandleStepFn()
  }

  function findOption(list: IDiscretionMenuItem[]) {
    for (const item of list) {
      if (item.whetherGroupType === 1) {
        // 如果当前是组,判断子是否是组,是组继续递归, 不是组递归取id
        const hasNoGroup = item.options.filter((son) => son.whetherGroupType === 0).length
        if (hasNoGroup) {
          // 存在不是组的数据, 则是裁量选项
          discretionElements[item.id] = findIdByGroup(item.options)
        } else {
          findOption(item.options)
        }
      }
    }
  }

  function findIdByGroup(item: IDiscretionMenuItem[]) {
    let ids: string[] = []
    // 当前已有分组,递归循环查询所有子id
    for (const child of item) {
      // 判断当前选项是不是单选,如果是单选 push 到数组中(其他的可能不要管 要拿什么数据 就直接判断是不是那个想要的数据)
      if (child.selectType === 1) {
        ids.push(child.id)
      }
      // 判断当前还有没有子组,如果有继续递找id
      if (child.hashChildren === 1) {
        ids = [...ids, ...findIdByGroup(child.options)]
      }
    }
    return ids
  }

  onMounted(async () => {
    findOption(discretionDetailList)
    if (discretionCustomList.length > 0) {
      calcMoneyState.checkedDiscretionDetail = discretionCustomList.map((item) => {
        return {
          id: item.id,
          operatorValue: item.operatorValue
        }
      })
      await useCalcMoney(calcMoneyState)
    }
  })

  // 自定义裁量回调
  async function handleSubmitCustomDiscretion(customDiscretionRes: IDiscretionMenuItem) {
    discretionCustomList.push(customDiscretionRes)
    calcMoneyState.checkedDiscretionDetail.push({
      id: customDiscretionRes.id,
      operatorValue: customDiscretionRes.operatorValue
    })
    await useCalcMoney(calcMoneyState)
    closeModal()
  }

  function handleDeleteCustomDiscretion(id: string) {
    const index = discretionCustomList.findIndex((item) => item.id === id)
    if (index > -1) {
      discretionCustomList.splice(index, 1)
      useCalcMoney(calcMoneyState)
    }
  }
</script>

<template>
  <div class="discretion-menu">
    <div v-for="item in discretionDetailList" :key="item.id">
      <!-- 是组区分 -->
      <d-menu-item :item="item" />
    </div>
    <!-- 自定义裁量 -->
    <div class="custom-discretion">
      <n-space justify="space-between" class="py-6">
        <div class="text-lg text-blue-500">自定义裁量</div>
        <n-button @click="() => openModal()">
          新增自定义裁量
          <template #icon>
            <n-icon :component="Add" />
          </template>
        </n-button>
      </n-space>
      <div v-for="customItem in discretionCustomList" :key="customItem.id">
        <d-menu-item :item="customItem" @handleDeleteCustomDiscretion="handleDeleteCustomDiscretion" />
      </div>
    </div>

    <n-space justify="end">
      <n-button ghost type="primary" size="large" @click="onNextStep">
        <template #icon>
          <n-icon :component="ArrowLeft" />
        </template>
        返回上一步
      </n-button>
      <n-button type="primary" size="large">完成</n-button>
    </n-space>
    <!-- 自定义裁量 -->
    <basic-modal @register="modalRegister" style="width: 50%">
      <custom-discretion :programCauseId="props.programCauseId" @handleSubmitCustomDiscretion="handleSubmitCustomDiscretion" />
    </basic-modal>
  </div>
</template>
