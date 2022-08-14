<script setup lang="ts">
  import { queryEvidenceListForConfiscate } from '@/api/program/program'
  import type { IEvidenceDataForConfiscateDiscretion } from '@/api/program/types'
  import { RemoveRound, EqualsRound } from '@vicons/material'

  const props = defineProps<{ causeId: string }>()
  const data = ref<IEvidenceDataForConfiscateDiscretion>()

  interface IMoneyState {
    discretionMoney: number
    actualAmount: number
    paidInAmount: number
  }

  const moneyState: IMoneyState = reactive({
    paidInAmount: 0,
    actualAmount: 0,
    discretionMoney: 0
  })

  async function getEvidenceListForConfiscate() {
    data.value = await queryEvidenceListForConfiscate(props.causeId)
  }

  function onCalc(value: number) {
    useDebounce((value: number) => {
      // 
    }, 1000)
  }

  // 收入
  function onUpdatePaidInAmount(value: number) {
    //
  }

  // 成本
  function onUpdateActualAmount(value: number) {
    //
  }

  getEvidenceListForConfiscate()
</script>
<template>
  <div class="save-confiscate">
    <n-card title="" class="mb-4"> evidence </n-card>
    <n-card title="违法所得金额">
      <div class="flex items-center">
        <n-form-item label="收入">
          <n-input-number :show-button="false" clearable :precision="2" :value="moneyState.paidInAmount" @update:value="onUpdatePaidInAmount">
            <template #suffix> 元 </template>
          </n-input-number>
        </n-form-item>

        <div class="mx-4">
          <n-icon size="30" :component="RemoveRound" />
        </div>

        <n-form-item label="成本">
          <n-input-number :show-button="false" :min="0" clearable :precision="2" :value="moneyState.actualAmount" @update:value="onUpdateActualAmount">
            <template #suffix> 元 </template>
          </n-input-number>
        </n-form-item>

        <div class="mx-4">
          <n-icon size="30" :component="EqualsRound" />
        </div>

        <n-form-item label="最终违法所得金额">
          <n-input-number readonly :show-button="false" clearable :precision="2" v-model:value="moneyState.discretionMoney">
            <template #suffix> 元 </template>
          </n-input-number>
        </n-form-item>
      </div>
    </n-card>
  </div>
</template>
