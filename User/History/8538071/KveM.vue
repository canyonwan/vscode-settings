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
    loading: boolean
  }

  const moneyState: IMoneyState = reactive({
    paidInAmount: 0,
    actualAmount: 0,
    discretionMoney: 0,
    loading: false
  })

  async function getEvidenceListForConfiscate() {
    data.value = await queryEvidenceListForConfiscate(props.causeId)
  }

  const calc = useDebounceFn(async () => {
    moneyState.loading = true
    await new Promise((resolve, _) => {
      moneyState.discretionMoney = moneyState.paidInAmount - moneyState.actualAmount
      resolve(true)
    })
    moneyState.loading = false
  }, 500)

  // 收入
  function onUpdatePaidInAmount(value: number) {
    moneyState.paidInAmount = value
    calc()
  }

  // 成本
  function onUpdateActualAmount(value: number) {
    moneyState.actualAmount = value
    calc()
  }

  function onAddCustomEvidence() {
    //
  }

  getEvidenceListForConfiscate()
</script>
<template>
  <div class="save-confiscate">
    <n-card title="" class="mb-4">
      <div v-for="item in data?.evidenceList" :key="item.id">
        <div class="name">{{ item.name }}</div>
        <MediaPreview :values="item.fileList" />
      </div>
      <div class="custom-evidence flex space-around i">
        <div>自定义添加证据项</div>
        <n-button type="primary" @click="onAddCustomEvidence">添加</n-button>
      </div>
    </n-card>
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
          <n-input-number readonly :loading="moneyState.loading" :show-button="false" clearable :precision="2" v-model:value="moneyState.discretionMoney">
            <template #suffix> 元 </template>
          </n-input-number>
        </n-form-item>
      </div>
    </n-card>
  </div>
</template>
