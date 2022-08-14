<script setup lang="ts">
  import type { IEvidenceGroupType, IEvidenceMenuType } from '@/api/cause-manage/types'
  import { queryEvidenceListForUnlawfulAct } from '@/api/evidence/evidence-name'
  import { useModal } from '@/components/modal'
  import EvidenceList from './evidence-list.vue'

  const props = defineProps<{ groupId: string }>()

  const evidences = ref<IEvidenceMenuType[]>([])
  const groups = ref<IEvidenceGroupType[]>([])

  const [modalRegister, { openModal }] = useModal({
    title: '证据列表'
  })

  async function getEvidences() {
    const res = await queryEvidenceListForUnlawfulAct(props.groupId)
    groups.value = res
  }

  function onViewEvidenceList(list: IEvidenceMenuType[]) {
    openModal()
  }

  getEvidences()
</script>
<template>
  <div class="evidence-list">
    <n-alert title="已绑定的证据分组" type="info" closable class="mb-6"> 点击下方按钮查看详情 </n-alert>
    <n-list bordered>
      <n-list-item v-for="item in evidences" :key="item.id">
        {{ item.name }}
        <template #suffix>
          <n-button type="primary" size="small" @click="onViewEvidenceList(item.baseEvidenceOutputList)"> 查看详情 </n-button>
        </template>
      </n-list-item>
    </n-list>
    <basic-modal @register="modalRegister" style="width: 70%">
      <evidence-list :data="evidences" />
    </basic-modal>
  </div>
</template>
