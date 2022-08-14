<template>
  <div class="bind-evidence-group">
    <n-button type="primary" class="flex justify-end" @click="() => openModal()">绑定证据分组</n-button>

    <n-collapse class="my-6" v-for="evidenceGroupItem in evidenceGroupTypeList" :key="evidenceGroupItem.id">
      <!-- 分组名 -->
      <n-collapse-item :title="evidenceGroupItem.name" :name="evidenceGroupItem.name">
        <!-- 清单名 -->
        <div class="ml-6 mb-4" v-for="evidenceMenuItem in evidenceGroupItem.baseEvidenceOutputList" :key="evidenceMenuItem.id">
          {{ evidenceMenuItem.name }}
        </div>
      </n-collapse-item>
    </n-collapse>
    <basic-modal @register="modalRegister" style="width: 70%">
      <evidence-group useSelection @submitBindEvidenceGroupHandler="submitBindEvidenceGroupHandler" :boundKeys="evidenceGroupTypeListIds" @cancelBindEvidenceGroup="() => closeModal()" />
    </basic-modal>
  </div>
</template>

<script setup lang="ts">
  import { queryEvidenceGroupListWithDiscretionType, saveEvidenceGroupForDiscretionType } from '@/api/cause-manage/discretion'
  import type { IEvidenceGroupType } from '@/api/cause-manage/types'
  import { useModal } from '@/components/modal'
  import EvidenceGroup from '@/views/cause-library/evidence/group/index'
  const props = defineProps({
    discretionTypeId: {
      type: String as PropType<string>,
      default: ''
    }
  })

  const [modalRegister, { openModal, closeModal }] = useModal({
    title: '新增违法行为证据分组'
  })

  // 证据分组列表
  const evidenceGroupTypeList = ref<IEvidenceGroupType[]>([])
  // 证据分组列表ids
  const evidenceGroupTypeListIds = ref<string[]>([])

  // 查询证据分组列表
  async function getEvidenceGroupType() {
    let data = await queryEvidenceGroupListWithDiscretionType(props.discretionTypeId)
    evidenceGroupTypeListIds.value = data.map((item) => item.id!)
    // TAG TASK(#ID1001082)只展证据规则类型为裁量基准材料的
    evidenceGroupTypeList.value = data.filter((ele) => ele.evidenceRuleTypeId === '1000003')
  }

  // 新增绑定证据分组
  async function submitBindEvidenceGroupHandler(keys: string[]) {
    closeModal()
    let params = {
      discretionTypeId: props.discretionTypeId,
      eviGroupIdList: keys
    }
    await saveEvidenceGroupForDiscretionType(params)
    await getEvidenceGroupType()
  }

  onMounted(() => getEvidenceGroupType())
</script>
