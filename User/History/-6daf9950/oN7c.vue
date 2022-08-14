<script setup lang="ts">
  import type { IEvidenceGroupType } from '@/api/cause-manage/types'
  import { queryEvidenceListForUnlawfulAct } from '@/api/evidence/evidence-name'

  const props = defineProps<{ groupId: string }>()

  const evidences = ref<IEvidenceGroupType[]>([])

  async function getEvidences() {
    const res = await queryEvidenceListForUnlawfulAct(props.groupId)
    evidences.value = res
  }

  getEvidences()
</script>
<template>
  <div class="evidence-list">
    <n-alert title="已绑定的证据分组" type="info" closable class="mb-6"> 点击下方按钮查看详情 </n-alert>
    <n-list bordered>
      <n-list-item v-for="item in evidences" :key="item.id">
        {{ item }}
      </n-list-item>
    </n-list>
  </div>
</template>
